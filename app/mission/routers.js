"use strict";
var auth_guard_1 = require("../auth/services/auth.guard");
var mission_component_1 = require("./mission.component");
exports.MissionRoutes = [
    {
        path: 'mission',
        component: mission_component_1.MissionComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map