import httpProxy from 'http-proxy';

import AbstractGatewayFilter from './AbstractGatewayFilter';

export default class RouteGatewayFilter extends AbstractGatewayFilter {
    constructor(app) {
        super(app);
        this.proxy = httpProxy.createProxyServer({});
    }

    filterType() {
        return 'route';
    }
}