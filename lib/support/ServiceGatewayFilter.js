import _ from 'lodash';
import URL from 'url';
import path from 'path';

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
        return urlObject.pathname.indexOf(prefix) === 0;
    }

    async getServiceEndpoint(serviceName, client) {
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

    static getProxyOptions(routeConfig, serviceName) {
        return _.assign(
            routeConfig.options,
            _.get(routeConfig, ['routes', 'serviceName', 'options'], {})
        );
    }

    async action(ctx) {
        const routeConfig = ctx.routeConfig;
        const client = ctx.serviceClient;
        const urlObject = URL.parse(ctx.url);
        let pathname = urlObject.pathname;
        _.some(routeConfig.routes, async (route, serviceName) => {
            if (pathname.indexOf(route.pathPrefix) !== 0) {
                return false;
            }
            pathname = pathname.slice(route.pathPrefix.length);
            let endpoint = await this.getServiceEndpoint(serviceName, client);
            urlObject.host = endpoint.host;
            urlObject.port = endpoint.port;
            urlObject.pathname = pathname;
            this.proxy.web(ctx.request, ctx.response, _.assign(
                {target: URL.format(urlObject)},
                ServiceGatewayFilter.getProxyOptions(routeConfig, serviceName)
            ));
            ctx.respond = false;
            return true;
        });
    }
}
