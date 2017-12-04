import test from 'ava';
import Koa from 'koa';
import _ from 'lodash';
import request from 'supertest';

import {routeApp} from './support';
import DebugAbstractGatewayFilter from './filters/DebugAbstractGatewayFilter';
import DebugPreGatewayFilter from './filters/DebugPreGatewayFilter';
import DebugRouteGatewayFilter from './filters/DebugRouteGatewayFilter';
import DebugPostGatewayFilter from './filters/DebugPostGatewayFilter';

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
    t.is(debugInstance.filterType(), 'route');
    t.is(debugInstance.filterOrder(), 5);
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

test('DebugPreGatewayFilter.Constructor', t => {
    const app = new Koa();
    let debugInstance = new DebugPreGatewayFilter(app);
    t.is(debugInstance.filterType(), 'pre');
    t.is(debugInstance.filterOrder(), 5);
});

test('DebugRouteGatewayFilter.Constructor', t => {
    const app = new Koa();
    let debugInstance = new DebugRouteGatewayFilter(app);
    t.is(debugInstance.filterType(), 'route');
    t.is(debugInstance.filterOrder(), 5);
    t.is(_.has(debugInstance, 'proxy'), true);
});

test('DebugPostGatewayFilter.Constructor', t => {
    const app = new Koa();
    let debugInstance = new DebugPostGatewayFilter(app);
    t.is(debugInstance.filterType(), 'post');
    t.is(debugInstance.filterOrder(), 5);
});