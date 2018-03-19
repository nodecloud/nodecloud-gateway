'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _AbstractGatewayFilter = require('./AbstractGatewayFilter');

var _AbstractGatewayFilter2 = _interopRequireDefault(_AbstractGatewayFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RouteGatewayFilter extends _AbstractGatewayFilter2.default {
    constructor(app) {
        super(app);
        this.proxy = _httpProxy2.default.createProxyServer({});
        this.proxy.on('error', function (err, req, res) {
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({ message: err.message, status: 500 }));
        });
    }

    filterType() {
        return 'route';
    }
}
exports.default = RouteGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9maWx0ZXIvUm91dGVHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlJvdXRlR2F0ZXdheUZpbHRlciIsImNvbnN0cnVjdG9yIiwiYXBwIiwicHJveHkiLCJjcmVhdGVQcm94eVNlcnZlciIsIm9uIiwiZXJyIiwicmVxIiwicmVzIiwid3JpdGVIZWFkIiwiZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJmaWx0ZXJUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxrQkFBTix5Q0FBdUQ7QUFDbEVDLGdCQUFZQyxHQUFaLEVBQWlCO0FBQ2IsY0FBTUEsR0FBTjtBQUNBLGFBQUtDLEtBQUwsR0FBYSxvQkFBVUMsaUJBQVYsQ0FBNEIsRUFBNUIsQ0FBYjtBQUNBLGFBQUtELEtBQUwsQ0FBV0UsRUFBWCxDQUFjLE9BQWQsRUFBdUIsVUFBVUMsR0FBVixFQUFlQyxHQUFmLEVBQW9CQyxHQUFwQixFQUF5QjtBQUM1Q0EsZ0JBQUlDLFNBQUosQ0FBYyxHQUFkLEVBQW1CO0FBQ2YsZ0NBQWdCO0FBREQsYUFBbkI7O0FBSUFELGdCQUFJRSxHQUFKLENBQVFDLEtBQUtDLFNBQUwsQ0FBZSxFQUFDQyxTQUFTUCxJQUFJTyxPQUFkLEVBQXVCQyxRQUFRLEdBQS9CLEVBQWYsQ0FBUjtBQUNILFNBTkQ7QUFPSDs7QUFFREMsaUJBQWE7QUFDVCxlQUFPLE9BQVA7QUFDSDtBQWZpRTtrQkFBakRmLGtCIiwiZmlsZSI6IlJvdXRlR2F0ZXdheUZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBodHRwUHJveHkgZnJvbSAnaHR0cC1wcm94eSc7XG5cbmltcG9ydCBBYnN0cmFjdEdhdGV3YXlGaWx0ZXIgZnJvbSAnLi9BYnN0cmFjdEdhdGV3YXlGaWx0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb3V0ZUdhdGV3YXlGaWx0ZXIgZXh0ZW5kcyBBYnN0cmFjdEdhdGV3YXlGaWx0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgICAgICB0aGlzLnByb3h5ID0gaHR0cFByb3h5LmNyZWF0ZVByb3h5U2VydmVyKHt9KTtcbiAgICAgICAgdGhpcy5wcm94eS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyLCByZXEsIHJlcykge1xuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7bWVzc2FnZTogZXJyLm1lc3NhZ2UsIHN0YXR1czogNTAwfSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmaWx0ZXJUeXBlKCkge1xuICAgICAgICByZXR1cm4gJ3JvdXRlJztcbiAgICB9XG59Il19