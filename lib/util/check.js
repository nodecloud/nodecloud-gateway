import _ from 'lodash';

export function isKoaIns(app) {
    return app && _.isFunction(app.use) && _.isFunction(app.callback)
}

export function isValidClient(client) {
    return client && _.isFunction(client.getService);
}
