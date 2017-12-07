'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractGatewayFilter = require('./AbstractGatewayFilter');

var _AbstractGatewayFilter2 = _interopRequireDefault(_AbstractGatewayFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PreGatewayFilter extends _AbstractGatewayFilter2.default {
    constructor(app) {
        super(app);
    }

    filterType() {
        return 'pre';
    }
}
exports.default = PreGatewayFilter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9maWx0ZXIvUHJlR2F0ZXdheUZpbHRlci5qcyJdLCJuYW1lcyI6WyJQcmVHYXRld2F5RmlsdGVyIiwiY29uc3RydWN0b3IiLCJhcHAiLCJmaWx0ZXJUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4seUNBQXFEO0FBQ2hFQyxnQkFBWUMsR0FBWixFQUFpQjtBQUNiLGNBQU1BLEdBQU47QUFDSDs7QUFFREMsaUJBQWE7QUFDVCxlQUFPLEtBQVA7QUFDSDtBQVArRDtrQkFBL0NILGdCIiwiZmlsZSI6IlByZUdhdGV3YXlGaWx0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWJzdHJhY3RHYXRld2F5RmlsdGVyIGZyb20gJy4vQWJzdHJhY3RHYXRld2F5RmlsdGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlR2F0ZXdheUZpbHRlciBleHRlbmRzIEFic3RyYWN0R2F0ZXdheUZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgfVxuXG4gICAgZmlsdGVyVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuICdwcmUnO1xuICAgIH1cbn1cbiJdfQ==