import _ from 'lodash';

export function isKoaIns(app) {
    return _.isFunction(app.use) && _.isFunction(app.callback)
}
