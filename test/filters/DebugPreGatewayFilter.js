import PreGatewayFilter from '../../lib/filter/PreGatewayFilter';

export default class DebugPreGatewayFilter extends PreGatewayFilter {
    constructor(app) {
        super(app);
    }

    async action(ctx) {
        let str = ctx.response.headers['x-gateway-test-order'] || '';
        ctx.set('x-gateway-test-order', str + ',PRE');
    }
}
