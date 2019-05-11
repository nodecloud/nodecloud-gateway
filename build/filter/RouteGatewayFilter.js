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
    }

    filterType() {
        return 'route';
    }
}
exports.default = RouteGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9maWx0ZXIvUm91dGVHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlJvdXRlR2F0ZXdheUZpbHRlciIsImNvbnN0cnVjdG9yIiwiYXBwIiwicHJveHkiLCJjcmVhdGVQcm94eVNlcnZlciIsImZpbHRlclR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7OztBQUVlLE1BQU1BLGtCQUFOLHlDQUF1RDtBQUNsRUMsZ0JBQVlDLEdBQVosRUFBaUI7QUFDYixjQUFNQSxHQUFOO0FBQ0EsYUFBS0MsS0FBTCxHQUFhLG9CQUFVQyxpQkFBVixDQUE0QixFQUE1QixDQUFiO0FBQ0g7O0FBRURDLGlCQUFhO0FBQ1QsZUFBTyxPQUFQO0FBQ0g7QUFSaUU7a0JBQWpETCxrQiIsImZpbGUiOiJSb3V0ZUdhdGV3YXlGaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaHR0cFByb3h5IGZyb20gJ2h0dHAtcHJveHknO1xuXG5pbXBvcnQgQWJzdHJhY3RHYXRld2F5RmlsdGVyIGZyb20gJy4vQWJzdHJhY3RHYXRld2F5RmlsdGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGVHYXRld2F5RmlsdGVyIGV4dGVuZHMgQWJzdHJhY3RHYXRld2F5RmlsdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5wcm94eSA9IGh0dHBQcm94eS5jcmVhdGVQcm94eVNlcnZlcih7fSk7XG4gICAgfVxuXG4gICAgZmlsdGVyVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuICdyb3V0ZSc7XG4gICAgfVxufVxuIl19