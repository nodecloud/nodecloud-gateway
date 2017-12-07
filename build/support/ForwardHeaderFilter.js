'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _PreGatewayFilter = require('../filter/PreGatewayFilter');

var _PreGatewayFilter2 = _interopRequireDefault(_PreGatewayFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ForwardHeaderFilter extends _PreGatewayFilter2.default {
    constructor(app) {
        super(app);
    }

    action(ctx) {
        return _asyncToGenerator(function* () {
            ctx.set('X-NODE-GATEWAY', true);
            let vias = (ctx.get('Via') || '').split(',');
            vias.push('1.1 NodeGateway');
            ctx.set('Via', vias.join(','));
        })();
    }
}
exports.default = ForwardHeaderFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9zdXBwb3J0L0ZvcndhcmRIZWFkZXJGaWx0ZXIuanMiXSwibmFtZXMiOlsiRm9yd2FyZEhlYWRlckZpbHRlciIsImNvbnN0cnVjdG9yIiwiYXBwIiwiYWN0aW9uIiwiY3R4Iiwic2V0IiwidmlhcyIsImdldCIsInNwbGl0IiwicHVzaCIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7OztBQUVlLE1BQU1BLG1CQUFOLG9DQUFtRDtBQUM5REMsZ0JBQVlDLEdBQVosRUFBaUI7QUFDYixjQUFNQSxHQUFOO0FBQ0g7O0FBRUtDLFVBQU4sQ0FBYUMsR0FBYixFQUFrQjtBQUFBO0FBQ2RBLGdCQUFJQyxHQUFKLENBQVEsZ0JBQVIsRUFBMEIsSUFBMUI7QUFDQSxnQkFBSUMsT0FBTyxDQUFDRixJQUFJRyxHQUFKLENBQVEsS0FBUixLQUFrQixFQUFuQixFQUF1QkMsS0FBdkIsQ0FBNkIsR0FBN0IsQ0FBWDtBQUNBRixpQkFBS0csSUFBTCxDQUFVLGlCQUFWO0FBQ0FMLGdCQUFJQyxHQUFKLENBQVEsS0FBUixFQUFlQyxLQUFLSSxJQUFMLENBQVUsR0FBVixDQUFmO0FBSmM7QUFLakI7QUFWNkQ7a0JBQTdDVixtQiIsImZpbGUiOiJGb3J3YXJkSGVhZGVyRmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByZUdhdGV3YXlGaWx0ZXIgZnJvbSAnLi4vZmlsdGVyL1ByZUdhdGV3YXlGaWx0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3J3YXJkSGVhZGVyRmlsdGVyIGV4dGVuZHMgUHJlR2F0ZXdheUZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgfVxuXG4gICAgYXN5bmMgYWN0aW9uKGN0eCkge1xuICAgICAgICBjdHguc2V0KCdYLU5PREUtR0FURVdBWScsIHRydWUpO1xuICAgICAgICBsZXQgdmlhcyA9IChjdHguZ2V0KCdWaWEnKSB8fCAnJykuc3BsaXQoJywnKTtcbiAgICAgICAgdmlhcy5wdXNoKCcxLjEgTm9kZUdhdGV3YXknKTtcbiAgICAgICAgY3R4LnNldCgnVmlhJywgdmlhcy5qb2luKCcsJykpO1xuICAgIH1cbn0iXX0=