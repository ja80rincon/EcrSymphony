// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package viewertest

import (
	"context"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/migrate"
	"github.com/hashicorp/go-multierror"

	// register sqlite3 for testing
	_ "github.com/mattn/go-sqlite3"
)

// Tenancy lazily opens and cached ent clients.
type Tenancy struct {
	mu      sync.Mutex
	clients map[string]*ent.Client
}

// ClientFor implements viewer.Tenancy interface.
func (t *Tenancy) ClientFor(ctx context.Context, name string) (*ent.Client, error) {
	t.mu.Lock()
	defer t.mu.Unlock()
	if client, ok := t.clients[name]; ok {
		return client, nil
	}
	client, err := ent.Open("sqlite3",
		fmt.Sprintf("file:%d-%d?mode=memory&cache=shared&_fk=1",
			os.Getpid(), time.Now().UnixNano(),
		),
	)
	if err != nil {
		return nil, err
	}
	if err := client.Schema.Create(ctx, migrate.WithGlobalUniqueID(true)); err != nil {
		return nil, err
	}
	if t.clients == nil {
		t.clients = map[string]*ent.Client{}
	}
	t.clients[name] = client
	return client, nil
}

// Close implements io.Closer interface.
func (t *Tenancy) Close() error {
	t.mu.Lock()
	defer t.mu.Unlock()
	err := &multierror.Error{}
	for _, client := range t.clients {
		err = multierror.Append(err, client.Close())
	}
	t.clients = nil
	return err.ErrorOrNil()
}
