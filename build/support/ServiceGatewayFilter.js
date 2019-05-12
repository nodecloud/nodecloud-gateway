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
            return _lodash2.default.assign({ target: _url2.default.format(urlObject) }, route.options, { serviceName: matchRoute.serviceName });
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

            _this.proxy.web(ctx.req, ctx.res, ServiceGatewayFilter.getProxyOptions(routeConfig, targetOptions), function (err, req, res) {
                try {
                    res.writeHead(500, {
                        'Content-Type': 'application/json'
                    });
                } catch (ignore) {}

                if (err && err.code === 'ECONNREFUSED') {
                    client.getClient(targetOptions.serviceName).removeUnavailableNode(`${err.address}:${err.port}`);
                }

                res.end(JSON.stringify({ message: err.message, status: 500 }));
            });
            ctx.respond = false;
        })();
    }
}
exports.default = ServiceGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdXBwb3J0L1NlcnZpY2VHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2VHYXRld2F5RmlsdGVyIiwiY29uc3RydWN0b3IiLCJhcHAiLCJzaG91bGRGaWx0ZXIiLCJjdHgiLCJzZXJ2aWNlQ2xpZW50IiwiaXNPYmplY3RMaWtlIiwicm91dGVDb25maWciLCJpZ25vcmVQYXR0ZXJuIiwiUmVnRXhwIiwidGVzdCIsInVybCIsImxhc3RJbmRleCIsImlzTWF0Y2hQcmVmaXgiLCJwcmVmaXgiLCJ1cmxPYmplY3QiLCJwYXJzZSIsImpvaW4iLCJwYXRobmFtZSIsImluZGV4T2YiLCJnZXRTZXJ2aWNlRW5kcG9pbnQiLCJzZXJ2aWNlTmFtZSIsImNsaWVudCIsImdldENsaWVudCIsInNlcnZpY2UiLCJnZXRTZXJ2aWNlIiwiRXJyb3IiLCJob3N0IiwiZ2V0IiwicG9ydCIsImdldFByb3h5T3B0aW9ucyIsInJvdXRlT3B0aW9ucyIsImFzc2lnbiIsInByZXBlbmRQYXRoIiwiaWdub3JlUGF0aCIsIm9wdGlvbnMiLCJnZXRNYXRjaFJvdXRlIiwicmVxdWVzdFBhdGgiLCJyZXF1ZXN0VXJsIiwibWF0Y2hSb3V0ZSIsIm1heE1hdGNoTGVuIiwiZm9yRWFjaCIsInJvdXRlcyIsInJvdXRlIiwicGF0aFByZWZpeCIsImxlbmd0aCIsImdldFRhcmdldE9wdGlvbnMiLCJoYXNTdWZmaXhTbGFzaCIsImVuZHNXaXRoIiwidGFyZ2V0Iiwic3RyaXBQcmVmaXgiLCJzbGljZSIsInRyaW1FbmQiLCJlbmRwb2ludCIsInByb3RvY29sIiwiaG9zdG5hbWUiLCJwYXRoIiwiaHJlZiIsImZvcm1hdCIsImFjdGlvbiIsInRhcmdldE9wdGlvbnMiLCJyZXNwb25zZUhlYWRlciIsImtleSIsImhhc093blByb3BlcnR5IiwicmVzIiwic2V0SGVhZGVyIiwicHJveHkiLCJ3ZWIiLCJyZXEiLCJlcnIiLCJ3cml0ZUhlYWQiLCJpZ25vcmUiLCJjb2RlIiwicmVtb3ZlVW5hdmFpbGFibGVOb2RlIiwiYWRkcmVzcyIsImVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXNzYWdlIiwic3RhdHVzIiwicmVzcG9uZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxvQkFBTixzQ0FBc0Q7QUFDakVDLGdCQUFZQyxHQUFaLEVBQWlCO0FBQ2IsY0FBTUEsR0FBTjtBQUNIOztBQUVLQyxnQkFBTixDQUFtQkMsR0FBbkIsRUFBd0I7QUFBQTtBQUNwQixnQkFBSSxDQUFDLDBCQUFjQSxJQUFJQyxhQUFsQixDQUFMLEVBQXVDO0FBQ25DLHVCQUFPLEtBQVA7QUFDSDtBQUNELGdCQUFJLENBQUMsaUJBQUVDLFlBQUYsQ0FBZUYsSUFBSUcsV0FBbkIsQ0FBTCxFQUFzQztBQUNsQyx1QkFBTyxLQUFQO0FBQ0g7QUFDRCxrQkFBTUEsY0FBY0gsSUFBSUcsV0FBeEI7QUFDQSxnQkFBSUEsWUFBWUMsYUFBWixZQUFxQ0MsTUFBckMsSUFBK0NGLFlBQVlDLGFBQVosQ0FBMEJFLElBQTFCLENBQStCTixJQUFJTyxHQUFuQyxDQUFuRCxFQUE0RjtBQUN4RkosNEJBQVlDLGFBQVosQ0FBMEJJLFNBQTFCLEdBQXNDLENBQXRDO0FBQ0EsdUJBQU8sS0FBUDtBQUNIO0FBQ0QsbUJBQU9aLHFCQUFxQmEsYUFBckIsQ0FBbUNULElBQUlPLEdBQXZDLEVBQTRDSixZQUFZTyxNQUF4RCxDQUFQO0FBWm9CO0FBYXZCOztBQUVELFdBQU9ELGFBQVAsQ0FBcUJGLEdBQXJCLEVBQTBCRyxNQUExQixFQUFrQztBQUM5QixZQUFJLENBQUNILEdBQUwsRUFBVTtBQUNOLG1CQUFPLEtBQVA7QUFDSDtBQUNELFlBQUksQ0FBQ0csTUFBTCxFQUFhO0FBQ1QsbUJBQU8sSUFBUDtBQUNIO0FBQ0QsY0FBTUMsWUFBWSxjQUFJQyxLQUFKLENBQVVMLEdBQVYsQ0FBbEI7QUFDQSxlQUFPLGVBQUtNLElBQUwsQ0FBVUYsVUFB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QUFJQSxpQkFBaUJ0RCxZQUFZNEIsT0FBWixDQUFvQjBCLGNBQXpDLEVBQXlEO0FBQ3JELHFCQUFLLE1BQU1DLEdBQVgsSUFBa0JELGNBQWxCLEVBQWtDO0FBQzlCLHdCQUFJLENBQUNBLGVBQWVFLGNBQWYsQ0FBOEJELEdBQTlCLENBQUwsRUFBeUM7QUFDckM7QUFDSDtBQUNEMUQsd0JBQUk0RCxHQUFKLENBQVFDLFNBQVIsQ0FBa0JILEdBQWxCLEVBQXVCRCxlQUFlQyxHQUFmLENBQXZCO0FBQ0g7QUFDSjs7QUFFRCxrQkFBS0ksS0FBTCxDQUFXQyxHQUFYLENBQ0kvRCxJQUFJZ0UsR0FEUixFQUVJaEUsSUFBSTRELEdBRlIsRUFHSWhFLHFCQUFxQjhCLGVBQXJCLENBQXFDdkIsV0FBckMsRUFBa0RxRCxhQUFsRCxDQUhKLEVBSUksVUFBQ1MsR0FBRCxFQUFNRCxHQUFOLEVBQVdKLEdBQVgsRUFBbUI7QUFDZixvQkFBSTtBQUNBQSx3QkFBSU0sU0FBSixDQUFjLEdBQWQsRUFBbUI7QUFDZix3Q0FBZ0I7QUFERCxxQkFBbkI7QUFHSCxpQkFKRCxDQUlFLE9BQU9DLE1BQVAsRUFBZSxDQUNoQjs7QUFFRCxvQkFBSUYsT0FBT0EsSUFBSUcsSUFBSixLQUFhLGNBQXhCLEVBQXdDO0FBQ3BDbEQsMkJBQU9DLFNBQVAsQ0FBaUJxQyxjQUFjdkMsV0FBL0IsRUFBNENvRCxxQkFBNUMsQ0FBbUUsR0FBRUosSUFBSUssT0FBUSxJQUFHTCxJQUFJeEMsSUFBSyxFQUE3RjtBQUNIOztBQUVEbUMsb0JBQUlXLEdBQUosQ0FBUUMsS0FBS0MsU0FBTCxDQUFlLEVBQUNDLFNBQVNULElBQUlTLE9BQWQsRUFBdUJDLFFBQVEsR0FBL0IsRUFBZixDQUFSO0FBQ0gsYUFqQkw7QUFtQkEzRSxnQkFBSTRFLE9BQUosR0FBYyxLQUFkO0FBckNjO0FBc0NqQjtBQXhKZ0U7a0JBQWhEaEYsb0IiLCJmaWxlIjoiU2VydmljZUdhdGV3YXlGaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFVSTCBmcm9tICd1cmwnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgaHR0cFByb3h5IGZyb20gJ2h0dHAtcHJveHknO1xuXG5pbXBvcnQgUm91dGVHYXRld2F5RmlsdGVyIGZyb20gJy4uL2ZpbHRlci9Sb3V0ZUdhdGV3YXlGaWx0ZXInO1xuaW1wb3J0IHtpc1ZhbGlkQ2xpZW50fSBmcm9tICcuLi91dGlsL2NoZWNrJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUdhdGV3YXlGaWx0ZXIgZXh0ZW5kcyBSb3V0ZUdhdGV3YXlGaWx0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIGFzeW5jIHNob3VsZEZpbHRlcihjdHgpIHtcbiAgICAgICAgaWYgKCFpc1ZhbGlkQ2xpZW50KGN0eC5zZXJ2aWNlQ2xpZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghXy5pc09iamVjdExpa2UoY3R4LnJvdXRlQ29uZmlnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvdXRlQ29uZmlnID0gY3R4LnJvdXRlQ29uZmlnO1xuICAgICAgICBpZiAocm91dGVDb25maWcuaWdub3JlUGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiByb3V0ZUNvbmZpZy5pZ25vcmVQYXR0ZXJuLnRlc3QoY3R4LnVybCkpIHtcbiAgICAgICAgICAgIHJvdXRlQ29uZmlnLmlnbm9yZVBhdHRlcm4ubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU2VydmljZUdhdGV3YXlGaWx0ZXIuaXNNYXRjaFByZWZpeChjdHgudXJsLCByb3V0ZUNvbmZpZy5wcmVmaXgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc01hdGNoUHJlZml4KHVybCwgcHJlZml4KSB7XG4gICAgICAgIGlmICghdXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsT2JqZWN0ID0gVVJMLnBhcnNlKHVybCk7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4odXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpLmluZGV4T2YocHJlZml4KSA9PT0gMDtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0U2VydmljZUVuZHBvaW50KHNlcnZpY2VOYW1lLCBjbGllbnQpIHtcbiAgICAgICAgbGV0IHNlcnZpY2VDbGllbnQgPSBjbGllbnQuZ2V0Q2xpZW50KHNlcnZpY2VOYW1lKSxcbiAgICAgICAgICAgIHNlcnZpY2UgPSBhd2FpdCBzZXJ2aWNlQ2xpZW50LmdldFNlcnZpY2UoKTtcbiAgICAgICAgaWYgKCFzZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vbmUgaW5jb3JyZWN0IHNlcnZpY2UnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaG9zdDogXy5nZXQoc2VydmljZSwgWydTZXJ2aWNlJywgJ0FkZHJlc3MnXSksXG4gICAgICAgICAgICBwb3J0OiBfLmdldChzZXJ2aWNlLCBbJ1NlcnZpY2UnLCAnUG9ydCddKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRQcm94eU9wdGlvbnMocm91dGVDb25maWcsIHJvdXRlT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gXy5hc3NpZ24oXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcHJlcGVuZFBhdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgaWdub3JlUGF0aDogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvdXRlQ29uZmlnLm9wdGlvbnMsXG4gICAgICAgICAgICByb3V0ZU9wdGlvbnNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TWF0Y2hSb3V0ZShyZXF1ZXN0UGF0aCwgcm91dGVDb25maWcsIHJlcXVlc3RVcmwpIHtcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSBudWxsLFxuICAgICAgICAgICAgbWF4TWF0Y2hMZW4gPSAwO1xuICAgICAgICBfLmZvckVhY2gocm91dGVDb25maWcucm91dGVzLCAocm91dGUsIHNlcnZpY2VOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxdWVzdFBhdGguaW5kZXhPZihyb3V0ZS5wYXRoUHJlZml4KSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyb3V0ZS5pZ25vcmVQYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwICYmIHJvdXRlLmlnbm9yZVBhdHRlcm4udGVzdChyZXF1ZXN0VXJsKSkge1xuICAgICAgICAgICAgICAgIHJvdXRlLmlnbm9yZVBhdHRlcm4ubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocm91dGUucGF0aFByZWZpeC5sZW5ndGggPiBtYXhNYXRjaExlbikge1xuICAgICAgICAgICAgICAgIG1hdGNoUm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdXRlLFxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlTmFtZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0VGFyZ2V0T3B0aW9ucyhyZXF1ZXN0VXJsLCByb3V0ZUNvbmZpZywgY2xpZW50KSB7XG4gICAgICAgIGNvbnN0IHVybE9iamVjdCA9IFVSTC5wYXJzZShyZXF1ZXN0VXJsKTtcbiAgICAgICAgY29uc3QgaGFzU3VmZml4U2xhc2ggPSBfLmVuZHNXaXRoKHVybE9iamVjdC5wYXRobmFtZSwgJy8nKTtcbiAgICAgICAgbGV0IHBhdGhuYW1lID0gcGF0aC5qb2luKHVybE9iamVjdC5wYXRobmFtZSwgJy8nKTtcbiAgICAgICAgY29uc3QgbWF0Y2hSb3V0ZSA9IFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldE1hdGNoUm91dGUocGF0aG5hbWUsIHJvdXRlQ29uZmlnLCByZXF1ZXN0VXJsKTtcbiAgICAgICAgaWYgKCFtYXRjaFJvdXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3V0ZSA9IG1hdGNoUm91dGUucm91dGU7XG4gICAgICAgIC8vIElmIHJvdXRlLnVybCBpcyBleGlzdGVkLCBmb3J3YXJkIGRpcmVjdGx5XG4gICAgICAgIGlmIChyb3V0ZS51cmwpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICAgICAgICB7dGFyZ2V0OiByb3V0ZS51cmx9LFxuICAgICAgICAgICAgICAgIHJvdXRlLm9wdGlvbnNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvdXRlLnN0cmlwUHJlZml4KSB7XG4gICAgICAgICAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnNsaWNlKHJvdXRlLnBhdGhQcmVmaXgubGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuc2xpY2Uocm91dGVDb25maWcucHJlZml4Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYXNTdWZmaXhTbGFzaCkge1xuICAgICAgICAgICAgcGF0aG5hbWUgPSBfLnRyaW1FbmQocGF0aG5hbWUsICcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVuZHBvaW50ID0gYXdhaXQgU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0U2VydmljZUVuZHBvaW50KG1hdGNoUm91dGUuc2VydmljZU5hbWUsIGNsaWVudCk7XG4gICAgICAgIHVybE9iamVjdC5wcm90b2NvbCA9IHVybE9iamVjdC5wcm90b2NvbCB8fCAnaHR0cCc7XG4gICAgICAgIHVybE9iamVjdC5ob3N0ID0gbnVsbDtcbiAgICAgICAgdXJsT2JqZWN0Lmhvc3RuYW1lID0gZW5kcG9pbnQuaG9zdDtcbiAgICAgICAgdXJsT2JqZWN0LnBvcnQgPSBlbmRwb2ludC5wb3J0O1xuICAgICAgICB1cmxPYmplY3QucGF0aG5hbWUgPSBwYXRobmFtZTtcbiAgICAgICAgdXJsT2JqZWN0LnBhdGggPSBudWxsO1xuICAgICAgICB1cmxPYmplY3QuaHJlZiA9IG51bGw7XG4gICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICAgIHt0YXJnZXQ6IFVSTC5mb3JtYXQodXJsT2JqZWN0KX0sXG4gICAgICAgICAgICByb3V0ZS5vcHRpb25zLFxuICAgICAgICAgICAge3NlcnZpY2VOYW1lOiBtYXRjaFJvdXRlLnNlcnZpY2VOYW1lfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGFjdGlvbihjdHgpIHtcbiAgICAgICAgY29uc3Qgcm91dGVDb25maWcgPSBjdHgucm91dGVDb25maWc7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGN0eC5zZXJ2aWNlQ2xpZW50O1xuICAgICAgICBjb25zdCB0YXJnZXRPcHRpb25zID0gYXdhaXQgU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0VGFyZ2V0T3B0aW9ucyhjdHgudXJsLCByb3V0ZUNvbmZpZywgY2xpZW50KTtcbiAgICAgICAgaWYgKCF0YXJnZXRPcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzcG9uc2VIZWFkZXIgPSB7fTtcbiAgICAgICAgaWYgKHJlc3BvbnNlSGVhZGVyID0gcm91dGVDb25maWcub3B0aW9ucy5yZXNwb25zZUhlYWRlcikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVzcG9uc2VIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlSGVhZGVyLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN0eC5yZXMuc2V0SGVhZGVyKGtleSwgcmVzcG9uc2VIZWFkZXJba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3h5LndlYihcbiAgICAgICAgICAgIGN0eC5yZXEsXG4gICAgICAgICAgICBjdHgucmVzLFxuICAgICAgICAgICAgU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0UHJveHlPcHRpb25zKHJvdXRlQ29uZmlnLCB0YXJnZXRPcHRpb25zKSxcbiAgICAgICAgICAgIChlcnIsIHJlcSwgcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50LmdldENsaWVudCh0YXJnZXRPcHRpb25zLnNlcnZpY2VOYW1lKS5yZW1vdmVVbmF2YWlsYWJsZU5vZGUoYCR7ZXJyLmFkZHJlc3N9OiR7ZXJyLnBvcnR9YClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHttZXNzYWdlOiBlcnIubWVzc2FnZSwgc3RhdHVzOiA1MDB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIGN0eC5yZXNwb25kID0gZmFsc2U7XG4gICAgfVxufVxuIl19