import PreGatewayFilter from '../../lib/filter/PreGatewayFilter';

export default class DebugPreGatewayFilter extends PreGatewayFilter {
    constructor(app) {
        super(app);
    }

    async action(ctx) {
        let str = ctx.get('X-GATEWAY-TEST-ORDER') || '';
        ctx.set('X-GATEWAY-TEST-ORDER', str + ',PRE');
    }
}
