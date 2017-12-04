import test from 'ava';
import Koa from 'koa';
import _ from 'lodash';
import request from 'supertest';

import {routeApp} from './support';
import DebugAbstractGatewayFilter from './filters/DebugAbstractGatewayFilter';

test('DebugAbstractGatewayFilter.Constructor', t => {
    const app = new Koa();
    t.throws(() => {
        new DebugAbstractGatewayFilter({});
        new DebugAbstractGatewayFilter({
            use: function () {
            }
        });
        new DebugAbstractGatewayFilter({
            callback: function () {
            }
        });
    });
    let debugInstance = new DebugAbstractGatewayFilter(app);
    t.is(_.has(debugInstance, 'app'), true);
    t.is(_.get(debugInstance, 'loaded') === false, true);
});

test.cb('DebugAbstractGatewayFilter.shouldFilter', t => {
    const app = new Koa();
    let debugIns = new DebugAbstractGatewayFilter(app);
    debugIns.run();
    routeApp(app);
    request(app.listen())
        .get('/')
        .set('X-REQUIRE-GATEWAY', true)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                t.end();
                throw err;
            }
            t.is(res.headers['x-debug-gateway'], 'true');
            t.end();
        });
});