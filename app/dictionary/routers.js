"use strict";
var dictionary_component_1 = require("./dictionary.component");
var auth_guard_1 = require("../auth/services/auth.guard");
exports.DictionaryRoutes = [
    {
        path: 'dictionary',
        name: 'Dictionary',
        component: dictionary_component_1.DictionaryComponent,
        canActivate: [auth_guard_1.AuthGuard]
    }
];
//# sourceMappingURL=routers.js.map