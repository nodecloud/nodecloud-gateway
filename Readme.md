# nodecloud-gateway

[nodecloud-gateway](https://github.com/nodecloud/nodecloud-gateway) is a gateway component in microsoft service system. It is inspired by [Zuul](https://github.com/Netflix/zuul). It is based on [koa](http://koajs.com/) middleware mechanism.

**The lib is developing without any production verifications**

## Get Started

Install it via npm:

```shell
npm install --save nodecloud-gateway
```

Implements a filter extends `PreGatewayFilter`(or `AbstractGatewayFilter`, `RouteGatewayFilter`, `PostGatewayFilter`).

The filter which extends `PreGatewayfilter` will be executed first. The following filters extend `RouteGatewayFilter` and `PostGatewayFilter` classes.

```javascript
import {PreGatewayFilter} from 'nodecloud-gateway';

export default class DebugPreGatewayFilter extends PreGatewayFilter {
    constructor(app) {
        super(app);
    }

    // Likes the koa middleware
    async action(ctx) {
        ctx.set('x-gateway', true);
    }
}
```


Use it with koa framework:

```javascript
import Koa from 'koa';
import {NodeGateway} from 'nodecloud-gateway';

import DebugPreGatewayFilter from './DebugPreGatewayFilter'

const gateway = new NodeGateway();
const app = new Koa();

// All responses have the header 'x-gateway: true'
gateway.init(app, [DebugPreGatewayFilter])

// other koa logic and middlewares
app.listen(3000);
```

## API

## Issues


