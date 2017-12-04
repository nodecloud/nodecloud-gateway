import test from 'ava';
import _ from 'lodash';
import Koa from 'koa';
import request from 'supertest';

import FilterProcess from '../lib/FilterProcess';
import DebugPreGatewayFilter from './filters/DebugPreGatewayFilter';
import DebugRouteGatewayFilter from './filters/DebugRouteGatewayFilter';
import DebugPostGatewayFilter from './filters/DebugPostGatewayFilter';
import {routeApp} from './support';


test('Constructor', t => {
    let filterProcess = new FilterProcess();
    t.is(_.isArray(filterProcess.filters), true);
});

test.cb('runFilters() to test type', t => {
    const app = new Koa();
    let filters = [
        DebugPreGatewayFilter,
        DebugRouteGatewayFilter,
        DebugPostGatewayFilter
    ].map(klass => new klass(app));
    let filterProcess = new FilterProcess(filters);
    filterProcess.runFilters('pre');
    filterProcess.runFilters('route');
    filterProcess.runFilters('post');
    routeApp(app);
    request(app.listen())
        .get('/')
        .expect(200)
        .end((err, res) => {
            if (err) {
                throw err;
            }
            t.is(res.header['x-gateway-test-order'], ',PRE,ROUTE,POST');
            t.end();
        });
});