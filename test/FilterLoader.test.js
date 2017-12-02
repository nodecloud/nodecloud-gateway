import test from 'ava';
import Koa from 'koa';

import FilterLoader from '../lib/FilterLoader';
import ForwardHeaderFilter from '../lib/support/ForwardHeaderFilter';

const app = new Koa();

test('Constructor', t => {
    let loader = new FilterLoader(),
        loader2 = new FilterLoader(),
        loader3 = FilterLoader.getInstance();
    t.is(loader, loader2);
    t.is(loader2, loader3);
});
test('loadFilters', t => {
    t.is(0, FilterLoader.getInstance().loadFilters().length);
    t.is(0, FilterLoader.getInstance().loadFilters([]).length);
    t.is(0, FilterLoader.getInstance().loadFilters(1).length);
    t.is(1, FilterLoader.getInstance().loadFilters([ForwardHeaderFilter], app).length);
});
