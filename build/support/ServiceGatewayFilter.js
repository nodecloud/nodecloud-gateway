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

                if (err && err.code === 'ECONNREFUSED') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdXBwb3J0L1NlcnZpY2VHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2VHYXRld2F5RmlsdGVyIiwiY29uc3RydWN0b3IiLCJhcHAiLCJzaG91bGRGaWx0ZXIiLCJjdHgiLCJzZXJ2aWNlQ2xpZW50IiwiaXNPYmplY3RMaWtlIiwicm91dGVDb25maWciLCJpZ25vcmVQYXR0ZXJuIiwiUmVnRXhwIiwidGVzdCIsInVybCIsImxhc3RJbmRleCIsImlzTWF0Y2hQcmVmaXgiLCJwcmVmaXgiLCJ1cmxPYmplY3QiLCJwYXJzZSIsImpvaW4iLCJwYXRobmFtZSIsImluZGV4T2YiLCJnZXRTZXJ2aWNlRW5kcG9pbnQiLCJzZXJ2aWNlTmFtZSIsImNsaWVudCIsImdldENsaWVudCIsInNlcnZpY2UiLCJnZXRTZXJ2aWNlIiwiRXJyb3IiLCJob3N0IiwiZ2V0IiwicG9ydCIsImdldFByb3h5T3B0aW9ucyIsInJvdXRlT3B0aW9ucyIsImFzc2lnbiIsInByZXBlbmRQYXRoIiwiaWdub3JlUGF0aCIsIm9wdGlvbnMiLCJnZXRNYXRjaFJvdXRlIiwicmVxdWVzdFBhdGgiLCJyZXF1ZXN0VXJsIiwibWF0Y2hSb3V0ZSIsIm1heE1hdGNoTGVuIiwiZm9yRWFjaCIsInJvdXRlcyIsInJvdXRlIiwicGF0aFByZWZpeCIsImxlbmd0aCIsImdldFRhcmdldE9wdGlvbnMiLCJoYXNTdWZmaXhTbGFzaCIsImVuZHNXaXRoIiwidGFyZ2V0Iiwic3RyaXBQcmVmaXgiLCJzbGljZSIsInRyaW1FbmQiLCJlbmRwb2ludCIsInByb3RvY29sIiwiaG9zdG5hbWUiLCJwYXRoIiwiaHJlZiIsImZvcm1hdCIsImFjdGlvbiIsInRhcmdldE9wdGlvbnMiLCJyZXNwb25zZUhlYWRlciIsImtleSIsImhhc093blByb3BlcnR5IiwicmVzIiwic2V0SGVhZGVyIiwicHJveHkiLCJ3ZWIiLCJyZXEiLCJvbiIsImVyciIsIndyaXRlSGVhZCIsImlnbm9yZSIsImNvZGUiLCJyZW1vdmVVbmF2YWlsYWJsZU5vZGUiLCJlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWVzc2FnZSIsInN0YXR1cyIsInJlc3BvbmQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsb0JBQU4sc0NBQXNEO0FBQ2pFQyxnQkFBWUMsR0FBWixFQUFpQjtBQUNiLGNBQU1BLEdBQU47QUFDSDs7QUFFS0MsZ0JBQU4sQ0FBbUJDLEdBQW5CLEVBQXdCO0FBQUE7QUFDcEIsZ0JBQUksQ0FBQywwQkFBY0EsSUFBSUMsYUFBbEIsQ0FBTCxFQUF1QztBQUNuQyx1QkFBTyxLQUFQO0FBQ0g7QUFDRCxnQkFBSSxDQUFDLGlCQUFFQyxZQUFGLENBQWVGLElBQUlHLFdBQW5CLENBQUwsRUFBc0M7QUFDbEMsdUJBQU8sS0FBUDtBQUNIO0FBQ0Qsa0JBQU1BLGNBQWNILElBQUlHLFdBQXhCO0FBQ0EsZ0JBQUlBLFlBQVlDLGFBQVosWUFBcUNDLE1BQXJDLElBQStDRixZQUFZQyxhQUFaLENBQTBCRSxJQUExQixDQUErQk4sSUFBSU8sR0FBbkMsQ0FBbkQsRUFBNEY7QUFDeEZKLDRCQUFZQyxhQUFaLENBQTBCSSxTQUExQixHQUFzQyxDQUF0QztBQUNBLHVCQUFPLEtBQVA7QUFDSDtBQUNELG1CQUFPWixxQkFBcUJhLGFBQXJCLENBQW1DVCxJQUFJTyxHQUF2QyxFQUE0Q0osWUFBWU8sTUFBeEQsQ0FBUDtBQVpvQjtBQWF2Qjs7QUFFRCxXQUFPRCxhQUFQLENBQXFCRixHQUFyQixFQUEwQkcsTUFBMUIsRUFBa0M7QUFDOUIsWUFBSSxDQUFDSCxHQUFMLEVBQVU7QUFDTixtQkFBTyxLQUFQO0FBQ0g7QUFDRCxZQUFJLENBQUNHLE1BQUwsRUFBYTtBQUNULG1CQUFPLElBQVA7QUFDSDtBQUNELGNBQU1DLFlBQVksY0FBSUMsS0FBSixDQUFVTCxHQUFWLENBQWxCO0FBQ0EsZUFBTyxlQUFLTSxJQUFMLENBQVVGLFVBQVVHLFFB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cnZpY2VHYXRld2F5RmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBVUkwgZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGh0dHBQcm94eSBmcm9tICdodHRwLXByb3h5JztcblxuaW1wb3J0IFJvdXRlR2F0ZXdheUZpbHRlciBmcm9tICcuLi9maWx0ZXIvUm91dGVHYXRld2F5RmlsdGVyJztcbmltcG9ydCB7aXNWYWxpZENsaWVudH0gZnJvbSAnLi4vdXRpbC9jaGVjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2VHYXRld2F5RmlsdGVyIGV4dGVuZHMgUm91dGVHYXRld2F5RmlsdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICB9XG5cbiAgICBhc3luYyBzaG91bGRGaWx0ZXIoY3R4KSB7XG4gICAgICAgIGlmICghaXNWYWxpZENsaWVudChjdHguc2VydmljZUNsaWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV8uaXNPYmplY3RMaWtlKGN0eC5yb3V0ZUNvbmZpZykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3V0ZUNvbmZpZyA9IGN0eC5yb3V0ZUNvbmZpZztcbiAgICAgICAgaWYgKHJvdXRlQ29uZmlnLmlnbm9yZVBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHAgJiYgcm91dGVDb25maWcuaWdub3JlUGF0dGVybi50ZXN0KGN0eC51cmwpKSB7XG4gICAgICAgICAgICByb3V0ZUNvbmZpZy5pZ25vcmVQYXR0ZXJuLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNlcnZpY2VHYXRld2F5RmlsdGVyLmlzTWF0Y2hQcmVmaXgoY3R4LnVybCwgcm91dGVDb25maWcucHJlZml4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNNYXRjaFByZWZpeCh1cmwsIHByZWZpeCkge1xuICAgICAgICBpZiAoIXVybCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmVmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVybE9iamVjdCA9IFVSTC5wYXJzZSh1cmwpO1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKHVybE9iamVjdC5wYXRobmFtZSwgJy8nKS5pbmRleE9mKHByZWZpeCkgPT09IDA7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldFNlcnZpY2VFbmRwb2ludChzZXJ2aWNlTmFtZSwgY2xpZW50KSB7XG4gICAgICAgIGxldCBzZXJ2aWNlQ2xpZW50ID0gY2xpZW50LmdldENsaWVudChzZXJ2aWNlTmFtZSksXG4gICAgICAgICAgICBzZXJ2aWNlID0gYXdhaXQgc2VydmljZUNsaWVudC5nZXRTZXJ2aWNlKCk7XG4gICAgICAgIGlmICghc2VydmljZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb25lIGluY29ycmVjdCBzZXJ2aWNlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhvc3Q6IF8uZ2V0KHNlcnZpY2UsIFsnU2VydmljZScsICdBZGRyZXNzJ10pLFxuICAgICAgICAgICAgcG9ydDogXy5nZXQoc2VydmljZSwgWydTZXJ2aWNlJywgJ1BvcnQnXSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0UHJveHlPcHRpb25zKHJvdXRlQ29uZmlnLCByb3V0ZU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIF8uYXNzaWduKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHByZXBlbmRQYXRoOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlnbm9yZVBhdGg6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb3V0ZUNvbmZpZy5vcHRpb25zLFxuICAgICAgICAgICAgcm91dGVPcHRpb25zXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldE1hdGNoUm91dGUocmVxdWVzdFBhdGgsIHJvdXRlQ29uZmlnLCByZXF1ZXN0VXJsKSB7XG4gICAgICAgIGxldCBtYXRjaFJvdXRlID0gbnVsbCxcbiAgICAgICAgICAgIG1heE1hdGNoTGVuID0gMDtcbiAgICAgICAgXy5mb3JFYWNoKHJvdXRlQ29uZmlnLnJvdXRlcywgKHJvdXRlLCBzZXJ2aWNlTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcXVlc3RQYXRoLmluZGV4T2Yocm91dGUucGF0aFByZWZpeCkgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocm91dGUuaWdub3JlUGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiByb3V0ZS5pZ25vcmVQYXR0ZXJuLnRlc3QocmVxdWVzdFVybCkpIHtcbiAgICAgICAgICAgICAgICByb3V0ZS5pZ25vcmVQYXR0ZXJuLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJvdXRlLnBhdGhQcmVmaXgubGVuZ3RoID4gbWF4TWF0Y2hMZW4pIHtcbiAgICAgICAgICAgICAgICBtYXRjaFJvdXRlID0ge1xuICAgICAgICAgICAgICAgICAgICByb3V0ZSxcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZU5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGU7XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldFRhcmdldE9wdGlvbnMocmVxdWVzdFVybCwgcm91dGVDb25maWcsIGNsaWVudCkge1xuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBVUkwucGFyc2UocmVxdWVzdFVybCk7XG4gICAgICAgIGNvbnN0IGhhc1N1ZmZpeFNsYXNoID0gXy5lbmRzV2l0aCh1cmxPYmplY3QucGF0aG5hbWUsICcvJyk7XG4gICAgICAgIGxldCBwYXRobmFtZSA9IHBhdGguam9pbih1cmxPYmplY3QucGF0aG5hbWUsICcvJyk7XG4gICAgICAgIGNvbnN0IG1hdGNoUm91dGUgPSBTZXJ2aWNlR2F0ZXdheUZpbHRlci5nZXRNYXRjaFJvdXRlKHBhdGhuYW1lLCByb3V0ZUNvbmZpZywgcmVxdWVzdFVybCk7XG4gICAgICAgIGlmICghbWF0Y2hSb3V0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm91dGUgPSBtYXRjaFJvdXRlLnJvdXRlO1xuICAgICAgICAvLyBJZiByb3V0ZS51cmwgaXMgZXhpc3RlZCwgZm9yd2FyZCBkaXJlY3RseVxuICAgICAgICBpZiAocm91dGUudXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5hc3NpZ24oXG4gICAgICAgICAgICAgICAge3RhcmdldDogcm91dGUudXJsfSxcbiAgICAgICAgICAgICAgICByb3V0ZS5vcHRpb25zXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyb3V0ZS5zdHJpcFByZWZpeCkge1xuICAgICAgICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZS5zbGljZShyb3V0ZS5wYXRoUHJlZml4Lmxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXRobmFtZSA9IHBhdGhuYW1lLnNsaWNlKHJvdXRlQ29uZmlnLnByZWZpeC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzU3VmZml4U2xhc2gpIHtcbiAgICAgICAgICAgIHBhdGhuYW1lID0gXy50cmltRW5kKHBhdGhuYW1lLCAnLycpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBlbmRwb2ludCA9IGF3YWl0IFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldFNlcnZpY2VFbmRwb2ludChtYXRjaFJvdXRlLnNlcnZpY2VOYW1lLCBjbGllbnQpO1xuICAgICAgICB1cmxPYmplY3QucHJvdG9jb2wgPSB1cmxPYmplY3QucHJvdG9jb2wgfHwgJ2h0dHAnO1xuICAgICAgICB1cmxPYmplY3QuaG9zdCA9IG51bGw7XG4gICAgICAgIHVybE9iamVjdC5ob3N0bmFtZSA9IGVuZHBvaW50Lmhvc3Q7XG4gICAgICAgIHVybE9iamVjdC5wb3J0ID0gZW5kcG9pbnQucG9ydDtcbiAgICAgICAgdXJsT2JqZWN0LnBhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgICAgIHVybE9iamVjdC5wYXRoID0gbnVsbDtcbiAgICAgICAgdXJsT2JqZWN0LmhyZWYgPSBudWxsO1xuICAgICAgICB1cmxPYmplY3Quc2VydmljZU5hbWUgPSBtYXRjaFJvdXRlLnNlcnZpY2VOYW1lO1xuICAgICAgICByZXR1cm4gXy5hc3NpZ24oXG4gICAgICAgICAgICB7dGFyZ2V0OiBVUkwuZm9ybWF0KHVybE9iamVjdCl9LFxuICAgICAgICAgICAgcm91dGUub3B0aW9uc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGFjdGlvbihjdHgpIHtcbiAgICAgICAgY29uc3Qgcm91dGVDb25maWcgPSBjdHgucm91dGVDb25maWc7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGN0eC5zZXJ2aWNlQ2xpZW50O1xuICAgICAgICBjb25zdCB0YXJnZXRPcHRpb25zID0gYXdhaXQgU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0VGFyZ2V0T3B0aW9ucyhjdHgudXJsLCByb3V0ZUNvbmZpZywgY2xpZW50KTtcbiAgICAgICAgaWYgKCF0YXJnZXRPcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzcG9uc2VIZWFkZXIgPSB7fTtcbiAgICAgICAgaWYgKHJlc3BvbnNlSGVhZGVyID0gcm91dGVDb25maWcub3B0aW9ucy5yZXNwb25zZUhlYWRlcikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVzcG9uc2VIZWFkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlSGVhZGVyLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN0eC5yZXMuc2V0SGVhZGVyKGtleSwgcmVzcG9uc2VIZWFkZXJba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3h5LndlYihcbiAgICAgICAgICAgIGN0eC5yZXEsXG4gICAgICAgICAgICBjdHgucmVzLFxuICAgICAgICAgICAgU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0UHJveHlPcHRpb25zKHJvdXRlQ29uZmlnLCB0YXJnZXRPcHRpb25zKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnByb3h5Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwLCB7XG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXJyICYmIGVyci5jb2RlID09PSAnRUNPTk5SRUZVU0VEJykge1xuICAgICAgICAgICAgICAgIGxldCBzZXJ2aWNlQ2xpZW50ID0gY2xpZW50LmdldENsaWVudCh0YXJnZXRPcHRpb25zLnNlcnZpY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlQ2xpZW50LnJlbW92ZVVuYXZhaWxhYmxlTm9kZShgJHt0YXJnZXRPcHRpb25zLmhvc3RuYW1lfToke3RhcmdldE9wdGlvbnMucG9ydH1gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHttZXNzYWdlOiBlcnIubWVzc2FnZSwgc3RhdHVzOiA1MDB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjdHgucmVzcG9uZCA9IGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==