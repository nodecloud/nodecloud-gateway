import PostGatewayFilter from '../../lib/filter/PostGatewayFilter';

export default class DebugPostGatewayFilter extends PostGatewayFilter {
    constructor(app) {
        super(app);
    }

    async action(ctx) {
        let str = ctx.response.headers['x-gateway-test-order'] || '';
        ctx.set('x-gateway-test-order', str + ',POST');
    }
}
