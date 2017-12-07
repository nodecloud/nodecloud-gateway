'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _AbstractGatewayFilter = require('./filter/AbstractGatewayFilter');

var _AbstractGatewayFilter2 = _interopRequireDefault(_AbstractGatewayFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let loaderIns = null;

class FilterLoader {
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
        if (_lodash2.default.isEmpty(filterClasses)) {
            return [];
        }
        return filterClasses.filter(klass => {
            return new klass(app) instanceof _AbstractGatewayFilter2.default;
        }).map(klass => {
            return new klass(app);
        });
    }

    // TODO will be added in the future
    loadFiltersByPath(basePath, app) {}
}
exports.default = FilterLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9GaWx0ZXJMb2FkZXIuanMiXSwibmFtZXMiOlsibG9hZGVySW5zIiwiRmlsdGVyTG9hZGVyIiwiZ2V0SW5zdGFuY2UiLCJjb25zdHJ1Y3RvciIsImxvYWRGaWx0ZXJzIiwiZmlsdGVyQ2xhc3NlcyIsImFwcCIsImlzRW1wdHkiLCJmaWx0ZXIiLCJrbGFzcyIsIm1hcCIsImxvYWRGaWx0ZXJzQnlQYXRoIiwiYmFzZVBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7OztBQUVBLElBQUlBLFlBQVksSUFBaEI7O0FBRWUsTUFBTUMsWUFBTixDQUFtQjtBQUM5QixXQUFPQyxXQUFQLEdBQXFCO0FBQ2pCLFlBQUksQ0FBQ0YsU0FBTCxFQUFnQjtBQUNaQSx3QkFBWSxJQUFJQyxZQUFKLEVBQVo7QUFDSDtBQUNELGVBQU9ELFNBQVA7QUFDSDs7QUFFREcsa0JBQWM7QUFDVixZQUFJSCxTQUFKLEVBQWU7QUFDWCxtQkFBT0EsU0FBUDtBQUNIO0FBQ0RBLG9CQUFZLElBQVo7QUFDQSxlQUFPLElBQVA7QUFDSDs7QUFFREksZ0JBQVlDLGdCQUFnQixFQUE1QixFQUFnQ0MsR0FBaEMsRUFBcUM7QUFDakMsWUFBSSxpQkFBRUMsT0FBRixDQUFVRixhQUFWLENBQUosRUFBOEI7QUFDMUIsbUJBQU8sRUFBUDtBQUNIO0FBQ0QsZUFBT0EsY0FDRkcsTUFERSxDQUNLQyxTQUFTO0FBQ2IsbUJBQU8sSUFBSUEsS0FBSixDQUFVSCxHQUFWLDRDQUFQO0FBQ0gsU0FIRSxFQUlGSSxHQUpFLENBSUVELFNBQVM7QUFDVixtQkFBTyxJQUFJQSxLQUFKLENBQVVILEdBQVYsQ0FBUDtBQUNILFNBTkUsQ0FBUDtBQU9IOztBQUVEO0FBQ0FLLHNCQUFrQkMsUUFBbEIsRUFBNEJOLEdBQTVCLEVBQWlDLENBRWhDO0FBaEM2QjtrQkFBYkwsWSIsImZpbGUiOiJGaWx0ZXJMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgQWJzdHJhY3RHYXRld2F5RmlsdGVyIGZyb20gJy4vZmlsdGVyL0Fic3RyYWN0R2F0ZXdheUZpbHRlcic7XG5cbmxldCBsb2FkZXJJbnMgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWx0ZXJMb2FkZXIge1xuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFsb2FkZXJJbnMpIHtcbiAgICAgICAgICAgIGxvYWRlcklucyA9IG5ldyBGaWx0ZXJMb2FkZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9hZGVySW5zO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBpZiAobG9hZGVySW5zKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9hZGVySW5zO1xuICAgICAgICB9XG4gICAgICAgIGxvYWRlcklucyA9IHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxvYWRGaWx0ZXJzKGZpbHRlckNsYXNzZXMgPSBbXSwgYXBwKSB7XG4gICAgICAgIGlmIChfLmlzRW1wdHkoZmlsdGVyQ2xhc3NlcykpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyQ2xhc3Nlc1xuICAgICAgICAgICAgLmZpbHRlcihrbGFzcyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBrbGFzcyhhcHApIGluc3RhbmNlb2YgQWJzdHJhY3RHYXRld2F5RmlsdGVyO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoa2xhc3MgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcga2xhc3MoYXBwKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRPRE8gd2lsbCBiZSBhZGRlZCBpbiB0aGUgZnV0dXJlXG4gICAgbG9hZEZpbHRlcnNCeVBhdGgoYmFzZVBhdGgsIGFwcCkge1xuXG4gICAgfVxufVxuIl19