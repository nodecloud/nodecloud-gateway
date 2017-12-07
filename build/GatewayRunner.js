'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _FilterLoader = require('./FilterLoader');

var _FilterLoader2 = _interopRequireDefault(_FilterLoader);

var _FilterProcess = require('./FilterProcess');

var _FilterProcess2 = _interopRequireDefault(_FilterProcess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GatewayRunner {
    constructor(app) {
        this.app = app;
    }

    init(filterClasses = []) {
        let process = new _FilterProcess2.default(_FilterLoader2.default.getInstance().loadFilters(filterClasses, this.app));
        process.runFilters('pre');
        process.runFilters('route');
        process.runFilters('post');
    }
}
exports.default = GatewayRunner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9HYXRld2F5UnVubmVyLmpzIl0sIm5hbWVzIjpbIkdhdGV3YXlSdW5uZXIiLCJjb25zdHJ1Y3RvciIsImFwcCIsImluaXQiLCJmaWx0ZXJDbGFzc2VzIiwicHJvY2VzcyIsImdldEluc3RhbmNlIiwibG9hZEZpbHRlcnMiLCJydW5GaWx0ZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxhQUFOLENBQW9CO0FBQy9CQyxnQkFBWUMsR0FBWixFQUFpQjtBQUNiLGFBQUtBLEdBQUwsR0FBV0EsR0FBWDtBQUNIOztBQUVEQyxTQUFLQyxnQkFBZ0IsRUFBckIsRUFBeUI7QUFDckIsWUFBSUMsVUFBVSw0QkFDVix1QkFBYUMsV0FBYixHQUEyQkMsV0FBM0IsQ0FBdUNILGFBQXZDLEVBQXNELEtBQUtGLEdBQTNELENBRFUsQ0FBZDtBQUdBRyxnQkFBUUcsVUFBUixDQUFtQixLQUFuQjtBQUNBSCxnQkFBUUcsVUFBUixDQUFtQixPQUFuQjtBQUNBSCxnQkFBUUcsVUFBUixDQUFtQixNQUFuQjtBQUNIO0FBWjhCO2tCQUFkUixhIiwiZmlsZSI6IkdhdGV3YXlSdW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRmlsdGVyTG9hZGVyIGZyb20gJy4vRmlsdGVyTG9hZGVyJztcbmltcG9ydCBGaWx0ZXJQcm9jZXNzIGZyb20gJy4vRmlsdGVyUHJvY2Vzcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhdGV3YXlSdW5uZXIge1xuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICB9XG5cbiAgICBpbml0KGZpbHRlckNsYXNzZXMgPSBbXSkge1xuICAgICAgICBsZXQgcHJvY2VzcyA9IG5ldyBGaWx0ZXJQcm9jZXNzKFxuICAgICAgICAgICAgRmlsdGVyTG9hZGVyLmdldEluc3RhbmNlKCkubG9hZEZpbHRlcnMoZmlsdGVyQ2xhc3NlcywgdGhpcy5hcHApXG4gICAgICAgICk7XG4gICAgICAgIHByb2Nlc3MucnVuRmlsdGVycygncHJlJyk7XG4gICAgICAgIHByb2Nlc3MucnVuRmlsdGVycygncm91dGUnKTtcbiAgICAgICAgcHJvY2Vzcy5ydW5GaWx0ZXJzKCdwb3N0Jyk7XG4gICAgfVxufSJdfQ==