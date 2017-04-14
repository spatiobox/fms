"use strict";
var bucket_component_1 = require("./bucket.component");
var auth_guard_1 = require("../auth/services/auth.guard");
exports.BucketRoutes = [
    {
        path: 'bucket',
        name: 'bucket',
        component: bucket_component_1.BucketComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map