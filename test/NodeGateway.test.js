import test from 'ava';

import NodeGateway from '../lib/NodeGateway';

test('Constructor', t => {
    let gateway = new NodeGateway();
    t.is(typeof gateway.init, 'function');
});
