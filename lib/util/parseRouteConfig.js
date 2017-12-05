import _ from 'lodash';
import path from 'path';

const defRouteConfig = {
    prefix: '',
    routes: {},
    options: {}
};
const pathRegx = /^\/([a-zA-z\-_\d.]+)\/\*{2}$/;

export default function parseRouteConfig(routeConfig) {
    routeConfig = _.assign({}, defRouteConfig, routeConfig);

    // convert some value
    if (_.isString(routeConfig['ignorePattern'])) {
        routeConfig['ignoreRegx'] = new RegExp(routeConfig['ignorePattern']);
    }
    _.forEach(routeConfig['routes'], (route, key) => {
        _.defaults(route, {path: '', options: {}});
        if (_.isString(route['ignorePattern'])) {
            route['ignoreRegx'] = new RegExp(route['ignorePattern']);
        }
        if (route.path) {
            route['pathPrefix'] = path.join(
                routeConfig['prefix'],
                _.get(pathRegx.exec(route.path), 1, '')
            ).split('/').filter(str => !_.isEmpty(str));
        }
    });

    return routeConfig;
}

