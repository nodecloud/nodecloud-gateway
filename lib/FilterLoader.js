import _ from 'lodash';

import AbstractGatewayFilter from './filter/AbstractGatewayFilter';
import PreGatewayFilter from './filter/PreGatewayFilter';

let loaderIns = null;

export default class FilterLoader {
    static getInstance() {
        if (!loaderIns) {
            loaderIns = new FilterLoader();
        }
        return loaderIns;
    }

    constructor() {
        if (loaderIns) {
            return loaderIns;
        }
        loaderIns = this;
        return this;
    }

    loadFilters(filterClasses = [], app) {
        if (_.isEmpty(filterClasses)) {
            return [];
        }
        return filterClasses
            .filter(klass => {
                return new klass(app) instanceof AbstractGatewayFilter;
            })
            .map(klass => {
                return new klass(app);
            });
    }

    // TODO will be added in the future
    loadFiltersByPath(basePath, app) {

    }
}
