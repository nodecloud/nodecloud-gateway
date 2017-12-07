import Koa from 'koa';

export function routeApp(app) {
    app.use(async (ctx, next) => {
        ctx.body = 'Hello World';
    });
}

export function getMockClient() {
    return {
        getClient(serviceName) {
            return {
                getService(){
                    return {
                        Service: {
                            Address: "localhost",
                            Port: 3001
                        }
                    }
                }
            }
        }
    }
}

