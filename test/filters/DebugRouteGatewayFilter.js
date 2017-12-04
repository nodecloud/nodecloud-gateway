import RouteGatewayFilter from '../../lib/filter/RouteGatewayFilter';

export default class DebugRouteGatewayFilter extends RouteGatewayFilter {
    constructor(app) {
        super(app);
    }

    async action(ctx) {
        let str = ctx.get('X-GATEWAY-TEST-ORDER') || '';
        ctx.set('X-GATEWAY-TEST-ORDER', str + ',ROUTE');
    }
}
