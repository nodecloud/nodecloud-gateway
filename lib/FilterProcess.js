import _ from 'lodash';


export default class FilterProcess {
    constructor(filters = []) {
        this.filters = _.isArray(filters) ? filters : [];
    }

    runFilters(filterType) {
        _.forEach(this.filters, filter => {
            if (filterType === filter.filterType() && !filter.loaded) {
                filter.run();
            }
        });
    }
}
