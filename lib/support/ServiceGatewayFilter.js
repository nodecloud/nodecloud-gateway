import _ from 'lodash';
import URL from 'url';
import path from 'path';
import httpProxy from 'http-proxy';

import RouteGatewayFilter from '../filter/RouteGatewayFilter';
import {isValidClient} from '../util/check';

export default class ServiceGatewayFilter extends RouteGatewayFilter {
    constructor(app) {
        super(app);
    }

    async shouldFilter(ctx) {
        if (!isValidClient(ctx.serviceClient)) {
            return false;
        }
        if (!_.isObjectLike(ctx.routeConfig)) {
            return false;
        }
        return ServiceGatewayFilter.isMatchPrefix(ctx.url, ctx.routeConfig.prefix);
    }

    static isMatchPrefix(url, prefix) {
        if (!url) {
            return false
        }
        if (!prefix) {
            return true;
        }
        const urlObject = URL.parse(url);
        return path.join(urlObject.pathname, '/').indexOf(prefix) === 0;
    }

    static async getServiceEndpoint(serviceName, client) {
        let serviceClient = client.getClient(serviceName),
            service = await serviceClient.getService();
        if (!service) {
            throw new Error('None incorrect service');
        }
        return {
            host: _.get(service, ['Service', 'Address']),
            port: _.get(service, ['Service', 'Port'])
        };
    }

    static getProxyOptions(routeConfig, routeOptions) {
        return _.assign(
            {
                prependPath: true,
                ignorePath: true
            },
            routeConfig.options,
            routeOptions
        );
    }

    static getMatchRoute(requestPath, routeConfig) {
        let matchRoute = null,
            maxMatchLen = 0;
        _.forEach(routeConfig.routes, (route, serviceName) => {
            if (requestPath.indexOf(route.pathPrefix) !== 0) {
                return;
            }
            if (route.pathPrefix.length > maxMatchLen) {
                matchRoute = {
                    route,
                    serviceName
                };
            }
        });
        return matchRoute;
    }

    static async getTargetOptions(requestUrl, routeConfig, client) {
        const urlObject = URL.parse(requestUrl);
        let pathname = path.join(urlObject.pathname, '/');
        const matchRoute = ServiceGatewayFilter.getMatchRoute(pathname, routeConfig);
        if (!matchRoute) {
            return null;
        }
        const route = matchRoute.route;
        // If route.url is existed, forward directly
        if (route.url) {
            return _.assign(
                {target: route.url},
                route.options
            );
        }
        if (route.stripPrefix) {
            pathname = pathname.slice(route.pathPrefix.length);
        } else {
            pathname = pathname.slice(routeConfig.prefix.length);
        }
        let endpoint = await ServiceGatewayFilter.getServiceEndpoint(matchRoute.serviceName, client);
        urlObject.protocol = urlObject.protocol || 'http';
        urlObject.host = null;
        urlObject.hostname = endpoint.host;
        urlObject.port = endpoint.port;
        urlObject.pathname = pathname;
        urlObject.path = null;
        urlObject.href = null;
        return _.assign(
            {target: URL.format(urlObject)},
            route.options
        );
    }

    async action(ctx) {
        const routeConfig = ctx.routeConfig;
        const client = ctx.serviceClient;
        const targetOptions = await ServiceGatewayFilter.getTargetOptions(ctx.url, routeConfig, client);
        if (!targetOptions) {
            return;
        }
        await new Promise((resolve, reject) => {
            let proxy = httpProxy.createProxyServer({});
            proxy.web(
                ctx.req,
                ctx.res,
                ServiceGatewayFilter.getProxyOptions(routeConfig, targetOptions)
            );
            proxy.on('error', (err) => {
                reject(err);
            });
            proxy.on('close', (res) => {
                resolve(res);
            });
        });
        ctx.respond = false;
    }
}