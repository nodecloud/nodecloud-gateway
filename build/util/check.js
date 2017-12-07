'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isKoaIns = isKoaIns;
exports.isValidClient = isValidClient;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isKoaIns(app) {
    return app && _lodash2.default.isFunction(app.use) && _lodash2.default.isFunction(app.callback);
}

function isValidClient(client) {
    return client && _lodash2.default.isFunction(client.getClient);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlsL2NoZWNrLmpzIl0sIm5hbWVzIjpbImlzS29hSW5zIiwiaXNWYWxpZENsaWVudCIsImFwcCIsImlzRnVuY3Rpb24iLCJ1c2UiLCJjYWxsYmFjayIsImNsaWVudCIsImdldENsaWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFFZ0JBLFEsR0FBQUEsUTtRQUlBQyxhLEdBQUFBLGE7O0FBTmhCOzs7Ozs7QUFFTyxTQUFTRCxRQUFULENBQWtCRSxHQUFsQixFQUF1QjtBQUMxQixXQUFPQSxPQUFPLGlCQUFFQyxVQUFGLENBQWFELElBQUlFLEdBQWpCLENBQVAsSUFBZ0MsaUJBQUVELFVBQUYsQ0FBYUQsSUFBSUcsUUFBakIsQ0FBdkM7QUFDSDs7QUFFTSxTQUFTSixhQUFULENBQXVCSyxNQUF2QixFQUErQjtBQUNsQyxXQUFPQSxVQUFVLGlCQUFFSCxVQUFGLENBQWFHLE9BQU9DLFNBQXBCLENBQWpCO0FBQ0giLCJmaWxlIjoiY2hlY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNLb2FJbnMoYXBwKSB7XG4gICAgcmV0dXJuIGFwcCAmJiBfLmlzRnVuY3Rpb24oYXBwLnVzZSkgJiYgXy5pc0Z1bmN0aW9uKGFwcC5jYWxsYmFjaylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRDbGllbnQoY2xpZW50KSB7XG4gICAgcmV0dXJuIGNsaWVudCAmJiBfLmlzRnVuY3Rpb24oY2xpZW50LmdldENsaWVudCk7XG59XG4iXX0=