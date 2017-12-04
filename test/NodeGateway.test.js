import test from 'ava';
import _ from 'lodash';
import Koa from 'koa';
import request from 'supertest';

import NodeGateway from '../lib/NodeGateway';
import DebugAbstractGatewayFilter from './filters/DebugAbstractGatewayFilter';
import DebugPreGatewayFilter from './filters/DebugPreGatewayFilter';
import DebugRouteGatewayFilter from './filters/DebugRouteGatewayFilter';
import DebugPostGatewayFilter from './filters/DebugPostGatewayFilter';
import {routeApp} from './support';

test('Constructor', t => {
    let gateway = new NodeGateway();
    t.is(typeof gateway.init, 'function');
});

test.cb('init', t => {
    const gateway = new NodeGateway();
    const app = new Koa();
    gateway.init(app, [
        DebugAbstractGatewayFilter,
        DebugPostGatewayFilter,
        DebugRouteGatewayFilter,
        DebugPreGatewayFilter
    ]);
    routeApp(app);
    request(app.listen())
        .get('/')
        .expect(200)
        .set('X-REQUIRE-GATEWAY', true)
        .end((err, res) => {
            if (err) {
                throw new Error(err);
            }
            t.is(res.header['x-debug-gateway'], 'true');
            t.is(res.header['x-gateway-test-order'], ',PRE,ROUTE,POST');
            t.end();
        });
});
