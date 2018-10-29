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
            try {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
            } catch (ignore) {}

            res.end(JSON.stringify({ message: err.message, status: 500 }));
        });
    }

    filterType() {
        return 'route';
    }
}
exports.default = RouteGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9maWx0ZXIvUm91dGVHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlJvdXRlR2F0ZXdheUZpbHRlciIsImNvbnN0cnVjdG9yIiwiYXBwIiwicHJveHkiLCJjcmVhdGVQcm94eVNlcnZlciIsIm9uIiwiZXJyIiwicmVxIiwicmVzIiwid3JpdGVIZWFkIiwiaWdub3JlIiwiZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJmaWx0ZXJUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxrQkFBTix5Q0FBdUQ7QUFDbEVDLGdCQUFZQyxHQUFaLEVBQWlCO0FBQ2IsY0FBTUEsR0FBTjtBQUNBLGFBQUtDLEtBQUwsR0FBYSxvQkFBVUMsaUJBQVYsQ0FBNEIsRUFBNUIsQ0FBYjtBQUNBLGFBQUtELEtBQUwsQ0FBV0UsRUFBWCxDQUFjLE9BQWQsRUFBdUIsVUFBVUMsR0FBVixFQUFlQyxHQUFmLEVBQW9CQyxHQUFwQixFQUF5QjtBQUM1QyxnQkFBSTtBQUNBQSxvQkFBSUMsU0FBSixDQUFjLEdBQWQsRUFBbUI7QUFDZixvQ0FBZ0I7QUFERCxpQkFBbkI7QUFHSCxhQUpELENBSUUsT0FBTUMsTUFBTixFQUFjLENBQ2Y7O0FBR0RGLGdCQUFJRyxHQUFKLENBQVFDLEtBQUtDLFNBQUwsQ0FBZSxFQUFDQyxTQUFTUixJQUFJUSxPQUFkLEVBQXVCQyxRQUFRLEdBQS9CLEVBQWYsQ0FBUjtBQUNILFNBVkQ7QUFXSDs7QUFFREMsaUJBQWE7QUFDVCxlQUFPLE9BQVA7QUFDSDtBQW5CaUU7a0JBQWpEaEIsa0IiLCJmaWxlIjoiUm91dGVHYXRld2F5RmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGh0dHBQcm94eSBmcm9tICdodHRwLXByb3h5JztcblxuaW1wb3J0IEFic3RyYWN0R2F0ZXdheUZpbHRlciBmcm9tICcuL0Fic3RyYWN0R2F0ZXdheUZpbHRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvdXRlR2F0ZXdheUZpbHRlciBleHRlbmRzIEFic3RyYWN0R2F0ZXdheUZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMucHJveHkgPSBodHRwUHJveHkuY3JlYXRlUHJveHlTZXJ2ZXIoe30pO1xuICAgICAgICB0aGlzLnByb3h5Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwLCB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2goaWdub3JlKSB7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7bWVzc2FnZTogZXJyLm1lc3NhZ2UsIHN0YXR1czogNTAwfSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmaWx0ZXJUeXBlKCkge1xuICAgICAgICByZXR1cm4gJ3JvdXRlJztcbiAgICB9XG59Il19