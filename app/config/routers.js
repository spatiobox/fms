"use strict";
var config_component_1 = require("./config.component");
var auth_guard_1 = require("../auth/services/auth.guard");
exports.ConfigRoutes = [
    {
        path: 'config',
        name: 'Config',
        component: config_component_1.ConfigComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map