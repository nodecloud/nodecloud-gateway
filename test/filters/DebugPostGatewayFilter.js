import PostGatewayFilter from '../../lib/filter/PostGatewayFilter';

export default class DebugPostGatewayFilter extends PostGatewayFilter {
    constructor(app) {
        super(app);
    }

    async action(ctx) {
        let str = ctx.get('X-GATEWAY-TEST-ORDER') || '';
        ctx.set('X-GATEWAY-TEST-ORDER', str + ',POST');
    }
}
