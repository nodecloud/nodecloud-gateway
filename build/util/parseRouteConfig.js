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
            if (!route.pathPrefix) {
                const matchPath = _lodash2.default.get(pathRegx.exec(route.path), 1, '');
                route.pathPrefix = matchPath ? _path2.default.join('/', routeConfig.prefix, matchPath, '/') : '';
            } else {
                const matchPath = _lodash2.default.get(pathRegx.exec(route.pathPrefix), 1, '');
                route.pathPrefix = matchPath ? _path2.default.join('/', routeConfig.prefix, matchPath, '/') : '';
            }
        }
    });

    return routeConfig;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlsL3BhcnNlUm91dGVDb25maWcuanMiXSwibmFtZXMiOlsicGFyc2VSb3V0ZUNvbmZpZyIsImRlZlJvdXRlQ29uZmlnIiwicHJlZml4Iiwicm91dGVzIiwib3B0aW9ucyIsInBhdGhSZWd4Iiwicm91dGVDb25maWciLCJhc3NpZ24iLCJqb2luIiwiZm9yRWFjaCIsInJvdXRlIiwia2V5IiwiZGVmYXVsdHMiLCJwYXRoIiwicGF0aFByZWZpeCIsIm1hdGNoUGF0aCIsImdldCIsImV4ZWMiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQVV3QkEsZ0I7O0FBVnhCOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU1DLGlCQUFpQjtBQUNuQkMsWUFBUSxFQURXO0FBRW5CQyxZQUFRLEVBRlc7QUFHbkJDLGFBQVM7QUFIVSxDQUF2QjtBQUtBLE1BQU1DLFdBQVcsbUNBQWpCOztBQUVlLFNBQVNMLGdCQUFULENBQTBCTSxXQUExQixFQUF1QztBQUNsREEsa0JBQWMsaUJBQUVDLE1BQUYsQ0FBUyxFQUFULEVBQWFOLGNBQWIsRUFBNkJLLFdBQTdCLENBQWQ7O0FBRUE7QUFDQTtBQUNBQSxnQkFBWSxRQUFaLElBQXdCLGVBQUtFLElBQUwsQ0FBVUYsWUFBWSxRQUFaLENBQVYsRUFBaUMsR0FBakMsQ0FBeEI7QUFDQSxxQkFBRUcsT0FBRixDQUFVSCxZQUFZLFFBQVosQ0FBVixFQUFpQyxDQUFDSSxLQUFELEVBQVFDLEdBQVIsS0FBZ0I7QUFDN0MseUJBQUVDLFFBQUYsQ0FBV0YsS0FBWCxFQUFrQixFQUFDRyxNQUFNLEVBQVAsRUFBV1QsU0FBUyxFQUFwQixFQUFsQjtBQUNBO0FBQ0EsWUFBSU0sTUFBTUcsSUFBVixFQUFnQjtBQUNaLGdCQUFJLENBQUNILE1BQU1JLFVBQVgsRUFBdUI7QUFDbkIsc0JBQU1DLFlBQVksaUJBQUVDLEdBQUYsQ0FBTVgsU0FBU1ksSUFBVCxDQUFjUCxNQUFNRyxJQUFwQixDQUFOLEVBQWlDLENBQWpDLEVBQW9DLEVBQXBDLENBQWxCO0FBQ0FILHNCQUFNSSxVQUFOLEdBQW1CQyxZQUFZLGVBQUtQLElBQUwsQ0FDM0IsR0FEMkIsRUFFM0JGLFlBQVlKLE1BRmUsRUFHM0JhLFNBSDJCLEVBSTNCLEdBSjJCLENBQVosR0FLZixFQUxKO0FBTUgsYUFSRCxNQVFPO0FBQ0gsc0JBQU1BLFlBQVksaUJBQUVDLEdBQUYsQ0FBTVgsU0FBU1ksSUFBVCxDQUFjUCxNQUFNSSxVQUFwQixDQUFOLEVBQXVDLENBQXZDLEVBQTBDLEVBQTFDLENBQWxCO0FBQ0FKLHNCQUFNSSxVQUFOLEdBQW1CQyxZQUFZLGVBQUtQLElBQUwsQ0FDM0IsR0FEMkIsRUFFM0JGLFlBQVlKLE1BRmUsRUFHM0JhLFNBSDJCLEVBSTNCLEdBSjJCLENBQVosR0FLZixFQUxKO0FBTUg7QUFDSjtBQUNKLEtBdEJEOztBQXdCQSxXQUFPVCxXQUFQO0FBQ0giLCJmaWxlIjoicGFyc2VSb3V0ZUNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgZGVmUm91dGVDb25maWcgPSB7XG4gICAgcHJlZml4OiAnJyxcbiAgICByb3V0ZXM6IHt9LFxuICAgIG9wdGlvbnM6IHt9XG59O1xuY29uc3QgcGF0aFJlZ3ggPSAvXlxcLygoPzpbYS16QS16XFwtX1xcZC5dK1xcLykqKVxcKnsyfSQvO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZVJvdXRlQ29uZmlnKHJvdXRlQ29uZmlnKSB7XG4gICAgcm91dGVDb25maWcgPSBfLmFzc2lnbih7fSwgZGVmUm91dGVDb25maWcsIHJvdXRlQ29uZmlnKTtcblxuICAgIC8vIGNvbnZlcnQgc29tZSB2YWx1ZVxuICAgIC8vIGFkZCAnLycgaW4gcHJlZml4XG4gICAgcm91dGVDb25maWdbJ3ByZWZpeCddID0gcGF0aC5qb2luKHJvdXRlQ29uZmlnWydwcmVmaXgnXSwgJy8nKTtcbiAgICBfLmZvckVhY2gocm91dGVDb25maWdbJ3JvdXRlcyddLCAocm91dGUsIGtleSkgPT4ge1xuICAgICAgICBfLmRlZmF1bHRzKHJvdXRlLCB7cGF0aDogJycsIG9wdGlvbnM6IHt9fSk7XG4gICAgICAgIC8vIHRvZG86IG5vdCByb3V0ZSBpbnZhbGlkIHJvdXRlLnBhdGhcbiAgICAgICAgaWYgKHJvdXRlLnBhdGgpIHtcbiAgICAgICAgICAgIGlmICghcm91dGUucGF0aFByZWZpeCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoUGF0aCA9IF8uZ2V0KHBhdGhSZWd4LmV4ZWMocm91dGUucGF0aCksIDEsICcnKTtcbiAgICAgICAgICAgICAgICByb3V0ZS5wYXRoUHJlZml4ID0gbWF0Y2hQYXRoID8gcGF0aC5qb2luKFxuICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlQ29uZmlnLnByZWZpeCxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hQYXRoLFxuICAgICAgICAgICAgICAgICAgICAnLydcbiAgICAgICAgICAgICAgICApIDogJyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoUGF0aCA9IF8uZ2V0KHBhdGhSZWd4LmV4ZWMocm91dGUucGF0aFByZWZpeCksIDEsICcnKTtcbiAgICAgICAgICAgICAgICByb3V0ZS5wYXRoUHJlZml4ID0gbWF0Y2hQYXRoID8gcGF0aC5qb2luKFxuICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlQ29uZmlnLnByZWZpeCxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hQYXRoLFxuICAgICAgICAgICAgICAgICAgICAnLydcbiAgICAgICAgICAgICAgICApIDogJydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvdXRlQ29uZmlnO1xufVxuXG4iXX0=