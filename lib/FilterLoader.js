import _ from 'lodash';

import AbstractGatewayFilter from './filter/AbstractGatewayFilter';

let loaderIns = null;

export default class FilterLoader {
    static getInstance() {
        if (!loaderIns) {
            loaderIns = new FilterLoader();
        }
        return loaderIns;
    }

    constructor() {
        return FilterLoader.getInstance();
    }

    loadFilters(filterClasses = [], app) {
        if (_.isEmpty(filterClasses)) {
            return [];
        }
        return filterClasses
            .filter(klass => {
                return klass instanceof AbstractGatewayFilter
            })
            .map(klass => {
                return new klass(app);
            });
    }

    // TODO will be added in the future
    loadFiltersByPath(basePath, app) {

    }
}
