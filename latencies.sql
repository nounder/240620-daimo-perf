create table pg as from 'data/pg.tsv';
create table api as from 'data/api.tsv';
create table rpc as from 'data/rpc.tsv';

create table latencies as
select
    extract(ms from pg.time - rpc.time) as pg_notify,
    extract(ms from api.time - rpc.time) as trpc_emit
from pg, api, rpc
where
    pg.num = api.lastBlock
    and pg.num = rpc.number;

select *
from latencies
where pg_notify > 0 and trpc_emit > 0;

select
    avg(pg_notify),
    min(pg_notify),
    max(pg_notify),
    stddev_pop(pg_notify)
from latencies
where pg_notify > 0;

select
    avg(trpc_emit),
    min(trpc_emit),
    max(trpc_emit),
    stddev_pop(trpc_emit)
from latencies
where trpc_emit > 0;
