import _ from 'lodash';


export default class FilterProcess {
    constructor(filters = []) {
        this.filters = _.isArray(filters) ? filters : [];
    }

    runFilters(filterType) {
        let filters = _.filter(this.filters, filter => {
            return filterType === filter.filterType() && !filter.loaded;
        });
        filters.sort((a, b) => {
            return a.filterOrder() - b.filterOrder();
        }).forEach(filter => {
            filter.run();
        });
    }
}
