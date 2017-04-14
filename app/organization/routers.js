"use strict";
var organization_component_1 = require("./organization.component");
var auth_guard_1 = require("../auth/services/auth.guard");
exports.OrganizationRoutes = [
    {
        path: 'organization',
        name: 'Organization',
        component: organization_component_1.OrganizationComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map