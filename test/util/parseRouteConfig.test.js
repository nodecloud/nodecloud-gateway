import test from 'ava';
import _ from 'lodash';

import parseRouteConfig from '../../lib/util/parseRouteConfig';

test('getDefaultRouteConfig', (t) => {
    let routeConfig = parseRouteConfig();
    t.is(_.has(routeConfig, 'prefix'), true);
    t.is(_.has(routeConfig, 'routes'), true);
    t.is(_.has(routeConfig, 'options'), true);
    routeConfig = parseRouteConfig({
        prefix: '/api',
        ignorePattern: '\/composer\/list',
        routes: {
            "cloud-service": {
                path: "/clouds/**",
                ignorePattern: '\/clouds\/ignore'
            },
        }
    });
    console.log(JSON.stringify(routeConfig));
    t.is(_.get(routeConfig, 'ignoreRegx') instanceof RegExp, true);
    t.is(_.get(routeConfig, ['routes', 'cloud-service', 'ignoreRegx']) instanceof RegExp, true);
});
