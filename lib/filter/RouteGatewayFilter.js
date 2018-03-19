import httpProxy from 'http-proxy';

import AbstractGatewayFilter from './AbstractGatewayFilter';

export default class RouteGatewayFilter extends AbstractGatewayFilter {
    constructor(app) {
        super(app);
        this.proxy = httpProxy.createProxyServer({});
        this.proxy.on('error', function (err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({message: err.message, status: 500}));
        });
    }

    filterType() {
        return 'route';
    }
}