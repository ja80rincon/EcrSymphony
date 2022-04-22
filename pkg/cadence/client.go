// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package cadence

import (
	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"
	"go.uber.org/yarpc"
	"go.uber.org/yarpc/transport/tchannel"
	"go.uber.org/zap"
)

const (
	cadenceClientName      = "cadence-client"
	cadenceFrontendService = "cadence-frontend"
)

func ProvideClient(logger *zap.Logger, address string) (workflowserviceclient.Interface, func(), error) {
	ch, err := tchannel.NewChannelTransport(
		tchannel.ServiceName(cadenceClientName))
	if err != nil {
		logger.Error("cannot create transport channel", zap.Error(err))
		return nil, nil, err
	}
	dispatcher := yarpc.NewDispatcher(yarpc.Config{
		Name: cadenceClientName,
		Outbounds: yarpc.Outbounds{
			cadenceFrontendService: {
				Unary: ch.NewSingleOutbound(address),
			},
		},
	})
	if err := dispatcher.Start(); err != nil {
		logger.Error("cannot start dispatcher", zap.Error(err))
		return nil, nil, err
	}
	return workflowserviceclient.New(dispatcher.ClientConfig(cadenceFrontendService)), func() {
		_ = dispatcher.Stop()
	}, nil
}
