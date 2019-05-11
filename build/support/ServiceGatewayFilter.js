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
            urlObject.serviceName = matchRoute.serviceName;
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

            let responseHeader = {};
            if (responseHeader = routeConfig.options.responseHeader) {
                for (const key in responseHeader) {
                    if (!responseHeader.hasOwnProperty(key)) {
                        continue;
                    }
                    ctx.res.setHeader(key, responseHeader[key]);
                }
            }

            _this.proxy.web(ctx.req, ctx.res, ServiceGatewayFilter.getProxyOptions(routeConfig, targetOptions));
            _this.proxy.on('error', function (err, req, res) {
                try {
                    res.writeHead(500, {
                        'Content-Type': 'application/json'
                    });
                } catch (ignore) {}

                if (err && !res) {
                    let serviceClient = client.getClient(targetOptions.serviceName);
                    serviceClient.removeUnavailableNode(`${targetOptions.hostname}:${targetOptions.port}`);
                }

                res.end(JSON.stringify({ message: err.message, status: 500 }));
            });
            ctx.respond = false;
        })();
    }
}
exports.default = ServiceGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdXBwb3J0L1NlcnZpY2VHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2VHYXRld2F5RmlsdGVyIiwiY29uc3RydWN0b3IiLCJhcHAiLCJzaG91bGRGaWx0ZXIiLCJjdHgiLCJzZXJ2aWNlQ2xpZW50IiwiaXNPYmplY3RMaWtlIiwicm91dGVDb25maWciLCJpZ25vcmVQYXR0ZXJuIiwiUmVnRXhwIiwidGVzdCIsInVybCIsImxhc3RJbmRleCIsImlzTWF0Y2hQcmVmaXgiLCJwcmVmaXgiLCJ1cmxPYmplY3QiLCJwYXJzZSIsImpvaW4iLCJwYXRobmFtZSIsImluZGV4T2YiLCJnZXRTZXJ2aWNlRW5kcG9pbnQiLCJzZXJ2aWNlTmFtZSIsImNsaWVudCIsImdldENsaWVudCIsInNlcnZpY2UiLCJnZXRTZXJ2aWNlIiwiRXJyb3IiLCJob3N0IiwiZ2V0IiwicG9ydCIsImdldFByb3h5T3B0aW9ucyIsInJvdXRlT3B0aW9ucyIsImFzc2lnbiIsInByZXBlbmRQYXRoIiwiaWdub3JlUGF0aCIsIm9wdGlvbnMiLCJnZXRNYXRjaFJvdXRlIiwicmVxdWVzdFBhdGgiLCJyZXF1ZXN0VXJsIiwibWF0Y2hSb3V0ZSIsIm1heE1hdGNoTGVuIiwiZm9yRWFjaCIsInJvdXRlcyIsInJvdXRlIiwicGF0aFByZWZpeCIsImxlbmd0aCIsImdldFRhcmdldE9wdGlvbnMiLCJoYXNTdWZmaXhTbGFzaCIsImVuZHNXaXRoIiwidGFyZ2V0Iiwic3RyaXBQcmVmaXgiLCJzbGljZSIsInRyaW1FbmQiLCJlbmRwb2ludCIsInByb3RvY29sIiwiaG9zdG5hbWUiLCJwYXRoIiwiaHJlZiIsImZvcm1hdCIsImFjdGlvbiIsInRhcmdldE9wdGlvbnMiLCJyZXNwb25zZUhlYWRlciIsImtleSIsImhhc093blByb3BlcnR5IiwicmVzIiwic2V0SGVhZGVyIiwicHJveHkiLCJ3ZWIiLCJyZXEiLCJvbiIsImVyciIsIndyaXRlSGVhZCIsImlnbm9yZSIsInJlbW92ZVVuYXZhaWxhYmxlTm9kZSIsImVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXNzYWdlIiwic3RhdHVzIiwicmVzcG9uZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxvQkFBTixzQ0FBc0Q7QUFDakVDLGdCQUFZQyxHQUFaLEVBQWlCO0FBQ2IsY0FBTUEsR0FBTjtBQUNIOztBQUVLQyxnQkFBTixDQUFtQkMsR0FBbkIsRUFBd0I7QUFBQTtBQUNwQixnQkFBSSxDQUFDLDBCQUFjQSxJQUFJQyxhQUFsQixDQUFMLEVBQXVDO0FBQ25DLHVCQUFPLEtBQVA7QUFDSDtBQUNELGdCQUFJLENBQUMsaUJBQUVDLFlBQUYsQ0FBZUYsSUFBSUcsV0FBbkIsQ0FBTCxFQUFzQztBQUNsQyx1QkFBTyxLQUFQO0FBQ0g7QUFDRCxrQkFBTUEsY0FBY0gsSUFBSUcsV0FBeEI7QUFDQSxnQkFBSUEsWUFBWUMsYUFBWixZQUFxQ0MsTUFBckMsSUFBK0NGLFlBQVlDLGFBQVosQ0FBMEJFLElBQTFCLENBQStCTixJQUFJTyxHQUFuQyxDQUFuRCxFQUE0RjtBQUN4RkosNEJBQVlDLGFBQVosQ0FBMEJJLFNBQTFCLEdBQXNDLENBQXRDO0FBQ0EsdUJBQU8sS0FBUDtBQUNIO0FBQ0QsbUJBQU9aLHFCQUFxQmEsYUFBckIsQ0FBbUNULElBQUlPLEdBQXZDLEVBQTRDSixZQUFZTyxNQUF4RCxDQUFQO0FBWm9CO0FBYXZCOztBQUVELFdBQU9ELGFBQVAsQ0FBcUJGLEdBQXJCLEVBQTBCRyxNQUExQixFQUFrQztBQUM5QixZQUFJLENBQUNILEdBQUwsRUFBVTtBQUNOLG1CQUFPLEtBQVA7QUFDSDtBQUNELFlBQUksQ0FBQ0csTUFBTCxFQUFhO0FBQ1QsbUJBQU8sSUFBUDtBQUNIO0FBQ0QsY0FBTUMsWUFBWSxjQUFJQyxLQUFKLENBQVVMLEdBQVYsQ0FBbEI7QUFDQSxlQUFPLGVBQUtNLElBQUwsQ0FBVUYsVUFBVUcsUUFBcEIsRUFB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cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgVVJMIGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBodHRwUHJveHkgZnJvbSAnaHR0cC1wcm94eSc7XG5cbmltcG9ydCBSb3V0ZUdhdGV3YXlGaWx0ZXIgZnJvbSAnLi4vZmlsdGVyL1JvdXRlR2F0ZXdheUZpbHRlcic7XG5pbXBvcnQge2lzVmFsaWRDbGllbnR9IGZyb20gJy4uL3V0aWwvY2hlY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlR2F0ZXdheUZpbHRlciBleHRlbmRzIFJvdXRlR2F0ZXdheUZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2hvdWxkRmlsdGVyKGN0eCkge1xuICAgICAgICBpZiAoIWlzVmFsaWRDbGllbnQoY3R4LnNlcnZpY2VDbGllbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmlzT2JqZWN0TGlrZShjdHgucm91dGVDb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm91dGVDb25maWcgPSBjdHgucm91dGVDb25maWc7XG4gICAgICAgIGlmIChyb3V0ZUNvbmZpZy5pZ25vcmVQYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwICYmIHJvdXRlQ29uZmlnLmlnbm9yZVBhdHRlcm4udGVzdChjdHgudXJsKSkge1xuICAgICAgICAgICAgcm91dGVDb25maWcuaWdub3JlUGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTZXJ2aWNlR2F0ZXdheUZpbHRlci5pc01hdGNoUHJlZml4KGN0eC51cmwsIHJvdXRlQ29uZmlnLnByZWZpeCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzTWF0Y2hQcmVmaXgodXJsLCBwcmVmaXgpIHtcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBVUkwucGFyc2UodXJsKTtcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbih1cmxPYmplY3QucGF0aG5hbWUsICcvJykuaW5kZXhPZihwcmVmaXgpID09PSAwO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRTZXJ2aWNlRW5kcG9pbnQoc2VydmljZU5hbWUsIGNsaWVudCkge1xuICAgICAgICBsZXQgc2VydmljZUNsaWVudCA9IGNsaWVudC5nZXRDbGllbnQoc2VydmljZU5hbWUpLFxuICAgICAgICAgICAgc2VydmljZSA9IGF3YWl0IHNlcnZpY2VDbGllbnQuZ2V0U2VydmljZSgpO1xuICAgICAgICBpZiAoIXNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9uZSBpbmNvcnJlY3Qgc2VydmljZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBob3N0OiBfLmdldChzZXJ2aWNlLCBbJ1NlcnZpY2UnLCAnQWRkcmVzcyddKSxcbiAgICAgICAgICAgIHBvcnQ6IF8uZ2V0KHNlcnZpY2UsIFsnU2VydmljZScsICdQb3J0J10pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFByb3h5T3B0aW9ucyhyb3V0ZUNvbmZpZywgcm91dGVPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcmVwZW5kUGF0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpZ25vcmVQYXRoOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm91dGVDb25maWcub3B0aW9ucyxcbiAgICAgICAgICAgIHJvdXRlT3B0aW9uc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRNYXRjaFJvdXRlKHJlcXVlc3RQYXRoLCByb3V0ZUNvbmZpZywgcmVxdWVzdFVybCkge1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IG51bGwsXG4gICAgICAgICAgICBtYXhNYXRjaExlbiA9IDA7XG4gICAgICAgIF8uZm9yRWFjaChyb3V0ZUNvbmZpZy5yb3V0ZXMsIChyb3V0ZSwgc2VydmljZU5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0UGF0aC5pbmRleE9mKHJvdXRlLnBhdGhQcmVmaXgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJvdXRlLmlnbm9yZVBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHAgJiYgcm91dGUuaWdub3JlUGF0dGVybi50ZXN0KHJlcXVlc3RVcmwpKSB7XG4gICAgICAgICAgICAgICAgcm91dGUuaWdub3JlUGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyb3V0ZS5wYXRoUHJlZml4Lmxlbmd0aCA+IG1heE1hdGNoTGVuKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hSb3V0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGUsXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaFJvdXRlO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRUYXJnZXRPcHRpb25zKHJlcXVlc3RVcmwsIHJvdXRlQ29uZmlnLCBjbGllbnQpIHtcbiAgICAgICAgY29uc3QgdXJsT2JqZWN0ID0gVVJMLnBhcnNlKHJlcXVlc3RVcmwpO1xuICAgICAgICBjb25zdCBoYXNTdWZmaXhTbGFzaCA9IF8uZW5kc1dpdGgodXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpO1xuICAgICAgICBsZXQgcGF0aG5hbWUgPSBwYXRoLmpvaW4odXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpO1xuICAgICAgICBjb25zdCBtYXRjaFJvdXRlID0gU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0TWF0Y2hSb3V0ZShwYXRobmFtZSwgcm91dGVDb25maWcsIHJlcXVlc3RVcmwpO1xuICAgICAgICBpZiAoIW1hdGNoUm91dGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvdXRlID0gbWF0Y2hSb3V0ZS5yb3V0ZTtcbiAgICAgICAgLy8gSWYgcm91dGUudXJsIGlzIGV4aXN0ZWQsIGZvcndhcmQgZGlyZWN0bHlcbiAgICAgICAgaWYgKHJvdXRlLnVybCkge1xuICAgICAgICAgICAgcmV0dXJuIF8uYXNzaWduKFxuICAgICAgICAgICAgICAgIHt0YXJnZXQ6IHJvdXRlLnVybH0sXG4gICAgICAgICAgICAgICAgcm91dGUub3B0aW9uc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm91dGUuc3RyaXBQcmVmaXgpIHtcbiAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuc2xpY2Uocm91dGUucGF0aFByZWZpeC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZS5zbGljZShyb3V0ZUNvbmZpZy5wcmVmaXgubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhc1N1ZmZpeFNsYXNoKSB7XG4gICAgICAgICAgICBwYXRobmFtZSA9IF8udHJpbUVuZChwYXRobmFtZSwgJy8nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kcG9pbnQgPSBhd2FpdCBTZXJ2aWNlR2F0ZXdheUZpbHRlci5nZXRTZXJ2aWNlRW5kcG9pbnQobWF0Y2hSb3V0ZS5zZXJ2aWNlTmFtZSwgY2xpZW50KTtcbiAgICAgICAgdXJsT2JqZWN0LnByb3RvY29sID0gdXJsT2JqZWN0LnByb3RvY29sIHx8ICdodHRwJztcbiAgICAgICAgdXJsT2JqZWN0Lmhvc3QgPSBudWxsO1xuICAgICAgICB1cmxPYmplY3QuaG9zdG5hbWUgPSBlbmRwb2ludC5ob3N0O1xuICAgICAgICB1cmxPYmplY3QucG9ydCA9IGVuZHBvaW50LnBvcnQ7XG4gICAgICAgIHVybE9iamVjdC5wYXRobmFtZSA9IHBhdGhuYW1lO1xuICAgICAgICB1cmxPYmplY3QucGF0aCA9IG51bGw7XG4gICAgICAgIHVybE9iamVjdC5ocmVmID0gbnVsbDtcbiAgICAgICAgdXJsT2JqZWN0LnNlcnZpY2VOYW1lID0gbWF0Y2hSb3V0ZS5zZXJ2aWNlTmFtZTtcbiAgICAgICAgcmV0dXJuIF8uYXNzaWduKFxuICAgICAgICAgICAge3RhcmdldDogVVJMLmZvcm1hdCh1cmxPYmplY3QpfSxcbiAgICAgICAgICAgIHJvdXRlLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBhY3Rpb24oY3R4KSB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ29uZmlnID0gY3R4LnJvdXRlQ29uZmlnO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBjdHguc2VydmljZUNsaWVudDtcbiAgICAgICAgY29uc3QgdGFyZ2V0T3B0aW9ucyA9IGF3YWl0IFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldFRhcmdldE9wdGlvbnMoY3R4LnVybCwgcm91dGVDb25maWcsIGNsaWVudCk7XG4gICAgICAgIGlmICghdGFyZ2V0T3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlSGVhZGVyID0ge307XG4gICAgICAgIGlmIChyZXNwb25zZUhlYWRlciA9IHJvdXRlQ29uZmlnLm9wdGlvbnMucmVzcG9uc2VIZWFkZXIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlc3BvbnNlSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZUhlYWRlci5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdHgucmVzLnNldEhlYWRlcihrZXksIHJlc3BvbnNlSGVhZGVyW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm94eS53ZWIoXG4gICAgICAgICAgICBjdHgucmVxLFxuICAgICAgICAgICAgY3R4LnJlcyxcbiAgICAgICAgICAgIFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldFByb3h5T3B0aW9ucyhyb3V0ZUNvbmZpZywgdGFyZ2V0T3B0aW9ucylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5wcm94eS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyLCByZXEsIHJlcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVyciAmJiAhcmVzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlcnZpY2VDbGllbnQgPSBjbGllbnQuZ2V0Q2xpZW50KHRhcmdldE9wdGlvbnMuc2VydmljZU5hbWUpO1xuICAgICAgICAgICAgICAgIHNlcnZpY2VDbGllbnQucmVtb3ZlVW5hdmFpbGFibGVOb2RlKGAke3RhcmdldE9wdGlvbnMuaG9zdG5hbWV9OiR7dGFyZ2V0T3B0aW9ucy5wb3J0fWApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe21lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGF0dXM6IDUwMH0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGN0eC5yZXNwb25kID0gZmFsc2U7XG4gICAgfVxufVxuIl19