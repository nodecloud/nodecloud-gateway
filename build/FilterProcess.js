'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FilterProcess {
    constructor(filters = []) {
        this.filters = _lodash2.default.isArray(filters) ? filters : [];
    }

    runFilters(filterType) {
        let filters = _lodash2.default.filter(this.filters, filter => {
            return filterType === filter.filterType() && !filter.loaded;
        });
        filters.sort((a, b) => {
            return a.filterOrder() - b.filterOrder();
        }).forEach(filter => {
            filter.run();
        });
    }
}
exports.default = FilterProcess;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9GaWx0ZXJQcm9jZXNzLmpzIl0sIm5hbWVzIjpbIkZpbHRlclByb2Nlc3MiLCJjb25zdHJ1Y3RvciIsImZpbHRlcnMiLCJpc0FycmF5IiwicnVuRmlsdGVycyIsImZpbHRlclR5cGUiLCJmaWx0ZXIiLCJsb2FkZWQiLCJzb3J0IiwiYSIsImIiLCJmaWx0ZXJPcmRlciIsImZvckVhY2giLCJydW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFHZSxNQUFNQSxhQUFOLENBQW9CO0FBQy9CQyxnQkFBWUMsVUFBVSxFQUF0QixFQUEwQjtBQUN0QixhQUFLQSxPQUFMLEdBQWUsaUJBQUVDLE9BQUYsQ0FBVUQsT0FBVixJQUFxQkEsT0FBckIsR0FBK0IsRUFBOUM7QUFDSDs7QUFFREUsZUFBV0MsVUFBWCxFQUF1QjtBQUNuQixZQUFJSCxVQUFVLGlCQUFFSSxNQUFGLENBQVMsS0FBS0osT0FBZCxFQUF1QkksVUFBVTtBQUMzQyxtQkFBT0QsZUFBZUMsT0FBT0QsVUFBUCxFQUFmLElBQXNDLENBQUNDLE9BQU9DLE1BQXJEO0FBQ0gsU0FGYSxDQUFkO0FBR0FMLGdCQUFRTSxJQUFSLENBQWEsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEtBQVU7QUFDbkIsbUJBQU9ELEVBQUVFLFdBQUYsS0FBa0JELEVBQUVDLFdBQUYsRUFBekI7QUFDSCxTQUZELEVBRUdDLE9BRkgsQ0FFV04sVUFBVTtBQUNqQkEsbUJBQU9PLEdBQVA7QUFDSCxTQUpEO0FBS0g7QUFkOEI7a0JBQWRiLGEiLCJmaWxlIjoiRmlsdGVyUHJvY2Vzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsdGVyUHJvY2VzcyB7XG4gICAgY29uc3RydWN0b3IoZmlsdGVycyA9IFtdKSB7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IF8uaXNBcnJheShmaWx0ZXJzKSA/IGZpbHRlcnMgOiBbXTtcbiAgICB9XG5cbiAgICBydW5GaWx0ZXJzKGZpbHRlclR5cGUpIHtcbiAgICAgICAgbGV0IGZpbHRlcnMgPSBfLmZpbHRlcih0aGlzLmZpbHRlcnMsIGZpbHRlciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyVHlwZSA9PT0gZmlsdGVyLmZpbHRlclR5cGUoKSAmJiAhZmlsdGVyLmxvYWRlZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGZpbHRlcnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEuZmlsdGVyT3JkZXIoKSAtIGIuZmlsdGVyT3JkZXIoKTtcbiAgICAgICAgfSkuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgICAgICAgZmlsdGVyLnJ1bigpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=