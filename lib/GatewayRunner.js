import FilterLoader from './FilterLoader';
import FilterProcess from './FilterProcess';

export default class GatewayRunner {
    constructor(app) {
        this.app = app;
    }

    init(filterClasses = []) {
        let process = new FilterProcess(
            FilterLoader.getInstance().loadFilters(filterClasses, this.app)
        );
        process.runFilters('pre');
        process.runFilters('route');
        process.runFilters('post');
    }
}