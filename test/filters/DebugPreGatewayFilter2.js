import PreGatewayFilter from '../../lib/filter/PreGatewayFilter';

export default class DebugPreGatewayFilter2 extends PreGatewayFilter {
    constructor(app) {
        super(app);
    }

    filterOrder() {
        return 6;
    }

    async action(ctx) {
        let str = ctx.response.headers['x-gateway-test-order'] || '';
        ctx.set('x-gateway-test-order', str + ',PRE2');
    }
}
