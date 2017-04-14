"use strict";
var router_1 = require('@angular/router');
var routers_1 = require('../app/formula/routers');
var routers_2 = require('../app/auth/routers');
var routers_3 = require('../app/user/routers');
var routers_4 = require('../app/organization/routers');
var routers_5 = require('../app/dictionary/routers');
var routers_6 = require('../app/config/routers');
var routers_7 = require('../app/mission/routers');
var routers_8 = require('../app/scale/routers');
var routers_9 = require('../app/bucket/routers');
exports.routes = routers_1.FormulaRoutes.concat(routers_2.AuthRoutes)
    .concat(routers_3.UserRoutes)
    .concat(routers_5.DictionaryRoutes)
    .concat(routers_4.OrganizationRoutes)
    .concat(routers_9.BucketRoutes)
    .concat(routers_6.ConfigRoutes)
    .concat(routers_7.MissionRoutes)
    .concat(routers_8.ScaleRoutes);
exports.AppRouterProviders = [
    router_1.provideRouter(exports.routes),
    routers_2.AuthProviders
];
//# sourceMappingURL=app.routes.js.map