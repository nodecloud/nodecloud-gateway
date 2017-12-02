import test from 'ava';

import FilterLoader from '../lib/FilterLoader';

test('Constructor', t => {
    let loader = new FilterLoader(),
        loader2 = new FilterLoader();
    t.is(loader, loader2);
});
