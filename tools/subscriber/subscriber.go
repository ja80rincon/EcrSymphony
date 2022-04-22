// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"github.com/alecthomas/kong"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

const (
	connectionInitMsg = "connection_init" // Client -> Server
	startMsg          = "start"           // Client -> Server
	connectionAckMsg  = "connection_ack"  // Server -> Client
	connectionKaMsg   = "ka"              // Server -> Client
	dataMsg           = "data"            // Server -> Client
	errorMsg          = "error"           // Server -> Client
	completeMsg       = "complete"        // Server -> Client
)

type operationMessage struct {
	Payload json.RawMessage `json:"payload,omitempty"`
	ID      string          `json:"id,omitempty"`
	Type    string          `json:"type"`
}

func main() {
	var cli struct {
		ConnectTimeout time.Duration `default:"30s" help:"Maximum time allowed for connection."`
		Compressed     bool          `help:"Enable websocket compression."`
		Insecure       bool          `short:"k" help:"Allow insecure server connections when using SSL."`
		Verbose        bool          `short:"v" help:"Make the operation more talkative."`
		User           string        `short:"u" xor:"auth" placeholder:"<user:password>" help:"Server user and password."`
		Bearer         string        `xor:"auth" placeholder:"<token>" help:"OAuth 2 Bearer Token."`
		Query          string        `short:"q" required:"" placeholder:"<query>" help:"Server subscription query."`
		URL            *url.URL      `arg:"" required:"" help:"Server URL."`
	}
	kong.Parse(&cli, kong.Description("A GraphQL subscription testing client."))

	cfg := zap.NewDevelopmentConfig()
	if !cli.Verbose {
		cfg.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
	}
	logger, _ := cfg.Build(zap.AddStacktrace(zap.FatalLevel + 1))

	header := make(http.Header)
	if cli.User != "" {
		header.Set("Authorization",
			"Basic "+base64.StdEncoding.EncodeToString([]byte(cli.User)),
		)
	} else if cli.Bearer != "" {
		header.Set("Authorization", "Bearer "+cli.Bearer)
	}

	dialer := websocket.DefaultDialer
	dialer.HandshakeTimeout = cli.ConnectTimeout
	dialer.EnableCompression = cli.Compressed
	dialer.Subprotocols = []string{"graphql-ws"}
	if cli.Insecure {
		dialer.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	}

	logger.Debug("dialing to endpoint", zap.Stringer("url", cli.URL))
	conn, rsp, err := dialer.Dial(cli.URL.String(), header)
	if err != nil {
		fields := []zap.Field{zap.Error(err)}
		if rsp != nil {
			body, _ := ioutil.ReadAll(rsp.Body)
			fields = append(fields,
				zap.Int("status", rsp.StatusCode),
				zap.ByteString("response", body),
			)
		}
		logger.Fatal("cannot connect to endpoint", fields...)
	}
	logger.Debug("established websocket connection")
	rsp.Body.Close()
	defer conn.Close()

	initMsg := operationMessage{Type: connectionInitMsg}
	if authorization := header.Get("Authorization"); authorization != "" {
		initMsg.Payload, _ = json.Marshal(map[string]string{
			"Authorization": authorization,
		})
	}
	logger.Debug("writing init message")
	if err := conn.WriteJSON(initMsg); err != nil {
		logger.Fatal("cannot write init message", zap.Error(err))
	}

	logger.Debug("waiting for ack message")
	var ack operationMessage
	if err := conn.ReadJSON(&ack); err != nil {
		logger.Fatal("cannot read ack message", zap.Error(err))
	} else if ack.Type != connectionAckMsg {
		logger.Fatal("received unexpected message type", zap.String("type", ack.Type))
	}
	logger.Debug("received ack message")

	logger.Debug("waiting for keepalive message")
	var ka operationMessage
	if err = conn.ReadJSON(&ka); err != nil {
		logger.Fatal("cannot read ka message", zap.Error(err))
	} else if ka.Type != connectionKaMsg {
		logger.Fatal("received unexpected message type", zap.String("type", ack.Type))
	}
	logger.Debug("received keepalive message")

	payload, err := json.Marshal(map[string]string{"query": cli.Query})
	if err != nil {
		logger.Fatal("cannot marshal start message payload", zap.Error(err))
	}
	logger.Debug("writing start message", zap.String("query", cli.Query))
	if err = conn.WriteJSON(operationMessage{
		Type:    startMsg,
		ID:      "1",
		Payload: payload,
	}); err != nil {
		logger.Fatal("cannot write start message", zap.Error(err))
	}

	logger.Debug("listening on subscription")
	for {
		switch data, err := next(conn); err {
		default:
			logger.Info("subscription message",
				zap.Reflect("data", data),
				zap.Error(err),
			)
		case io.EOF:
			logger.Fatal("subscription data stream completed")
		case io.ErrUnexpectedEOF:
			logger.Fatal("subscription connection terminated")
		}
	}
}

func next(conn *websocket.Conn) (interface{}, error) {
	op := operationMessage{Type: connectionKaMsg}
	for op.Type == connectionKaMsg {
		if err := conn.ReadJSON(&op); err != nil {
			return nil, fmt.Errorf("reading operation message: %w", err)
		}
	}
	switch op.Type {
	case dataMsg:
	case completeMsg:
		return nil, io.EOF
	case errorMsg:
		return nil, fmt.Errorf("received error message: %q", op.Payload)
	default:
		return nil, fmt.Errorf("received bad message: %#v", op)
	}

	var raw struct {
		Data   interface{}
		Errors json.RawMessage
	}
	if err := json.Unmarshal(op.Payload, &raw); err != nil {
		return nil, fmt.Errorf("decoding message data: %w", err)
	}

	var err error
	if raw.Errors != nil {
		err = errors.New(string(raw.Errors))
	}
	return raw.Data, err
}
