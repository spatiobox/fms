"use strict";
var auth_guard_1 = require("../auth/services/auth.guard");
var scale_component_1 = require("./scale.component");
exports.ScaleRoutes = [
    {
        path: 'scale',
        component: scale_component_1.ScaleComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map