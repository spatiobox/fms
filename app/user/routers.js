"use strict";
var user_component_1 = require("./user.component");
var auth_guard_1 = require("../auth/services/auth.guard");
exports.UserRoutes = [
    {
        path: 'user',
        name: 'User',
        component: user_component_1.UserComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map