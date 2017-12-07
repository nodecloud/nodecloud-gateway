'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _AbstractGatewayFilter = require('./filter/AbstractGatewayFilter');

var _AbstractGatewayFilter2 = _interopRequireDefault(_AbstractGatewayFilter);

var _PreGatewayFilter = require('./filter/PreGatewayFilter');

var _PreGatewayFilter2 = _interopRequireDefault(_PreGatewayFilter);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9GaWx0ZXJMb2FkZXIuanMiXSwibmFtZXMiOlsibG9hZGVySW5zIiwiRmlsdGVyTG9hZGVyIiwiZ2V0SW5zdGFuY2UiLCJjb25zdHJ1Y3RvciIsImxvYWRGaWx0ZXJzIiwiZmlsdGVyQ2xhc3NlcyIsImFwcCIsImlzRW1wdHkiLCJmaWx0ZXIiLCJrbGFzcyIsIm1hcCIsImxvYWRGaWx0ZXJzQnlQYXRoIiwiYmFzZVBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSUEsWUFBWSxJQUFoQjs7QUFFZSxNQUFNQyxZQUFOLENBQW1CO0FBQzlCLFdBQU9DLFdBQVAsR0FBcUI7QUFDakIsWUFBSSxDQUFDRixTQUFMLEVBQWdCO0FBQ1pBLHdCQUFZLElBQUlDLFlBQUosRUFBWjtBQUNIO0FBQ0QsZUFBT0QsU0FBUDtBQUNIOztBQUVERyxrQkFBYztBQUNWLFlBQUlILFNBQUosRUFBZTtBQUNYLG1CQUFPQSxTQUFQO0FBQ0g7QUFDREEsb0JBQVksSUFBWjtBQUNBLGVBQU8sSUFBUDtBQUNIOztBQUVESSxnQkFBWUMsZ0JBQWdCLEVBQTVCLEVBQWdDQyxHQUFoQyxFQUFxQztBQUNqQyxZQUFJLGlCQUFFQyxPQUFGLENBQVVGLGFBQVYsQ0FBSixFQUE4QjtBQUMxQixtQkFBTyxFQUFQO0FBQ0g7QUFDRCxlQUFPQSxjQUNGRyxNQURFLENBQ0tDLFNBQVM7QUFDYixtQkFBTyxJQUFJQSxLQUFKLENBQVVILEdBQVYsNENBQVA7QUFDSCxTQUhFLEVBSUZJLEdBSkUsQ0FJRUQsU0FBUztBQUNWLG1CQUFPLElBQUlBLEtBQUosQ0FBVUgsR0FBVixDQUFQO0FBQ0gsU0FORSxDQUFQO0FBT0g7O0FBRUQ7QUFDQUssc0JBQWtCQyxRQUFsQixFQUE0Qk4sR0FBNUIsRUFBaUMsQ0FFaEM7QUFoQzZCO2tCQUFiTCxZIiwiZmlsZSI6IkZpbHRlckxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCBBYnN0cmFjdEdhdGV3YXlGaWx0ZXIgZnJvbSAnLi9maWx0ZXIvQWJzdHJhY3RHYXRld2F5RmlsdGVyJztcbmltcG9ydCBQcmVHYXRld2F5RmlsdGVyIGZyb20gJy4vZmlsdGVyL1ByZUdhdGV3YXlGaWx0ZXInO1xuXG5sZXQgbG9hZGVySW5zID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsdGVyTG9hZGVyIHtcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghbG9hZGVySW5zKSB7XG4gICAgICAgICAgICBsb2FkZXJJbnMgPSBuZXcgRmlsdGVyTG9hZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvYWRlcklucztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKGxvYWRlcklucykge1xuICAgICAgICAgICAgcmV0dXJuIGxvYWRlcklucztcbiAgICAgICAgfVxuICAgICAgICBsb2FkZXJJbnMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsb2FkRmlsdGVycyhmaWx0ZXJDbGFzc2VzID0gW10sIGFwcCkge1xuICAgICAgICBpZiAoXy5pc0VtcHR5KGZpbHRlckNsYXNzZXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlckNsYXNzZXNcbiAgICAgICAgICAgIC5maWx0ZXIoa2xhc3MgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcga2xhc3MoYXBwKSBpbnN0YW5jZW9mIEFic3RyYWN0R2F0ZXdheUZpbHRlcjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGtsYXNzID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGtsYXNzKGFwcCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBUT0RPIHdpbGwgYmUgYWRkZWQgaW4gdGhlIGZ1dHVyZVxuICAgIGxvYWRGaWx0ZXJzQnlQYXRoKGJhc2VQYXRoLCBhcHApIHtcblxuICAgIH1cbn1cbiJdfQ==