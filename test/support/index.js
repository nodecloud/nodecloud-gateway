import Koa from 'koa';

export function routeApp(app) {
    app.use(async (ctx, next) => {
        ctx.body = 'Hello World';
    });
}

