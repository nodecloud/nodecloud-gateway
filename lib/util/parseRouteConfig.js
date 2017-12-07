import _ from 'lodash';
import path from 'path';

const defRouteConfig = {
    prefix: '',
    routes: {},
    options: {}
};
const pathRegx = /^\/((?:[a-zA-z\-_\d.]+\/)*)\*{2}$/;

export default function parseRouteConfig(routeConfig) {
    routeConfig = _.assign({}, defRouteConfig, routeConfig);

    // convert some value
    if (_.isString(routeConfig['ignorePattern'])) {
        routeConfig['ignoreRegx'] = new RegExp(routeConfig['ignorePattern']);
    }
    // add '/' in prefix
    routeConfig['prefix'] = path.join(routeConfig['prefix'], '/');
    _.forEach(routeConfig['routes'], (route, key) => {
        _.defaults(route, {path: '', options: {}});
        if (_.isString(route['ignorePattern'])) {
            route['ignoreRegx'] = new RegExp(route['ignorePattern']);
        }
        // todo: not route invalid route.path
        if (route.path) {
            route['pathPrefix'] = path.join(
                '/',
                routeConfig['prefix'],
                _.get(pathRegx.exec(route.path), 1, ''),
                '/'
            );
        }
    });

    return routeConfig;
}
