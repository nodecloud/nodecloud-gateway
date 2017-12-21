'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _RouteGatewayFilter = require('../filter/RouteGatewayFilter');

var _RouteGatewayFilter2 = _interopRequireDefault(_RouteGatewayFilter);

var _check = require('../util/check');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ServiceGatewayFilter extends _RouteGatewayFilter2.default {
    constructor(app) {
        super(app);
    }

    shouldFilter(ctx) {
        return _asyncToGenerator(function* () {
            if (!(0, _check.isValidClient)(ctx.serviceClient)) {
                return false;
            }
            if (!_lodash2.default.isObjectLike(ctx.routeConfig)) {
                return false;
            }
            const routeConfig = ctx.routeConfig;
            if (routeConfig.ignorePattern instanceof RegExp && routeConfig.ignorePattern.test(ctx.url)) {
                routeConfig.ignorePattern.lastIndex = 0;
                return false;
            }
            return ServiceGatewayFilter.isMatchPrefix(ctx.url, routeConfig.prefix);
        })();
    }

    static isMatchPrefix(url, prefix) {
        if (!url) {
            return false;
        }
        if (!prefix) {
            return true;
        }
        const urlObject = _url2.default.parse(url);
        return _path2.default.join(urlObject.pathname, '/').indexOf(prefix) === 0;
    }

    static getServiceEndpoint(serviceName, client) {
        return _asyncToGenerator(function* () {
            let serviceClient = client.getClient(serviceName),
                service = yield serviceClient.getService();
            if (!service) {
                throw new Error('None incorrect service');
            }
            return {
                host: _lodash2.default.get(service, ['Service', 'Address']),
                port: _lodash2.default.get(service, ['Service', 'Port'])
            };
        })();
    }

    static getProxyOptions(routeConfig, routeOptions) {
        return _lodash2.default.assign({
            prependPath: true,
            ignorePath: true
        }, routeConfig.options, routeOptions);
    }

    static getMatchRoute(requestPath, routeConfig, requestUrl) {
        let matchRoute = null,
            maxMatchLen = 0;
        _lodash2.default.forEach(routeConfig.routes, (route, serviceName) => {
            if (requestPath.indexOf(route.pathPrefix) !== 0) {
                return;
            }
            if (route.ignorePattern instanceof RegExp && route.ignorePattern.test(requestUrl)) {
                route.ignorePattern.lastIndex = 0;
                return;
            }
            if (route.pathPrefix.length > maxMatchLen) {
                matchRoute = {
                    route,
                    serviceName
                };
            }
        });
        return matchRoute;
    }

    static getTargetOptions(requestUrl, routeConfig, client) {
        return _asyncToGenerator(function* () {
            const urlObject = _url2.default.parse(requestUrl);
            let pathname = _path2.default.join(urlObject.pathname, '/');
            const matchRoute = ServiceGatewayFilter.getMatchRoute(pathname, routeConfig, requestUrl);
            if (!matchRoute) {
                return null;
            }
            const route = matchRoute.route;
            // If route.url is existed, forward directly
            if (route.url) {
                return _lodash2.default.assign({ target: route.url }, route.options);
            }
            if (route.stripPrefix) {
                pathname = pathname.slice(route.pathPrefix.length);
            } else {
                pathname = pathname.slice(routeConfig.prefix.length);
            }
            let endpoint = yield ServiceGatewayFilter.getServiceEndpoint(matchRoute.serviceName, client);
            urlObject.protocol = urlObject.protocol || 'http';
            urlObject.host = null;
            urlObject.hostname = endpoint.host;
            urlObject.port = endpoint.port;
            urlObject.pathname = pathname;
            urlObject.path = null;
            urlObject.href = null;
            return _lodash2.default.assign({ target: _url2.default.format(urlObject) }, route.options);
        })();
    }

    action(ctx) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const routeConfig = ctx.routeConfig;
            const client = ctx.serviceClient;
            const targetOptions = yield ServiceGatewayFilter.getTargetOptions(ctx.url, routeConfig, client);
            if (!targetOptions) {
                return;
            }
            _this.proxy.web(ctx.req, ctx.res, ServiceGatewayFilter.getProxyOptions(routeConfig, targetOptions));
            ctx.respond = false;
        })();
    }
}
exports.default = ServiceGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdXBwb3J0L1NlcnZpY2VHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2VHYXRld2F5RmlsdGVyIiwiY29uc3RydWN0b3IiLCJhcHAiLCJzaG91bGRGaWx0ZXIiLCJjdHgiLCJzZXJ2aWNlQ2xpZW50IiwiaXNPYmplY3RMaWtlIiwicm91dGVDb25maWciLCJpZ25vcmVQYXR0ZXJuIiwiUmVnRXhwIiwidGVzdCIsInVybCIsImxhc3RJbmRleCIsImlzTWF0Y2hQcmVmaXgiLCJwcmVmaXgiLCJ1cmxPYmplY3QiLCJwYXJzZSIsImpvaW4iLCJwYXRobmFtZSIsImluZGV4T2YiLCJnZXRTZXJ2aWNlRW5kcG9pbnQiLCJzZXJ2aWNlTmFtZSIsImNsaWVudCIsImdldENsaWVudCIsInNlcnZpY2UiLCJnZXRTZXJ2aWNlIiwiRXJyb3IiLCJob3N0IiwiZ2V0IiwicG9ydCIsImdldFByb3h5T3B0aW9ucyIsInJvdXRlT3B0aW9ucyIsImFzc2lnbiIsInByZXBlbmRQYXRoIiwiaWdub3JlUGF0aCIsIm9wdGlvbnMiLCJnZXRNYXRjaFJvdXRlIiwicmVxdWVzdFBhdGgiLCJyZXF1ZXN0VXJsIiwibWF0Y2hSb3V0ZSIsIm1heE1hdGNoTGVuIiwiZm9yRWFjaCIsInJvdXRlcyIsInJvdXRlIiwicGF0aFByZWZpeCIsImxlbmd0aCIsImdldFRhcmdldE9wdGlvbnMiLCJ0YXJnZXQiLCJzdHJpcFByZWZpeCIsInNsaWNlIiwiZW5kcG9pbnQiLCJwcm90b2NvbCIsImhvc3RuYW1lIiwicGF0aCIsImhyZWYiLCJmb3JtYXQiLCJhY3Rpb24iLCJ0YXJnZXRPcHRpb25zIiwicHJveHkiLCJ3ZWIiLCJyZXEiLCJyZXMiLCJyZXNwb25kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLG9CQUFOLHNDQUFzRDtBQUNqRUMsZ0JBQVlDLEdBQVosRUFBaUI7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YyxJQUFWLEdBQWlCcUIsU0FBU3JCLElBQTFCO0FBQ0FkLHNCQUFVRyxRQUFWLEdBQXFCQSxRQUFyQjtBQUNBSCxzQkFBVXNDLElBQVYsR0FBaUIsSUFBakI7QUFDQXRDLHNCQUFVdUMsSUFBVixHQUFpQixJQUFqQjtBQUNBLG1CQUFPLGlCQUFFdEIsTUFBRixDQUNILEVBQUNlLFFBQVEsY0FBSVEsTUFBSixDQUFXeEMsU0FBWCxDQUFULEVBREcsRUFFSDRCLE1BQU1SLE9BRkgsQ0FBUDtBQTVCMkQ7QUFnQzlEOztBQUVLcUIsVUFBTixDQUFhcEQsR0FBYixFQUFrQjtBQUFBOztBQUFBO0FBQ2Qsa0JBQU1HLGNBQWNILElBQUlHLFdBQXhCO0FBQ0Esa0JBQU1lLFNBQVNsQixJQUFJQyxhQUFuQjtBQUNBLGtCQUFNb0QsZ0JBQWdCLE1BQU16RCxxQkFBcUI4QyxnQkFBckIsQ0FBc0MxQyxJQUFJTyxHQUExQyxFQUErQ0osV0FBL0MsRUFBNERlLE1BQTVELENBQTVCO0FBQ0EsZ0JBQUksQ0FBQ21DLGFBQUwsRUFBb0I7QUFDaEI7QUFDSDtBQUNELGtCQUFLQyxLQUFMLENBQVdDLEdBQVgsQ0FDSXZELElBQUl3RCxHQURSLEVBRUl4RCxJQUFJeUQsR0FGUixFQUdJN0QscUJBQXFCOEIsZUFBckIsQ0FBcUN2QixXQUFyQyxFQUFrRGtELGFBQWxELENBSEo7QUFLQXJELGdCQUFJMEQsT0FBSixHQUFjLEtBQWQ7QUFaYztBQWFqQjtBQTFIZ0U7a0JBQWhEOUQsb0IiLCJmaWxlIjoiU2VydmljZUdhdGV3YXlGaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFVSTCBmcm9tICd1cmwnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgaHR0cFByb3h5IGZyb20gJ2h0dHAtcHJveHknO1xuXG5pbXBvcnQgUm91dGVHYXRld2F5RmlsdGVyIGZyb20gJy4uL2ZpbHRlci9Sb3V0ZUdhdGV3YXlGaWx0ZXInO1xuaW1wb3J0IHtpc1ZhbGlkQ2xpZW50fSBmcm9tICcuLi91dGlsL2NoZWNrJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUdhdGV3YXlGaWx0ZXIgZXh0ZW5kcyBSb3V0ZUdhdGV3YXlGaWx0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIGFzeW5jIHNob3VsZEZpbHRlcihjdHgpIHtcbiAgICAgICAgaWYgKCFpc1ZhbGlkQ2xpZW50KGN0eC5zZXJ2aWNlQ2xpZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pc09iamVjdExpa2UoY3R4LnJvdXRlQ29uZmlnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvdXRlQ29uZmlnID0gY3R4LnJvdXRlQ29uZmlnO1xuICAgICAgICBpZiAocm91dGVDb25maWcuaWdub3JlUGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiByb3V0ZUNvbmZpZy5pZ25vcmVQYXR0ZXJuLnRlc3QoY3R4LnVybCkpIHtcbiAgICAgICAgICAgIHJvdXRlQ29uZmlnLmlnbm9yZVBhdHRlcm4ubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU2VydmljZUdhdGV3YXlGaWx0ZXIuaXNNYXRjaFByZWZpeChjdHgudXJsLCByb3V0ZUNvbmZpZy5wcmVmaXgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc01hdGNoUHJlZml4KHVybCwgcHJlZml4KSB7XG4gICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsT2JqZWN0ID0gVVJMLnBhcnNlKHVybCk7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4odXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpLmluZGV4T2YocHJlZml4KSA9PT0gMDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0U2VydmljZUVuZHBvaW50KHNlcnZpY2VOYW1lLCBjbGllbnQpIHtcbiAgICAgICAgbGV0IHNlcnZpY2VDbGllbnQgPSBjbGllbnQuZ2V0Q2xpZW50KHNlcnZpY2VOYW1lKSxcbiAgICAgICAgICAgIHNlcnZpY2UgPSBhd2FpdCBzZXJ2aWNlQ2xpZW50LmdldFNlcnZpY2UoKTtcbiAgICAgICAgaWYgKCFzZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vbmUgaW5jb3JyZWN0IHNlcnZpY2UnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaG9zdDogXy5nZXQoc2VydmljZSwgWydTZXJ2aWNlJywgJ0FkZHJlc3MnXSksXG4gICAgICAgICAgICBwb3J0OiBfLmdldChzZXJ2aWNlLCBbJ1NlcnZpY2UnLCAnUG9ydCddKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRQcm94eU9wdGlvbnMocm91dGVDb25maWcsIHJvdXRlT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gXy5hc3NpZ24oXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHJlcGVuZFBhdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgaWdub3JlUGF0aDogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvdXRlQ29uZmlnLm9wdGlvbnMsXG4gICAgICAgICAgICByb3V0ZU9wdGlvbnNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TWF0Y2hSb3V0ZShyZXF1ZXN0UGF0aCwgcm91dGVDb25maWcsIHJlcXVlc3RVcmwpIHtcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSBudWxsLFxuICAgICAgICAgICAgbWF4TWF0Y2hMZW4gPSAwO1xuICAgICAgICBfLmZvckVhY2gocm91dGVDb25maWcucm91dGVzLCAocm91dGUsIHNlcnZpY2VOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxdWVzdFBhdGguaW5kZXhPZihyb3V0ZS5wYXRoUHJlZml4KSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyb3V0ZS5pZ25vcmVQYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwICYmIHJvdXRlLmlnbm9yZVBhdHRlcm4udGVzdChyZXF1ZXN0VXJsKSkge1xuICAgICAgICAgICAgICAgIHJvdXRlLmlnbm9yZVBhdHRlcm4ubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocm91dGUucGF0aFByZWZpeC5sZW5ndGggPiBtYXhNYXRjaExlbikge1xuICAgICAgICAgICAgICAgIG1hdGNoUm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdXRlLFxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlTmFtZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0VGFyZ2V0T3B0aW9ucyhyZXF1ZXN0VXJsLCByb3V0ZUNvbmZpZywgY2xpZW50KSB7XG4gICAgICAgIGNvbnN0IHVybE9iamVjdCA9IFVSTC5wYXJzZShyZXF1ZXN0VXJsKTtcbiAgICAgICAgbGV0IHBhdGhuYW1lID0gcGF0aC5qb2luKHVybE9iamVjdC5wYXRobmFtZSwgJy8nKTtcbiAgICAgICAgY29uc3QgbWF0Y2hSb3V0ZSA9IFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldE1hdGNoUm91dGUocGF0aG5hbWUsIHJvdXRlQ29uZmlnLCByZXF1ZXN0VXJsKTtcbiAgICAgICAgaWYgKCFtYXRjaFJvdXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3V0ZSA9IG1hdGNoUm91dGUucm91dGU7XG4gICAgICAgIC8vIElmIHJvdXRlLnVybCBpcyBleGlzdGVkLCBmb3J3YXJkIGRpcmVjdGx5XG4gICAgICAgIGlmIChyb3V0ZS51cmwpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICAgICAgICB7dGFyZ2V0OiByb3V0ZS51cmx9LFxuICAgICAgICAgICAgICAgIHJvdXRlLm9wdGlvbnNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvdXRlLnN0cmlwUHJlZml4KSB7XG4gICAgICAgICAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnNsaWNlKHJvdXRlLnBhdGhQcmVmaXgubGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuc2xpY2Uocm91dGVDb25maWcucHJlZml4Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVuZHBvaW50ID0gYXdhaXQgU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0U2VydmljZUVuZHBvaW50KG1hdGNoUm91dGUuc2VydmljZU5hbWUsIGNsaWVudCk7XG4gICAgICAgIHVybE9iamVjdC5wcm90b2NvbCA9IHVybE9iamVjdC5wcm90b2NvbCB8fCAnaHR0cCc7XG4gICAgICAgIHVybE9iamVjdC5ob3N0ID0gbnVsbDtcbiAgICAgICAgdXJsT2JqZWN0Lmhvc3RuYW1lID0gZW5kcG9pbnQuaG9zdDtcbiAgICAgICAgdXJsT2JqZWN0LnBvcnQgPSBlbmRwb2ludC5wb3J0O1xuICAgICAgICB1cmxPYmplY3QucGF0aG5hbWUgPSBwYXRobmFtZTtcbiAgICAgICAgdXJsT2JqZWN0LnBhdGggPSBudWxsO1xuICAgICAgICB1cmxPYmplY3QuaHJlZiA9IG51bGw7XG4gICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICAgIHt0YXJnZXQ6IFVSTC5mb3JtYXQodXJsT2JqZWN0KX0sXG4gICAgICAgICAgICByb3V0ZS5vcHRpb25zXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgYWN0aW9uKGN0eCkge1xuICAgICAgICBjb25zdCByb3V0ZUNvbmZpZyA9IGN0eC5yb3V0ZUNvbmZpZztcbiAgICAgICAgY29uc3QgY2xpZW50ID0gY3R4LnNlcnZpY2VDbGllbnQ7XG4gICAgICAgIGNvbnN0IHRhcmdldE9wdGlvbnMgPSBhd2FpdCBTZXJ2aWNlR2F0ZXdheUZpbHRlci5nZXRUYXJnZXRPcHRpb25zKGN0eC51cmwsIHJvdXRlQ29uZmlnLCBjbGllbnQpO1xuICAgICAgICBpZiAoIXRhcmdldE9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb3h5LndlYihcbiAgICAgICAgICAgIGN0eC5yZXEsXG4gICAgICAgICAgICBjdHgucmVzLFxuICAgICAgICAgICAgU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0UHJveHlPcHRpb25zKHJvdXRlQ29uZmlnLCB0YXJnZXRPcHRpb25zKVxuICAgICAgICApO1xuICAgICAgICBjdHgucmVzcG9uZCA9IGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==