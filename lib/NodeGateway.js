import _ from 'lodash';

import GatewayRunner from './GatewayRunner';
import {isKoaIns, isValidClient} from './util/check';
import parseRouteConfig from './util/parseRouteConfig';

export default class NodeGateway {
    static getGatewayRunner(app) {
        if (!this.gatewayRunner) {
            this.gatewayRunner = new GatewayRunner(app);
        }
        return this.gatewayRunner;
    }

    /**
     * normal init
     * @param app
     * @param filterClasses
     */
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

    /**
     * init gateway in nodecloud
     * @param app
     * @param filterClasses
     * @param routeConfig
     * @param client reference(https://github.com/nodecloud/nodecloud-boot)
     */
    initWithService(app, filterClasses = [], routeConfig, client) {
        if (!isKoaIns(app)) {
            throw new Error('Invalid app instance');
        }
        if (!_.isArray(filterClasses)) {
            filterClasses = [];
        }
        if (!isValidClient(client)) {
            throw new Error('Invalid client');
        }

        // add default service filter
        // filterClasses.push(ServiceGatewayFilter);
        app.context.routeConfig = parseRouteConfig(routeConfig);
        app.context.serviceClient = client;

        let gatewayRunner = NodeGateway.getGatewayRunner(app);
        gatewayRunner.init(filterClasses);
    }
}
