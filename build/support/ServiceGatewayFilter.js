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
                    client.removeUnavailableNode(`${err.address}:${err.port}`);
                }

                res.end(JSON.stringify({ message: err.message, status: 500 }));
            });
            ctx.respond = false;
        })();
    }
}
exports.default = ServiceGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdXBwb3J0L1NlcnZpY2VHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2VHYXRld2F5RmlsdGVyIiwiY29uc3RydWN0b3IiLCJhcHAiLCJzaG91bGRGaWx0ZXIiLCJjdHgiLCJzZXJ2aWNlQ2xpZW50IiwiaXNPYmplY3RMaWtlIiwicm91dGVDb25maWciLCJpZ25vcmVQYXR0ZXJuIiwiUmVnRXhwIiwidGVzdCIsInVybCIsImxhc3RJbmRleCIsImlzTWF0Y2hQcmVmaXgiLCJwcmVmaXgiLCJ1cmxPYmplY3QiLCJwYXJzZSIsImpvaW4iLCJwYXRobmFtZSIsImluZGV4T2YiLCJnZXRTZXJ2aWNlRW5kcG9pbnQiLCJzZXJ2aWNlTmFtZSIsImNsaWVudCIsImdldENsaWVudCIsInNlcnZpY2UiLCJnZXRTZXJ2aWNlIiwiRXJyb3IiLCJob3N0IiwiZ2V0IiwicG9ydCIsImdldFByb3h5T3B0aW9ucyIsInJvdXRlT3B0aW9ucyIsImFzc2lnbiIsInByZXBlbmRQYXRoIiwiaWdub3JlUGF0aCIsIm9wdGlvbnMiLCJnZXRNYXRjaFJvdXRlIiwicmVxdWVzdFBhdGgiLCJyZXF1ZXN0VXJsIiwibWF0Y2hSb3V0ZSIsIm1heE1hdGNoTGVuIiwiZm9yRWFjaCIsInJvdXRlcyIsInJvdXRlIiwicGF0aFByZWZpeCIsImxlbmd0aCIsImdldFRhcmdldE9wdGlvbnMiLCJoYXNTdWZmaXhTbGFzaCIsImVuZHNXaXRoIiwidGFyZ2V0Iiwic3RyaXBQcmVmaXgiLCJzbGljZSIsInRyaW1FbmQiLCJlbmRwb2ludCIsInByb3RvY29sIiwiaG9zdG5hbWUiLCJwYXRoIiwiaHJlZiIsImZvcm1hdCIsImFjdGlvbiIsInRhcmdldE9wdGlvbnMiLCJyZXNwb25zZUhlYWRlciIsImtleSIsImhhc093blByb3BlcnR5IiwicmVzIiwic2V0SGVhZGVyIiwicHJveHkiLCJ3ZWIiLCJyZXEiLCJvbiIsImVyciIsIndyaXRlSGVhZCIsImlnbm9yZSIsImNvZGUiLCJyZW1vdmVVbmF2YWlsYWJsZU5vZGUiLCJhZGRyZXNzIiwiZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJyZXNwb25kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLG9CQUFOLHNDQUFzRDtBQUNqRUMsZ0JBQVlDLEdBQVosRUFBaUI7QUFDYixjQUFNQSxHQUFOO0FBQ0g7O0FBRUtDLGdCQUFOLENBQW1CQyxHQUFuQixFQUF3QjtBQUFBO0FBQ3BCLGdCQUFJLENBQUMsMEJBQWNBLElBQUlDLGFBQWxCLENBQUwsRUFBdUM7QUFDbkMsdUJBQU8sS0FBUDtBQUNIO0FBQ0QsZ0JBQUksQ0FBQyxpQkFBRUMsWUFBRixDQUFlRixJQUFJRyxXQUFuQixDQUFMLEVBQXNDO0FBQ2xDLHVCQUFPLEtBQVA7QUFDSDtBQUNELGtCQUFNQSxjQUFjSCxJQUFJRyxXQUF4QjtBQUNBLGdCQUFJQSxZQUFZQyxhQUFaLFlBQXFDQyxNQUFyQyxJQUErQ0YsWUFBWUMsYUFBWixDQUEwQkUsSUFBMUIsQ0FBK0JOLElBQUlPLEdBQW5DLENBQW5ELEVBQTRGO0FBQ3hGSiw0QkFBWUMsYUFBWixDQUEwQkksU0FBMUIsR0FBc0MsQ0FBdEM7QUFDQSx1QkFBTyxLQUFQO0FBQ0g7QUFDRCxtQkFBT1oscUJBQXFCYSxhQUFyQixDQUFtQ1QsSUFBSU8sR0FBdkMsRUFBNENKLFlBQVlPLE1BQXhELENBQVA7QUFab0I7QUFhdkI7O0FBRUQsV0FBT0QsYUFBUCxDQUFxQkYsR0FBckIsRUFBMEJHLE1BQTFCLEVBQWtDO0FBQzlCLFlBQUksQ0FBQ0gsR0FBTCxFQUFVO0FBQ04sbUJBQU8sS0FBUDtBQUNIO0FBQ0QsWUFBSSxDQUFDRyxNQUFMLEVBQWE7QUFDVCxtQkFBTyxJQUFQO0FBQ0g7QUFDRCxjQUFNQyxZQUFZLGNBQUlDLEtBQUosQ0FBVUwsR0FBVixDQUFsQjtBQUNBLGVBQU8sZUFBS00sSUFBTCxDQUFV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MEIsY0FBekMsRUFBeUQ7QUFDckQscUJBQUssTUFBTUMsR0FBWCxJQUFrQkQsY0FBbEIsRUFBa0M7QUFDOUIsd0JBQUksQ0FBQ0EsZUFBZUUsY0FBZixDQUE4QkQsR0FBOUIsQ0FBTCxFQUF5QztBQUNyQztBQUNIO0FBQ0QxRCx3QkFBSTRELEdBQUosQ0FBUUMsU0FBUixDQUFrQkgsR0FBbEIsRUFBdUJELGVBQWVDLEdBQWYsQ0FBdkI7QUFDSDtBQUNKOztBQUVELGtCQUFLSSxLQUFMLENBQVdDLEdBQVgsQ0FDSS9ELElBQUlnRSxHQURSLEVBRUloRSxJQUFJNEQsR0FGUixFQUdJaEUscUJBQXFCOEIsZUFBckIsQ0FBcUN2QixXQUFyQyxFQUFrRHFELGFBQWxELENBSEo7QUFLQSxrQkFBS00sS0FBTCxDQUFXRyxFQUFYLENBQWMsT0FBZCxFQUF1QixVQUFVQyxHQUFWLEVBQWVGLEdBQWYsRUFBb0JKLEdBQXBCLEVBQXlCO0FBQzVDLG9CQUFJO0FBQ0FBLHdCQUFJTyxTQUFKLENBQWMsR0FBZCxFQUFtQjtBQUNmLHdDQUFnQjtBQURELHFCQUFuQjtBQUdILGlCQUpELENBSUUsT0FBT0MsTUFBUCxFQUFlLENBQ2hCOztBQUVELG9CQUFJRixPQUFPQSxJQUFJRyxJQUFKLEtBQWEsY0FBeEIsRUFBd0M7QUFDcENuRCwyQkFBT29ELHFCQUFQLENBQThCLEdBQUVKLElBQUlLLE9BQVEsSUFBR0wsSUFBSXpDLElBQUssRUFBeEQ7QUFDSDs7QUFFRG1DLG9CQUFJWSxHQUFKLENBQVFDLEtBQUtDLFNBQUwsQ0FBZSxFQUFDQyxTQUFTVCxJQUFJUyxPQUFkLEVBQXVCQyxRQUFRLEdBQS9CLEVBQWYsQ0FBUjtBQUNILGFBYkQ7QUFjQTVFLGdCQUFJNkUsT0FBSixHQUFjLEtBQWQ7QUFyQ2M7QUFzQ2pCO0FBdkpnRTtrQkFBaERqRixvQiIsImZpbGUiOiJTZXJ2aWNlR2F0ZXdheUZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgVVJMIGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBodHRwUHJveHkgZnJvbSAnaHR0cC1wcm94eSc7XG5cbmltcG9ydCBSb3V0ZUdhdGV3YXlGaWx0ZXIgZnJvbSAnLi4vZmlsdGVyL1JvdXRlR2F0ZXdheUZpbHRlcic7XG5pbXBvcnQge2lzVmFsaWRDbGllbnR9IGZyb20gJy4uL3V0aWwvY2hlY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlR2F0ZXdheUZpbHRlciBleHRlbmRzIFJvdXRlR2F0ZXdheUZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2hvdWxkRmlsdGVyKGN0eCkge1xuICAgICAgICBpZiAoIWlzVmFsaWRDbGllbnQoY3R4LnNlcnZpY2VDbGllbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFfLmlzT2JqZWN0TGlrZShjdHgucm91dGVDb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm91dGVDb25maWcgPSBjdHgucm91dGVDb25maWc7XG4gICAgICAgIGlmIChyb3V0ZUNvbmZpZy5pZ25vcmVQYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwICYmIHJvdXRlQ29uZmlnLmlnbm9yZVBhdHRlcm4udGVzdChjdHgudXJsKSkge1xuICAgICAgICAgICAgcm91dGVDb25maWcuaWdub3JlUGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTZXJ2aWNlR2F0ZXdheUZpbHRlci5pc01hdGNoUHJlZml4KGN0eC51cmwsIHJvdXRlQ29uZmlnLnByZWZpeCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzTWF0Y2hQcmVmaXgodXJsLCBwcmVmaXgpIHtcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBVUkwucGFyc2UodXJsKTtcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbih1cmxPYmplY3QucGF0aG5hbWUsICcvJykuaW5kZXhPZihwcmVmaXgpID09PSAwO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRTZXJ2aWNlRW5kcG9pbnQoc2VydmljZU5hbWUsIGNsaWVudCkge1xuICAgICAgICBsZXQgc2VydmljZUNsaWVudCA9IGNsaWVudC5nZXRDbGllbnQoc2VydmljZU5hbWUpLFxuICAgICAgICAgICAgc2VydmljZSA9IGF3YWl0IHNlcnZpY2VDbGllbnQuZ2V0U2VydmljZSgpO1xuICAgICAgICBpZiAoIXNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9uZSBpbmNvcnJlY3Qgc2VydmljZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBob3N0OiBfLmdldChzZXJ2aWNlLCBbJ1NlcnZpY2UnLCAnQWRkcmVzcyddKSxcbiAgICAgICAgICAgIHBvcnQ6IF8uZ2V0KHNlcnZpY2UsIFsnU2VydmljZScsICdQb3J0J10pXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFByb3h5T3B0aW9ucyhyb3V0ZUNvbmZpZywgcm91dGVPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBfLmFzc2lnbihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwcmVwZW5kUGF0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpZ25vcmVQYXRoOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm91dGVDb25maWcub3B0aW9ucyxcbiAgICAgICAgICAgIHJvdXRlT3B0aW9uc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRNYXRjaFJvdXRlKHJlcXVlc3RQYXRoLCByb3V0ZUNvbmZpZywgcmVxdWVzdFVybCkge1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IG51bGwsXG4gICAgICAgICAgICBtYXhNYXRjaExlbiA9IDA7XG4gICAgICAgIF8uZm9yRWFjaChyb3V0ZUNvbmZpZy5yb3V0ZXMsIChyb3V0ZSwgc2VydmljZU5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0UGF0aC5pbmRleE9mKHJvdXRlLnBhdGhQcmVmaXgpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJvdXRlLmlnbm9yZVBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHAgJiYgcm91dGUuaWdub3JlUGF0dGVybi50ZXN0KHJlcXVlc3RVcmwpKSB7XG4gICAgICAgICAgICAgICAgcm91dGUuaWdub3JlUGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyb3V0ZS5wYXRoUHJlZml4Lmxlbmd0aCA+IG1heE1hdGNoTGVuKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hSb3V0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGUsXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaFJvdXRlO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRUYXJnZXRPcHRpb25zKHJlcXVlc3RVcmwsIHJvdXRlQ29uZmlnLCBjbGllbnQpIHtcbiAgICAgICAgY29uc3QgdXJsT2JqZWN0ID0gVVJMLnBhcnNlKHJlcXVlc3RVcmwpO1xuICAgICAgICBjb25zdCBoYXNTdWZmaXhTbGFzaCA9IF8uZW5kc1dpdGgodXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpO1xuICAgICAgICBsZXQgcGF0aG5hbWUgPSBwYXRoLmpvaW4odXJsT2JqZWN0LnBhdGhuYW1lLCAnLycpO1xuICAgICAgICBjb25zdCBtYXRjaFJvdXRlID0gU2VydmljZUdhdGV3YXlGaWx0ZXIuZ2V0TWF0Y2hSb3V0ZShwYXRobmFtZSwgcm91dGVDb25maWcsIHJlcXVlc3RVcmwpO1xuICAgICAgICBpZiAoIW1hdGNoUm91dGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvdXRlID0gbWF0Y2hSb3V0ZS5yb3V0ZTtcbiAgICAgICAgLy8gSWYgcm91dGUudXJsIGlzIGV4aXN0ZWQsIGZvcndhcmQgZGlyZWN0bHlcbiAgICAgICAgaWYgKHJvdXRlLnVybCkge1xuICAgICAgICAgICAgcmV0dXJuIF8uYXNzaWduKFxuICAgICAgICAgICAgICAgIHt0YXJnZXQ6IHJvdXRlLnVybH0sXG4gICAgICAgICAgICAgICAgcm91dGUub3B0aW9uc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocm91dGUuc3RyaXBQcmVmaXgpIHtcbiAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUuc2xpY2Uocm91dGUucGF0aFByZWZpeC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZS5zbGljZShyb3V0ZUNvbmZpZy5wcmVmaXgubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhc1N1ZmZpeFNsYXNoKSB7XG4gICAgICAgICAgICBwYXRobmFtZSA9IF8udHJpbUVuZChwYXRobmFtZSwgJy8nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZW5kcG9pbnQgPSBhd2FpdCBTZXJ2aWNlR2F0ZXdheUZpbHRlci5nZXRTZXJ2aWNlRW5kcG9pbnQobWF0Y2hSb3V0ZS5zZXJ2aWNlTmFtZSwgY2xpZW50KTtcbiAgICAgICAgdXJsT2JqZWN0LnByb3RvY29sID0gdXJsT2JqZWN0LnByb3RvY29sIHx8ICdodHRwJztcbiAgICAgICAgdXJsT2JqZWN0Lmhvc3QgPSBudWxsO1xuICAgICAgICB1cmxPYmplY3QuaG9zdG5hbWUgPSBlbmRwb2ludC5ob3N0O1xuICAgICAgICB1cmxPYmplY3QucG9ydCA9IGVuZHBvaW50LnBvcnQ7XG4gICAgICAgIHVybE9iamVjdC5wYXRobmFtZSA9IHBhdGhuYW1lO1xuICAgICAgICB1cmxPYmplY3QucGF0aCA9IG51bGw7XG4gICAgICAgIHVybE9iamVjdC5ocmVmID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIF8uYXNzaWduKFxuICAgICAgICAgICAge3RhcmdldDogVVJMLmZvcm1hdCh1cmxPYmplY3QpfSxcbiAgICAgICAgICAgIHJvdXRlLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBhY3Rpb24oY3R4KSB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ29uZmlnID0gY3R4LnJvdXRlQ29uZmlnO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBjdHguc2VydmljZUNsaWVudDtcbiAgICAgICAgY29uc3QgdGFyZ2V0T3B0aW9ucyA9IGF3YWl0IFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldFRhcmdldE9wdGlvbnMoY3R4LnVybCwgcm91dGVDb25maWcsIGNsaWVudCk7XG4gICAgICAgIGlmICghdGFyZ2V0T3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlSGVhZGVyID0ge307XG4gICAgICAgIGlmIChyZXNwb25zZUhlYWRlciA9IHJvdXRlQ29uZmlnLm9wdGlvbnMucmVzcG9uc2VIZWFkZXIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlc3BvbnNlSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZUhlYWRlci5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdHgucmVzLnNldEhlYWRlcihrZXksIHJlc3BvbnNlSGVhZGVyW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm94eS53ZWIoXG4gICAgICAgICAgICBjdHgucmVxLFxuICAgICAgICAgICAgY3R4LnJlcyxcbiAgICAgICAgICAgIFNlcnZpY2VHYXRld2F5RmlsdGVyLmdldFByb3h5T3B0aW9ucyhyb3V0ZUNvbmZpZywgdGFyZ2V0T3B0aW9ucylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5wcm94eS5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyLCByZXEsIHJlcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXMud3JpdGVIZWFkKDUwMCwge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVyciAmJiBlcnIuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpIHtcbiAgICAgICAgICAgICAgICBjbGllbnQucmVtb3ZlVW5hdmFpbGFibGVOb2RlKGAke2Vyci5hZGRyZXNzfToke2Vyci5wb3J0fWApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe21lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGF0dXM6IDUwMH0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGN0eC5yZXNwb25kID0gZmFsc2U7XG4gICAgfVxufVxuIl19