Measure latencies for Shovel indexing a new block and Daimo API pushing an update
via TRPC `onAccountUpdate` subscription. Treat new block notification as baseline.

To trace TRPC, ensure that the server sends update on every block in `onAccountUpdate`,
and not only when there are new transfers for a user.

# Environment

 - Daimo API server running on the same machine.
 - RPC Provider same as one used on staging Daimo and in the same geo region (<5ms latency)
 - Postgres database running in different datacenter but in close geo proximity (~20ms laty)


# Collect data

Run those commands in parallel

```
deno run -A --unsafely-ignore-certificate-errors rpc.js > data/rpc.tsv

deno run -A api.ts > data/api.tsv

deno run -A --unsafely-ignore-certificate-errors pg.js > data/pg.tsv
```

# Analyze data

```
$ duckdb < latencies.sql 


┌───────────────────┬────────────────┬────────────────┬───────────────────────┐
│  avg(pg_notify)   │ min(pg_notify) │ max(pg_notify) │ stddev_pop(pg_notify) │
│      double       │     int64      │     int64      │        double         │
├───────────────────┼────────────────┼────────────────┼───────────────────────┤
│ 568.5408163265306 │             43 │           1911 │    312.72620118157045 │
└───────────────────┴────────────────┴────────────────┴───────────────────────┘
┌───────────────────┬────────────────┬────────────────┬───────────────────────┐
│  avg(trpc_emit)   │ min(trpc_emit) │ max(trpc_emit) │ stddev_pop(trpc_emit) │
│      double       │     int64      │     int64      │        double         │
├───────────────────┼────────────────┼────────────────┼───────────────────────┤
│ 4189.658291457286 │           2026 │           5597 │     891.1819624916385 │
└───────────────────┴────────────────┴────────────────┴───────────────────────┘
```
