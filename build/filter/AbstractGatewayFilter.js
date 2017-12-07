'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _check = require('../util/check');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class AbstractGatewayFilter {
    constructor(app) {
        if (!(0, _check.isKoaIns)(app)) {
            throw new Error('Invalid app instance');
        }
        this.app = app;
        this.loaded = false;
    }

    filterType() {
        return 'route';
    }

    filterOrder() {
        return 5;
    }

    shouldFilter(ctx) {
        return _asyncToGenerator(function* () {
            return true;
        })();
    }

    action(ctx) {
        return _asyncToGenerator(function* () {})();
    }

    run() {
        var _this = this;

        this.app.use((() => {
            var _ref = _asyncToGenerator(function* (ctx, next) {
                let should = yield _this.shouldFilter(ctx);
                if (!should) {
                    return next();
                }
                yield _this.action(ctx);
                return next();
            });

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        })());
        this.loaded = true;
    }
}
exports.default = AbstractGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9maWx0ZXIvQWJzdHJhY3RHYXRld2F5RmlsdGVyLmpzIl0sIm5hbWVzIjpbIkFic3RyYWN0R2F0ZXdheUZpbHRlciIsImNvbnN0cnVjdG9yIiwiYXBwIiwiRXJyb3IiLCJsb2FkZWQiLCJmaWx0ZXJUeXBlIiwiZmlsdGVyT3JkZXIiLCJzaG91bGRGaWx0ZXIiLCJjdHgiLCJhY3Rpb24iLCJydW4iLCJ1c2UiLCJuZXh0Iiwic2hvdWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUVlLE1BQU1BLHFCQUFOLENBQTRCO0FBQ3ZDQyxnQkFBWUMsR0FBWixFQUFpQjtBQUNiLFlBQUksQ0FBQyxxQkFBU0EsR0FBVCxDQUFMLEVBQW9CO0FBQ2hCLGtCQUFNLElBQUlDLEtBQUosQ0FBVSxzQkFBVixDQUFOO0FBQ0g7QUFDRCxhQUFLRCxHQUFMLEdBQVdBLEdBQVg7QUFDQSxhQUFLRSxNQUFMLEdBQWMsS0FBZDtBQUNIOztBQUVEQyxpQkFBYTtBQUNULGVBQU8sT0FBUDtBQUNIOztBQUVEQyxrQkFBYztBQUNWLGVBQU8sQ0FBUDtBQUNIOztBQUVLQyxnQkFBTixDQUFtQkMsR0FBbkIsRUFBd0I7QUFBQTtBQUNwQixtQkFBTyxJQUFQO0FBRG9CO0FBRXZCOztBQUVLQyxVQUFOLENBQWFELEdBQWIsRUFBa0I7QUFBQTtBQUVqQjs7QUFFREUsVUFBTTtBQUFBOztBQUNGLGFBQUtSLEdBQUwsQ0FBU1MsR0FBVDtBQUFBLHlDQUFhLFdBQU9ILEdBQVAsRUFBWUksSUFBWixFQUFxQjtBQUM5QixvQkFBSUMsU0FBUyxNQUFNLE1BQUtOLFlBQUwsQ0FBa0JDLEdBQWxCLENBQW5CO0FBQ0Esb0JBQUksQ0FBQ0ssTUFBTCxFQUFhO0FBQ1QsMkJBQU9ELE1BQVA7QUFDSDtBQUNELHNCQUFNLE1BQUtILE1BQUwsQ0FBWUQsR0FBWixDQUFOO0FBQ0EsdUJBQU9JLE1BQVA7QUFDSCxhQVBEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUEsYUFBS1IsTUFBTCxHQUFjLElBQWQ7QUFDSDtBQW5Dc0M7a0JBQXRCSixxQiIsImZpbGUiOiJBYnN0cmFjdEdhdGV3YXlGaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzS29hSW5zfSBmcm9tICcuLi91dGlsL2NoZWNrJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJzdHJhY3RHYXRld2F5RmlsdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICAgICAgaWYgKCFpc0tvYUlucyhhcHApKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXBwIGluc3RhbmNlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZmlsdGVyVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuICdyb3V0ZSc7XG4gICAgfVxuXG4gICAgZmlsdGVyT3JkZXIoKSB7XG4gICAgICAgIHJldHVybiA1O1xuICAgIH1cblxuICAgIGFzeW5jIHNob3VsZEZpbHRlcihjdHgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgYWN0aW9uKGN0eCkge1xuXG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgICB0aGlzLmFwcC51c2UoYXN5bmMgKGN0eCwgbmV4dCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNob3VsZCA9IGF3YWl0IHRoaXMuc2hvdWxkRmlsdGVyKGN0eCk7XG4gICAgICAgICAgICBpZiAoIXNob3VsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFjdGlvbihjdHgpO1xuICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICB9XG59XG4iXX0=