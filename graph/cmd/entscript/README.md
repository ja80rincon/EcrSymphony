# Entscript

This binary should be used to run custom ent "scripts" on the database.
This is safer than performing manual sql queries on database.


## How to create your script

First add your migration file inside the `entscript/migrations` folder.

The file should be at the format `migrate_{migration_date}_{migration_name}.go`.

Inside you should have function with the following signature:
```go
type migrationFunc func(ctx context.Context, logger *zap.Logger) error
```
With the context you would access to `ent.Client` for use. If you return error all the operations
you performed with Ent will be rolled back

After that you should connect your function with a name inside `entscript/migration.go`:
```go
var migrationMap = map[string]migrationFunc{
	"sample": migrations.MigrateSample,
}
```

## How to test

Build and re-create graph
```shell script
$ docker-compose build graph
$ docker-compose up -d
```

Connect to graph docker instance
```shell script
$ docker-compose exec graph /bin/sh
```

From docker instance
```shell script
$ /bin/entscript --tenant=fb-test --user=fbuser@fb.com --migration=sample
```

## How to run in production

After you merged your changes to production and verified production contains your changes

### Connect to production pods
- Connect to production context
```shell script
$ kubectl config use-context symphony-production
```
- Verify you're on the right context (where the "*" is)
```shell script
$ kubectl config get-contexts
``` 
- Find the pod names and choose one of the graph's pods (for later use in `{graph_pod_name}`):
```shell script
$ kubectl get pods
```

Connect to graph kubernetes instance
```shell script
$ kubectl exec {graph_pod_name} -it --container graph -- sh
```
From kubernetes instance
```shell script
$ /bin/entscript --tenant=fb-test --user=fbuser@fb.com --migration=sample
```
By default, feature flags are not enabled. 
If your migration depends on a feature flag in a tenant, you can import the flags:
```shell script
$ /bin/entscript --tenant=fb-test --user=fbuser@fb.com --migration=sample --db-url=$DB_URL --features-url=http://symphony-front:1030/features
```
