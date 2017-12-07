'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = parseRouteConfig;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defRouteConfig = {
    prefix: '',
    routes: {},
    options: {}
};
const pathRegx = /^\/((?:[a-zA-z\-_\d.]+\/)*)\*{2}$/;

function parseRouteConfig(routeConfig) {
    routeConfig = _lodash2.default.assign({}, defRouteConfig, routeConfig);

    // convert some value
    // add '/' in prefix
    routeConfig['prefix'] = _path2.default.join(routeConfig['prefix'], '/');
    _lodash2.default.forEach(routeConfig['routes'], (route, key) => {
        _lodash2.default.defaults(route, { path: '', options: {} });
        // todo: not route invalid route.path
        if (route.path) {
            let matchPath = _lodash2.default.get(pathRegx.exec(route.path), 1, '');
            route['pathPrefix'] = matchPath ? _path2.default.join('/', routeConfig['prefix'], matchPath, '/') : null;
        }
    });

    return routeConfig;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlsL3BhcnNlUm91dGVDb25maWcuanMiXSwibmFtZXMiOlsicGFyc2VSb3V0ZUNvbmZpZyIsImRlZlJvdXRlQ29uZmlnIiwicHJlZml4Iiwicm91dGVzIiwib3B0aW9ucyIsInBhdGhSZWd4Iiwicm91dGVDb25maWciLCJhc3NpZ24iLCJqb2luIiwiZm9yRWFjaCIsInJvdXRlIiwia2V5IiwiZGVmYXVsdHMiLCJwYXRoIiwibWF0Y2hQYXRoIiwiZ2V0IiwiZXhlYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBVXdCQSxnQjs7QUFWeEI7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTUMsaUJBQWlCO0FBQ25CQyxZQUFRLEVBRFc7QUFFbkJDLFlBQVEsRUFGVztBQUduQkMsYUFBUztBQUhVLENBQXZCO0FBS0EsTUFBTUMsV0FBVyxtQ0FBakI7O0FBRWUsU0FBU0wsZ0JBQVQsQ0FBMEJNLFdBQTFCLEVBQXVDO0FBQ2xEQSxrQkFBYyxpQkFBRUMsTUFBRixDQUFTLEVBQVQsRUFBYU4sY0FBYixFQUE2QkssV0FBN0IsQ0FBZDs7QUFFQTtBQUNBO0FBQ0FBLGdCQUFZLFFBQVosSUFBd0IsZUFBS0UsSUFBTCxDQUFVRixZQUFZLFFBQVosQ0FBVixFQUFpQyxHQUFqQyxDQUF4QjtBQUNBLHFCQUFFRyxPQUFGLENBQVVILFlBQVksUUFBWixDQUFWLEVBQWlDLENBQUNJLEtBQUQsRUFBUUMsR0FBUixLQUFnQjtBQUM3Qyx5QkFBRUMsUUFBRixDQUFXRixLQUFYLEVBQWtCLEVBQUNHLE1BQU0sRUFBUCxFQUFXVCxTQUFTLEVBQXBCLEVBQWxCO0FBQ0E7QUFDQSxZQUFJTSxNQUFNRyxJQUFWLEVBQWdCO0FBQ1osZ0JBQUlDLFlBQVksaUJBQUVDLEdBQUYsQ0FBTVYsU0FBU1csSUFBVCxDQUFjTixNQUFNRyxJQUFwQixDQUFOLEVBQWlDLENBQWpDLEVBQW9DLEVBQXBDLENBQWhCO0FBQ0FILGtCQUFNLFlBQU4sSUFBc0JJLFlBQVksZUFBS04sSUFBTCxDQUM5QixHQUQ4QixFQUU5QkYsWUFBWSxRQUFaLENBRjhCLEVBRzlCUSxTQUg4QixFQUk5QixHQUo4QixDQUFaLEdBS2xCLElBTEo7QUFNSDtBQUNKLEtBWkQ7O0FBY0EsV0FBT1IsV0FBUDtBQUNIIiwiZmlsZSI6InBhcnNlUm91dGVDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IGRlZlJvdXRlQ29uZmlnID0ge1xuICAgIHByZWZpeDogJycsXG4gICAgcm91dGVzOiB7fSxcbiAgICBvcHRpb25zOiB7fVxufTtcbmNvbnN0IHBhdGhSZWd4ID0gL15cXC8oKD86W2EtekEtelxcLV9cXGQuXStcXC8pKilcXCp7Mn0kLztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VSb3V0ZUNvbmZpZyhyb3V0ZUNvbmZpZykge1xuICAgIHJvdXRlQ29uZmlnID0gXy5hc3NpZ24oe30sIGRlZlJvdXRlQ29uZmlnLCByb3V0ZUNvbmZpZyk7XG5cbiAgICAvLyBjb252ZXJ0IHNvbWUgdmFsdWVcbiAgICAvLyBhZGQgJy8nIGluIHByZWZpeFxuICAgIHJvdXRlQ29uZmlnWydwcmVmaXgnXSA9IHBhdGguam9pbihyb3V0ZUNvbmZpZ1sncHJlZml4J10sICcvJyk7XG4gICAgXy5mb3JFYWNoKHJvdXRlQ29uZmlnWydyb3V0ZXMnXSwgKHJvdXRlLCBrZXkpID0+IHtcbiAgICAgICAgXy5kZWZhdWx0cyhyb3V0ZSwge3BhdGg6ICcnLCBvcHRpb25zOiB7fX0pO1xuICAgICAgICAvLyB0b2RvOiBub3Qgcm91dGUgaW52YWxpZCByb3V0ZS5wYXRoXG4gICAgICAgIGlmIChyb3V0ZS5wYXRoKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hQYXRoID0gXy5nZXQocGF0aFJlZ3guZXhlYyhyb3V0ZS5wYXRoKSwgMSwgJycpO1xuICAgICAgICAgICAgcm91dGVbJ3BhdGhQcmVmaXgnXSA9IG1hdGNoUGF0aCA/IHBhdGguam9pbihcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgcm91dGVDb25maWdbJ3ByZWZpeCddLFxuICAgICAgICAgICAgICAgIG1hdGNoUGF0aCxcbiAgICAgICAgICAgICAgICAnLydcbiAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm91dGVDb25maWc7XG59XG5cbiJdfQ==