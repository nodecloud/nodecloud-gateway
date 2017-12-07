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
    // add '/' in prefix
    routeConfig['prefix'] = path.join(routeConfig['prefix'], '/');
    _.forEach(routeConfig['routes'], (route, key) => {
        _.defaults(route, {path: '', options: {}});
        // todo: not route invalid route.path
        if (route.path) {
            let matchPath = _.get(pathRegx.exec(route.path), 1, '');
            route['pathPrefix'] = matchPath ? path.join(
                '/',
                routeConfig['prefix'],
                matchPath,
                '/'
            ) : null;
        }
    });

    return routeConfig;
}

