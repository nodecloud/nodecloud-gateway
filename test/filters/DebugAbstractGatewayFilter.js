import AbstractGatewayFilter from '../../lib/filter/AbstractGatewayFilter';

export default class DebugAbstractGatewayFilter extends AbstractGatewayFilter {
    constructor(app) {
        super(app);
    }

    async shouldFilter(ctx) {
        return ctx.get('X-REQUIRE-GATEWAY') === 'true';
    }

    async action(ctx) {
        ctx.set('X-DEBUG-GATEWAY', true);
    }
}
