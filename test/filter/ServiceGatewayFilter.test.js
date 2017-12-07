import test from 'ava';
import Koa from 'koa';
import request from 'supertest';
import http from 'http';
import _ from 'lodash';

import {getMockClient} from '../support';
import ServiceGatewayFilter from '../../lib/support/ServiceGatewayFilter';
import parseRouteConfig from '../../lib/util/parseRouteConfig';

test.cb('ServiceGatewayFilter.shouldFilter', (t) => {
    let app = new Koa();
    app.context.routeConfig = parseRouteConfig({
        prefix: '/api'
    });
    app.context.serviceClient = getMockClient();
    let filter = new ServiceGatewayFilter(app);
    app.use(async (ctx, next) => {
        ctx.url = '/api/cloud-service/v1/clouds';
        t.is(await filter.shouldFilter(ctx), true);
        ctx.url = '/ap/cloud-service';
        t.is(await filter.shouldFilter(ctx), false);
    });
    request(app.listen())
        .get('/')
        .end((err, res) => {
            if (err) {
                throw err;
            }
            t.end();
        })
});

test('ServiceGatewayFilter.isMatchPrefix', (t) => {
    t.is(
        ServiceGatewayFilter.isMatchPrefix(),
        false
    );
    t.is(
        ServiceGatewayFilter.isMatchPrefix('http://example.com'),
        true
    );
    t.is(
        ServiceGatewayFilter.isMatchPrefix('http://example.com/api/example', '/api/'),
        true
    );
});

test('ServiceGatewayFilter.getMatchRoute', (t) => {
    let matchRoute = ServiceGatewayFilter.getMatchRoute(
        '/api/example/a/b/',
        parseRouteConfig({
            prefix: '',
            routes: {
                'service0': {
                    path: '/api/example/**'
                },
                'service1': {
                    path: '/api/example/a/**'
                },
                'service2': {
                    path: '/api/example/a/b/**'
                }
            }
        })
    );
    t.is(
        matchRoute.serviceName,
        'service2'
    );
    matchRoute = ServiceGatewayFilter.getMatchRoute(
        '/api/example/',
        parseRouteConfig({
            prefix: '/api',
            routes: {
                'service0': {
                    path: '/example1/**'
                },
                'service1': {
                    path: '/example/**'
                }
            }
        })
    );
    t.is(
        matchRoute.serviceName,
        'service1'
    );
});

test('ServiceGatewayFilter.getTargetOptions', async (t) => {
    let targetOptions = await ServiceGatewayFilter.getTargetOptions(
        'http://example.com/api/example/a/b?a=1#abc',
        parseRouteConfig({
            prefix: '/api',
            routes: {
                'service0': {
                    path: '/example1/**'
                },
                'service1': {
                    path: '/example/**'
                }
            }
        }),
        getMockClient()
    );
    t.is(
        targetOptions.target,
        'http://localhost:3001/example/a/b/?a=1#abc'
    );
    targetOptions = await ServiceGatewayFilter.getTargetOptions(
        'http://192.168.0.30:3000/api/example/a/b?a=1#abc',
        parseRouteConfig({
            routes: {
                'service0': {
                    path: '/example1/**'
                },
                'service1': {
                    path: '/example/**'
                }
            }
        }),
        getMockClient()
    );
    t.is(
        targetOptions,
        null
    );
    targetOptions = await ServiceGatewayFilter.getTargetOptions(
        'http://192.168.0.30:3000/api/example/a/b?a=1#abc',
        parseRouteConfig({
            routes: {
                'service0': {
                    path: '/example1/**'
                },
                'service1': {
                    path: '/api/example/**',
                    url: 'http://example.com/example/a/b?a=1#abc'
                }
            }
        }),
        getMockClient()
    );
    t.is(
        targetOptions.target,
        'http://example.com/example/a/b?a=1#abc'
    );
});

