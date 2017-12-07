'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractGatewayFilter = require('./AbstractGatewayFilter');

var _AbstractGatewayFilter2 = _interopRequireDefault(_AbstractGatewayFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PostGatewayFilter extends _AbstractGatewayFilter2.default {
    constructor(app) {
        super(app);
    }

    filterType() {
        return 'post';
    }
}
exports.default = PostGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9maWx0ZXIvUG9zdEdhdGV3YXlGaWx0ZXIuanMiXSwibmFtZXMiOlsiUG9zdEdhdGV3YXlGaWx0ZXIiLCJjb25zdHJ1Y3RvciIsImFwcCIsImZpbHRlclR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFFZSxNQUFNQSxpQkFBTix5Q0FBc0Q7QUFDakVDLGdCQUFZQyxHQUFaLEVBQWlCO0FBQ2IsY0FBTUEsR0FBTjtBQUNIOztBQUVEQyxpQkFBYTtBQUNULGVBQU8sTUFBUDtBQUNIO0FBUGdFO2tCQUFoREgsaUIiLCJmaWxlIjoiUG9zdEdhdGV3YXlGaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RHYXRld2F5RmlsdGVyIGZyb20gJy4vQWJzdHJhY3RHYXRld2F5RmlsdGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9zdEdhdGV3YXlGaWx0ZXIgZXh0ZW5kcyBBYnN0cmFjdEdhdGV3YXlGaWx0ZXIge1xuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIGZpbHRlclR5cGUoKSB7XG4gICAgICAgIHJldHVybiAncG9zdCc7XG4gICAgfVxufVxuIl19