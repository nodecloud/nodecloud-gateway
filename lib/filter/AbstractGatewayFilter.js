import {isKoaIns} from '../util/check';

export default class AbstractGatewayFilter {
    constructor(app) {
        if (!isKoaIns(app)) {
            throw new Error('Invalid app instance');
        }
        this.app = app;
        this.loaded = false;
    }

    filterType() {
        return 'route';
    }

    filterOrder() {
        return 5;
    }

    async shouldFilter(ctx) {
        return true;
    }

    async action(ctx) {

    }

    run() {
        this.app.use(async (ctx, next) => {
            let should = await this.shouldFilter(ctx);
            if (!should) {
                return next();
            }
            await this.action(ctx);
            return next();
        });
        this.loaded = true;
    }
}
