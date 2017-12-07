'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _GatewayRunner = require('./GatewayRunner');

var _GatewayRunner2 = _interopRequireDefault(_GatewayRunner);

var _ServiceGatewayFilter = require('./support/ServiceGatewayFilter');

var _ServiceGatewayFilter2 = _interopRequireDefault(_ServiceGatewayFilter);

var _check = require('./util/check');

var _parseRouteConfig = require('./util/parseRouteConfig');

var _parseRouteConfig2 = _interopRequireDefault(_parseRouteConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NodeGateway {
    static getGatewayRunner(app) {
        if (!this.gatewayRunner) {
            this.gatewayRunner = new _GatewayRunner2.default(app);
        }
        return this.gatewayRunner;
    }

    /**
     * normal init
     * @param app
     * @param filterClasses
     */
    init(app, filterClasses = []) {
        if (!(0, _check.isKoaIns)(app)) {
            throw new Error('Invalid app instance');
        }
        if (!_lodash2.default.isArray(filterClasses)) {
            filterClasses = [];
        }
        let gatewayRunner = NodeGateway.getGatewayRunner(app);
        gatewayRunner.init(filterClasses);
    }

    /**
     * init gateway in nodecloud
     * @param app
     * @param filterClasses
     * @param routeConfig
     * @param client reference(https://github.com/nodecloud/nodecloud-boot)
     */
    initWithService(app, filterClasses = [], routeConfig, client) {
        if (!(0, _check.isKoaIns)(app)) {
            throw new Error('Invalid app instance');
        }
        if (!_lodash2.default.isArray(filterClasses)) {
            filterClasses = [];
        }
        if (!(0, _check.isValidClient)(client)) {
            throw new Error('Invalid client');
        }

        // add default service filter
        filterClasses.push(_ServiceGatewayFilter2.default);
        app.context.routeConfig = (0, _parseRouteConfig2.default)(routeConfig);
        app.context.serviceClient = client;

        let gatewayRunner = NodeGateway.getGatewayRunner(app);
        gatewayRunner.init(filterClasses);
    }
}
exports.default = NodeGateway;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9Ob2RlR2F0ZXdheS5qcyJdLCJuYW1lcyI6WyJOb2RlR2F0ZXdheSIsImdldEdhdGV3YXlSdW5uZXIiLCJhcHAiLCJnYXRld2F5UnVubmVyIiwiaW5pdCIsImZpbHRlckNsYXNzZXMiLCJFcnJvciIsImlzQXJyYXkiLCJpbml0V2l0aFNlcnZpY2UiLCJyb3V0ZUNvbmZpZyIsImNsaWVudCIsInB1c2giLCJjb250ZXh0Iiwic2VydmljZUNsaWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLFdBQU4sQ0FBa0I7QUFDN0IsV0FBT0MsZ0JBQVAsQ0FBd0JDLEdBQXhCLEVBQTZCO0FBQ3pCLFlBQUksQ0FBQyxLQUFLQyxhQUFWLEVBQXlCO0FBQ3JCLGlCQUFLQSxhQUFMLEdBQXFCLDRCQUFrQkQsR0FBbEIsQ0FBckI7QUFDSDtBQUNELGVBQU8sS0FBS0MsYUFBWjtBQUNIOztBQUVEOzs7OztBQUtBQyxTQUFLRixHQUFMLEVBQVVHLGdCQUFnQixFQUExQixFQUE4QjtBQUMxQixZQUFJLENBQUMscUJBQVNILEdBQVQsQ0FBTCxFQUFvQjtBQUNoQixrQkFBTSxJQUFJSSxLQUFKLENBQVUsc0JBQVYsQ0FBTjtBQUNIO0FBQ0QsWUFBSSxDQUFDLGlCQUFFQyxPQUFGLENBQVVGLGFBQVYsQ0FBTCxFQUErQjtBQUMzQkEsNEJBQWdCLEVBQWhCO0FBQ0g7QUFDRCxZQUFJRixnQkFBZ0JILFlBQVlDLGdCQUFaLENBQTZCQyxHQUE3QixDQUFwQjtBQUNBQyxzQkFBY0MsSUFBZCxDQUFtQkMsYUFBbkI7QUFDSDs7QUFFRDs7Ozs7OztBQU9BRyxvQkFBZ0JOLEdBQWhCLEVBQXFCRyxnQkFBZ0IsRUFBckMsRUFBeUNJLFdBQXpDLEVBQXNEQyxNQUF0RCxFQUE4RDtBQUMxRCxZQUFJLENBQUMscUJBQVNSLEdBQVQsQ0FBTCxFQUFvQjtBQUNoQixrQkFBTSxJQUFJSSxLQUFKLENBQVUsc0JBQVYsQ0FBTjtBQUNIO0FBQ0QsWUFBSSxDQUFDLGlCQUFFQyxPQUFGLENBQVVGLGFBQVYsQ0FBTCxFQUErQjtBQUMzQkEsNEJBQWdCLEVBQWhCO0FBQ0g7QUFDRCxZQUFJLENBQUMsMEJBQWNLLE1BQWQsQ0FBTCxFQUE0QjtBQUN4QixrQkFBTSxJQUFJSixLQUFKLENBQVUsZ0JBQVYsQ0FBTjtBQUNIOztBQUVEO0FBQ0FELHNCQUFjTSxJQUFkO0FBQ0FULFlBQUlVLE9BQUosQ0FBWUgsV0FBWixHQUEwQixnQ0FBaUJBLFdBQWpCLENBQTFCO0FBQ0FQLFlBQUlVLE9BQUosQ0FBWUMsYUFBWixHQUE0QkgsTUFBNUI7O0FBRUEsWUFBSVAsZ0JBQWdCSCxZQUFZQyxnQkFBWixDQUE2QkMsR0FBN0IsQ0FBcEI7QUFDQUMsc0JBQWNDLElBQWQsQ0FBbUJDLGFBQW5CO0FBQ0g7QUFqRDRCO2tCQUFaTCxXIiwiZmlsZSI6Ik5vZGVHYXRld2F5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IEdhdGV3YXlSdW5uZXIgZnJvbSAnLi9HYXRld2F5UnVubmVyJztcbmltcG9ydCBTZXJ2aWNlR2F0ZXdheUZpbHRlciBmcm9tICcuL3N1cHBvcnQvU2VydmljZUdhdGV3YXlGaWx0ZXInO1xuaW1wb3J0IHtpc0tvYUlucywgaXNWYWxpZENsaWVudH0gZnJvbSAnLi91dGlsL2NoZWNrJztcbmltcG9ydCBwYXJzZVJvdXRlQ29uZmlnIGZyb20gJy4vdXRpbC9wYXJzZVJvdXRlQ29uZmlnJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZUdhdGV3YXkge1xuICAgIHN0YXRpYyBnZXRHYXRld2F5UnVubmVyKGFwcCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2F0ZXdheVJ1bm5lcikge1xuICAgICAgICAgICAgdGhpcy5nYXRld2F5UnVubmVyID0gbmV3IEdhdGV3YXlSdW5uZXIoYXBwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nYXRld2F5UnVubmVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG5vcm1hbCBpbml0XG4gICAgICogQHBhcmFtIGFwcFxuICAgICAqIEBwYXJhbSBmaWx0ZXJDbGFzc2VzXG4gICAgICovXG4gICAgaW5pdChhcHAsIGZpbHRlckNsYXNzZXMgPSBbXSkge1xuICAgICAgICBpZiAoIWlzS29hSW5zKGFwcCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcHAgaW5zdGFuY2UnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaXNBcnJheShmaWx0ZXJDbGFzc2VzKSkge1xuICAgICAgICAgICAgZmlsdGVyQ2xhc3NlcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBnYXRld2F5UnVubmVyID0gTm9kZUdhdGV3YXkuZ2V0R2F0ZXdheVJ1bm5lcihhcHApO1xuICAgICAgICBnYXRld2F5UnVubmVyLmluaXQoZmlsdGVyQ2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaW5pdCBnYXRld2F5IGluIG5vZGVjbG91ZFxuICAgICAqIEBwYXJhbSBhcHBcbiAgICAgKiBAcGFyYW0gZmlsdGVyQ2xhc3Nlc1xuICAgICAqIEBwYXJhbSByb3V0ZUNvbmZpZ1xuICAgICAqIEBwYXJhbSBjbGllbnQgcmVmZXJlbmNlKGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlY2xvdWQvbm9kZWNsb3VkLWJvb3QpXG4gICAgICovXG4gICAgaW5pdFdpdGhTZXJ2aWNlKGFwcCwgZmlsdGVyQ2xhc3NlcyA9IFtdLCByb3V0ZUNvbmZpZywgY2xpZW50KSB7XG4gICAgICAgIGlmICghaXNLb2FJbnMoYXBwKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFwcCBpbnN0YW5jZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pc0FycmF5KGZpbHRlckNsYXNzZXMpKSB7XG4gICAgICAgICAgICBmaWx0ZXJDbGFzc2VzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1ZhbGlkQ2xpZW50KGNsaWVudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjbGllbnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCBkZWZhdWx0IHNlcnZpY2UgZmlsdGVyXG4gICAgICAgIGZpbHRlckNsYXNzZXMucHVzaChTZXJ2aWNlR2F0ZXdheUZpbHRlcik7XG4gICAgICAgIGFwcC5jb250ZXh0LnJvdXRlQ29uZmlnID0gcGFyc2VSb3V0ZUNvbmZpZyhyb3V0ZUNvbmZpZyk7XG4gICAgICAgIGFwcC5jb250ZXh0LnNlcnZpY2VDbGllbnQgPSBjbGllbnQ7XG5cbiAgICAgICAgbGV0IGdhdGV3YXlSdW5uZXIgPSBOb2RlR2F0ZXdheS5nZXRHYXRld2F5UnVubmVyKGFwcCk7XG4gICAgICAgIGdhdGV3YXlSdW5uZXIuaW5pdChmaWx0ZXJDbGFzc2VzKTtcbiAgICB9XG59XG4iXX0=