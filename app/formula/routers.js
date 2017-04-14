"use strict";
var formula_box_1 = require("../components/formula.box");
var record_component_1 = require("../components/record.component");
var auth_guard_1 = require("../auth/services/auth.guard");
var profile_component_1 = require("../components/profile.component");
exports.FormulaRoutes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/record'
    },
    {
        path: 'formula',
        component: formula_box_1.FormulaBoxComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'record',
        component: record_component_1.RecordComponent,
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'profile',
        component: profile_component_1.ProfileComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map