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
            const hasSuffixSlash = _lodash2.default.endsWith(urlObject.pathname, '/');
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
            if (!hasSuffixSlash) {
                pathname = _lodash2.default.trimEnd(pathname, '/');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdXBwb3J0L1NlcnZpY2VHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2VHYXRld2F5RmlsdGVyIiwiY29uc3RydWN0b3IiLCJhcHAiLCJzaG91bGRGaWx0ZXIiLCJjdHgiLCJzZXJ2aWNlQ2xpZW50IiwiaXNPYmplY3RMaWtlIiwicm91dGVDb25maWciLCJpZ25vcmVQYXR0ZXJuIiwiUmVnRXhwIiwidGVzdCIsInVybCIsImxhc3RJbmRleCIsImlzTWF0Y2hQcmVmaXgiLCJwcmVmaXgiLCJ1cmxPYmplY3QiLCJwYXJzZSIsImpvaW4iLCJwYXRobmFtZSIsImluZGV4T2YiLCJnZXRTZXJ2aWNlRW5kcG9pbnQiLCJzZXJ2aWNlTmFtZSIsImNsaWVudCIsImdldENsaWVudCIsInNlcnZpY2UiLCJnZXRTZXJ2aWNlIiwiRXJyb3IiLCJob3N0IiwiZ2V0IiwicG9ydCIsImdldFByb3h5T3B0aW9ucyIsInJvdXRlT3B0aW9ucyIsImFzc2lnbiIsInByZXBlbmRQYXRoIiwiaWdub3JlUGF0aCIsIm9wdGlvbnMiLCJnZXRNYXRjaFJvdXRlIiwicmVxdWVzdFBhdGgiLCJyZXF1ZXN0VXJsIiwibWF0Y2hSb3V0ZSIsIm1heE1hdGNoTGVuIiwiZm9yRWFjaCIsInJvdXRlcyIsInJvdXRlIiwicGF0aFByZWZpeCIsImxlbmd0aCIsImdldFRhcmdldE9wdGlvbnMiLCJoYXNTdWZmaXhTbGFzaCIsImVuZHNXaXRoIiwidGFyZ2V0Iiwic3RyaXBQcmVmaXgiLCJzbGljZSIsInRyaW1FbmQiLCJlbmRwb2ludCIsInByb3RvY29sIiwiaG9zdG5hbWUiLCJwYXRoIiwiaHJlZiIsImZvcm1hdCIsImFjdGlvbiIsInRhcmdldE9wdGlvbnMiLCJwcm94eSIsIndlYiIsInJlcSIsInJlcyIsInJlc3BvbmQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEs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ImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgVVJMIGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBodHRwUHJveHkgZnJvbSAnaHR0cC1wcm94eSc7XG5cbmltcG9ydCBSb3V0ZUdhdGV3YXlGaWx0ZXIgZnJvbSAnLi4vZmlsdGVyL1JvdXRlR2F0ZXdheUZpbHRlcic7XG5pbXBvcnQge2lzVmFsaWRDbGllbnR9IGZyb20gJy4uL3V0aWwvY2hlY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlR2F0ZXdheUZpbHRlciBleHRlbmRzIFJvdXRlR2F0ZXdheUZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2hvdWxkRmlsdGVyKGN0eCkge1xuICAgICAgICBpZiAoIWlzVmFsaWRDbGllbnQoY3R4LnNlcnZpY2VDbGllbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmlzT2JqZWN0TGlrZShjdHgucm91dGVDb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm91dGVDb25maWcgPSBjdHgucm91dGVDb25maWc7XG4gICAgICAgIGlmIChyb3V0ZUNvbmZpZy5pZ25vcmVQYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwICYmIHJvdXRlQ29uZmlnLmlnbm9yZVBhdHRlcm4udGVzdChjdHgudXJsKSkge1xuICAgICAgICAgICAgcm91dGVDb25maWcuaWdub3JlUGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTZXJ2aWNlR2F0ZXdheUZpbHRlci5pc01hdGNoUHJlZml4KGN0eC51cmwsIHJvdXRlQ29uZmlnLnByZWZpeCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzTWF0Y2hQcmVmaXgodXJsLCBwcmVmaXgpIHtcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBVUkwucGFyc2UodXJsKTtcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbih1cmxPYmplY3QucGF0aG5hbWUsICcvJykuaW5kZXhPZihwcmVmaXgpID09PSAwO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRTZXJ2aWNlRW5kcG9pbnQoc2VydmljZU5hbWUsIGNsaWVudCkge1xuICAgICAgICBsZXQgc2VydmljZUNsaWVudCA9IGNsaWVudC5nZXRDbGllbnQoc2VydmljZU5hbWUpLFxuICAgICAgICAgICAgc2VydmljZSA9IGF3YWl0IHNlcnZpY2VDbGllbnQuZ2V0U2VydmljZSgpO1xuICAgICAgICBpZiAoIXNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9uZSBpbmNvcnJlY3Qgc2VydmljZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBob3N0OiBfLmdldChzZXJ2aWNlLCBbJ1NlcnZpY2UnLCAnQWRkcmVzcyddKSxcbiAgICAgICAgICAgIHBvcnQ6IF8uZ2V0KHNlcnZpY2UsIFsnU2VydmljZScsICdQb3J0J10pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFByb3h5T3B0aW9ucyhyb3V0ZUNvbmZpZywgcm91dGVPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcmVwZW5kUGF0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpZ25vcmVQYXRoOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm91dGVDb25maWcub3B0aW9ucyxcbiAgICAgICAgICAgIHJvdXRlT3B0aW9uc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRNYXRjaFJvdXRlKHJlcXVlc3RQYXRoLCByb3V0ZUNvbmZpZywgcmVxdWVzdFVybCkge1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IG51bGwsXG4gICAgICAgICAgICBtYXhNYXRjaExlbiA9IDA7XG4gICAgICAgIF8uZm9yRWFjaChyb3V0ZUNvbmZpZy5yb3V0ZXMsIChyb3V0ZSwgc2VydmljZU5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0UGF0aC5pbmRleE9mKHJvdXRlLnBhdGhQcmVmaXgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJvdXRlLmlnbm9yZVBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHAgJiYgcm91dGUuaWdub3JlUGF0dGVybi50ZXN0KHJlcXVlc3RVcmwpKSB7XG4gICAgICAgICAgICAgICAgcm91dGUuaWdub3JlUGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyb3V0ZS5wYXRoUHJlZml4Lmxlbmd0aCA+IG1heE1hdGNoTGVuKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hSb3V0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGUsXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaFJvdXRlO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRUYXJnZXRPcHRpb25zKHJlcXVlc3RVcmwsIHJvdXRlQ29uZmlnLCBjbGllbnQpIHtcbiAgICAgICAgY29uc3QgdXJsT2JqZWN0ID0gVVJMLnBhcnNlKHJlcXVlc3RVcmwpO1xuICAgICAgICBjb25zdCBoYXNTdWZmaXhTbGFzaCA9IF8uZW5kc1dpdGgodXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpO1xuICAgICAgICBsZXQgcGF0aG5hbWUgPSBwYXRoLmpvaW4odXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpO1xuICAgICAgICBjb25zdCBtYXRjaFJvdXRlID0gU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0TWF0Y2hSb3V0ZShwYXRobmFtZSwgcm91dGVDb25maWcsIHJlcXVlc3RVcmwpO1xuICAgICAgICBpZiAoIW1hdGNoUm91dGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvdXRlID0gbWF0Y2hSb3V0ZS5yb3V0ZTtcbiAgICAgICAgLy8gSWYgcm91dGUudXJsIGlzIGV4aXN0ZWQsIGZvcndhcmQgZGlyZWN0bHlcbiAgICAgICAgaWYgKHJvdXRlLnVybCkge1xuICAgICAgICAgICAgcmV0dXJuIF8uYXNzaWduKFxuICAgICAgICAgICAgICAgIHt0YXJnZXQ6IHJvdXRlLnVybH0sXG4gICAgICAgICAgICAgICAgcm91dGUub3B0aW9uc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm91dGUuc3RyaXBQcmVmaXgpIHtcbiAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuc2xpY2Uocm91dGUucGF0aFByZWZpeC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZS5zbGljZShyb3V0ZUNvbmZpZy5wcmVmaXgubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhc1N1ZmZpeFNsYXNoKSB7XG4gICAgICAgICAgICBwYXRobmFtZSA9IF8udHJpbUVuZChwYXRobmFtZSwgJy8nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kcG9pbnQgPSBhd2FpdCBTZXJ2aWNlR2F0ZXdheUZpbHRlci5nZXRTZXJ2aWNlRW5kcG9pbnQobWF0Y2hSb3V0ZS5zZXJ2aWNlTmFtZSwgY2xpZW50KTtcbiAgICAgICAgdXJsT2JqZWN0LnByb3RvY29sID0gdXJsT2JqZWN0LnByb3RvY29sIHx8ICdodHRwJztcbiAgICAgICAgdXJsT2JqZWN0Lmhvc3QgPSBudWxsO1xuICAgICAgICB1cmxPYmplY3QuaG9zdG5hbWUgPSBlbmRwb2ludC5ob3N0O1xuICAgICAgICB1cmxPYmplY3QucG9ydCA9IGVuZHBvaW50LnBvcnQ7XG4gICAgICAgIHVybE9iamVjdC5wYXRobmFtZSA9IHBhdGhuYW1lO1xuICAgICAgICB1cmxPYmplY3QucGF0aCA9IG51bGw7XG4gICAgICAgIHVybE9iamVjdC5ocmVmID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIF8uYXNzaWduKFxuICAgICAgICAgICAge3RhcmdldDogVVJMLmZvcm1hdCh1cmxPYmplY3QpfSxcbiAgICAgICAgICAgIHJvdXRlLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBhY3Rpb24oY3R4KSB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ29uZmlnID0gY3R4LnJvdXRlQ29uZmlnO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBjdHguc2VydmljZUNsaWVudDtcbiAgICAgICAgY29uc3QgdGFyZ2V0T3B0aW9ucyA9IGF3YWl0IFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldFRhcmdldE9wdGlvbnMoY3R4LnVybCwgcm91dGVDb25maWcsIGNsaWVudCk7XG4gICAgICAgIGlmICghdGFyZ2V0T3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJveHkud2ViKFxuICAgICAgICAgICAgY3R4LnJlcSxcbiAgICAgICAgICAgIGN0eC5yZXMsXG4gICAgICAgICAgICBTZXJ2aWNlR2F0ZXdheUZpbHRlci5nZXRQcm94eU9wdGlvbnMocm91dGVDb25maWcsIHRhcmdldE9wdGlvbnMpXG4gICAgICAgICk7XG4gICAgICAgIGN0eC5yZXNwb25kID0gZmFsc2U7XG4gICAgfVxufVxuIl19