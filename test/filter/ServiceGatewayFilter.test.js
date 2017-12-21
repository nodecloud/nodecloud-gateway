import test from 'ava';
import Koa from 'koa';
import request from 'supertest';

import {getMockClient} from '../support';
import ServiceGatewayFilter from '../../lib/support/ServiceGatewayFilter';
import {routeApp} from '../support/index';
import parseRouteConfig from '../../lib/util/parseRouteConfig';

test.cb('ServiceGatewayFilter.shouldFilter', (t) => {
    let app = new Koa();
    app.context.routeConfig = parseRouteConfig({
        prefix: '/api',
        ignorePattern: /\/v2\/clouds/
    });
    app.context.serviceClient = getMockClient();
    let filter = new ServiceGatewayFilter(app);
    app.use(async (ctx, next) => {
        ctx.url = '/api/cloud-service/v1/clouds';
        t.is(await filter.shouldFilter(ctx), true);
        ctx.url = '/ap/cloud-service';
        t.is(await filter.shouldFilter(ctx), false);
        ctx.url = '/api/cloud-service/v2/clouds';
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
        }),
        '/api/example/a/b/',
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
        }),
        '/api/example/',
    );
    t.is(
        matchRoute.serviceName,
        'service1'
    );
    matchRoute = ServiceGatewayFilter.getMatchRoute(
        '/api/example/a/',
        parseRouteConfig({
            prefix: '/api',
            routes: {
                'service0': {
                    path: '/example1/**'
                },
                'service1': {
                    path: '/example/**',
                    ignorePattern: /\/example\/a\//
                }
            }
        }),
        '/api/example/a/',
    );
    t.is(
        matchRoute,
        null
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
        'http://localhost:3001/example/a/b?a=1#abc'
    );
    targetOptions = await ServiceGatewayFilter.getTargetOptions(
        'http://192.168.0.30:3000/api/example/a/b?a=1#abc',
        parseRouteConfig({
            routes: {
                'service0': {
                    path: '/example1/**',
                    url: '/'
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
        'http://192.168.0.30:3000/api/example/a/b?a=1',
        parseRouteConfig({
            routes: {
                'service0': {
                    path: '/example1/**'
                },
                'service1': {
                    path: '/api/example/**',
                    url: 'http://example.com/example/a/b?a=1'
                }
            }
        }),
        getMockClient()
    );
    t.is(
        targetOptions.target,
        'http://example.com/example/a/b?a=1'
    );
    targetOptions = await ServiceGatewayFilter.getTargetOptions(
        'http://192.168.0.30:3000/api/example1/login',
        parseRouteConfig({
            routes: {
                'service0': {
                    path: '/api/example1/**'
                },
                'service1': {
                    path: '/api/example/**',
                    url: 'http://example.com/example/a/b?a=1'
                }
            }
        }),
        getMockClient()
    );
    t.is(
        targetOptions.target,
        'http://localhost:3001/api/example1/login'
    );
    targetOptions = await ServiceGatewayFilter.getTargetOptions(
        'http://192.168.0.30:3000/api/example1/login/',
        parseRouteConfig({
            routes: {
                'service0': {
                    path: '/api/example1/**'
                },
                'service1': {
                    path: '/api/example/**',
                    url: 'http://example.com/example/a/b?a=1'
                }
            }
        }),
        getMockClient()
    );
    t.is(
        targetOptions.target,
        'http://localhost:3001/api/example1/login/'
    );
});

test.cb('ServiceGatewayFilter.action', (t) => {
    let gatewayApp = new Koa(),
        serviceApp = new Koa();
    gatewayApp.context.routeConfig = parseRouteConfig({
        prefix: '/api',
        ignorePattern: /\?ignore=1/,
        routes: {
            'service0': {
                path: '/example1/**',
                url: 'http://localhost:3001'
            },
            'service1': {
                path: '/example/a/b/**',
                ignorePattern: /a=2/
            },
        }
    });
    gatewayApp.context.serviceClient = getMockClient();
    let filter = new ServiceGatewayFilter(gatewayApp);
    filter.run();
    routeApp(gatewayApp);
    serviceApp.use(async function (ctx, next) {
        ctx.body = 'service';
    });
    serviceApp.listen(3001, () => {
        request(gatewayApp.listen())
            .get('/api/example/a/b/?a=1')
            .then(res => {
                t.is(res.text, 'service');
                return request(gatewayApp.listen())
                    .get('/api/example1/a/b/?a=1');
            })
            .then(res => {
                t.is(res.text, 'service');
                return request(gatewayApp.listen())
                    .get('/api/example/a/b/?ignore=1')
            })
            .then(res => {
                t.is(res.text, 'Hello World');
                return request(gatewayApp.listen())
                    .get('/api/example/a/b/?a=2')
            })
            .then(res => {
                t.is(res.text, 'Hello World');
                t.end();
            });
    });
});

