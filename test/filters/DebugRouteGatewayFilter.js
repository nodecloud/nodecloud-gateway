import RouteGatewayFilter from '../../lib/filter/RouteGatewayFilter';

export default class DebugRouteGatewayFilter extends RouteGatewayFilter {
    constructor(app) {
        super(app);
    }

    async action(ctx) {
        let str = ctx.response.headers['x-gateway-test-order'] || '';
        ctx.set('x-gateway-test-order', str + ',ROUTE');
    }
}
