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
        const routeConfig = ctx.routeConfig;
        if (routeConfig.ignorePattern instanceof RegExp && routeConfig.ignorePattern.test(ctx.url)) {
            routeConfig.ignorePattern.lastIndex = 0;
            return false;
        }
        return ServiceGatewayFilter.isMatchPrefix(ctx.url, routeConfig.prefix);
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

    static getMatchRoute(requestPath, routeConfig, requestUrl) {
        let matchRoute = null,
            maxMatchLen = 0;
        _.forEach(routeConfig.routes, (route, serviceName) => {
            if (requestPath.indexOf(route.pathPrefix) !== 0) {
                return;
            }
            if (route.ignorePattern instanceof RegExp && route.ignorePattern.test(requestUrl)) {
                route.ignorePattern.lastIndex = 0;
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
        const hasSuffixSlash = _.endsWith(urlObject.pathname, '/');
        let pathname = path.join(urlObject.pathname, '/');
        const matchRoute = ServiceGatewayFilter.getMatchRoute(pathname, routeConfig, requestUrl);
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
        if (!hasSuffixSlash) {
            pathname = _.trimEnd(pathname, '/');
        }
        let endpoint = await ServiceGatewayFilter.getServiceEndpoint(matchRoute.serviceName, client);
        urlObject.protocol = urlObject.protocol || 'http';
        urlObject.host = null;
        urlObject.hostname = endpoint.host;
        urlObject.port = endpoint.port;
        urlObject.pathname = pathname;
        urlObject.path = null;
        urlObject.href = null;
        urlObject.serviceName = matchRoute.serviceName;
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

        let responseHeader = {};
        if (responseHeader = routeConfig.options.responseHeader) {
            for (const key in responseHeader) {
                if (!responseHeader.hasOwnProperty(key)) {
                    continue;
                }
                ctx.res.setHeader(key, responseHeader[key]);
            }
        }

        this.proxy.web(
            ctx.req,
            ctx.res,
            ServiceGatewayFilter.getProxyOptions(routeConfig, targetOptions)
        );
        this.proxy.on('error', function (err, req, res) {
            try {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
            } catch (ignore) {
            }

            if (err && !res) {
                let serviceClient = client.getClient(targetOptions.serviceName);
                serviceClient.removeUnavailableNode(`${targetOptions.hostname}:${targetOptions.port}`)
            }

            res.end(JSON.stringify({message: err.message, status: 500}));
        });
        ctx.respond = false;
    }
}
