import PreGatewayFilter from '../filter/PreGatewayFilter';

export default class ForwardHeaderFilter extends PreGatewayFilter {
    constructor(app) {
        super(app);
    }

    async action(ctx) {
        ctx.set('X-NODE-GATEWAY', true);
        let vias = (ctx.get('Via') || '').split(',');
        vias.push('1.1 NodeGateway');
        ctx.set('Via', vias.join(','));
    }
}