import AbstractGatewayFilter from './AbstractGatewayFilter';

export default class PreGatewayFilter extends AbstractGatewayFilter {
    constructor(app) {
        super(app);
    }

    filterType() {
        return 'pre';
    }
}
