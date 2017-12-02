import _ from 'lodash';

import GatewayRunner from './GatewayRunner';
import {isKoaIns} from './util/check';

export default class NodeGateway {
    static getGatewayRunner(app) {
        if (!this.gatewayRunner) {
            this.gatewayRunner = new GatewayRunner(app);
        }
        return this.gatewayRunner;
    }

    init(app, filterClasses = []) {
        if (!isKoaIns(app)) {
            throw new Error('Invalid app instance');
        }
        if (!_.isArray(filterClasses)) {
            filterClasses = [];
        }
        let gatewayRunner = NodeGateway.getGatewayRunner(app);
        gatewayRunner.init(filterClasses);
    }
}
