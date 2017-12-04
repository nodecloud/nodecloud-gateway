import _ from 'lodash';
import path from 'path';
import URL from 'url';


const defRouteConfig = {
    prefix: '',
    routes: {},
    options: {}
};
const pathRegx = /\/([a-zA-z\-_\d.]+)\/\*\*/;

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
                _.get(pathRegx.exec(route.path), 1)
            ).split('/').filter(str => !_.isEmpty(str));
        }
    });

    return routeConfig;
}

