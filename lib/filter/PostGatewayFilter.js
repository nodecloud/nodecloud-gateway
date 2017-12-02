import AbstractGatewayFilter from './AbstractGatewayFilter';

export default class PostGatewayFilter extends AbstractGatewayFilter {
    constructor(app) {
        super(app);
    }

    filterType() {
        return 'post';
    }
}
