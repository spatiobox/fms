"use strict";
var login_component_1 = require("../auth/components/login.component");
var auth_guard_1 = require("./services/auth.guard");
var auth_service_1 = require("./services/auth.service");
var forgot_component_1 = require("./components/forgot.component");
var register_component_1 = require("./components/register.component");
exports.AuthRoutes = [
    { path: 'login', name: 'Login', component: login_component_1.LoginComponent },
    { path: 'forgot', name: 'Forgot', component: forgot_component_1.ForgotComponent },
    { path: 'register', name: 'Register', component: register_component_1.RegisterComponent }
];
exports.AuthProviders = [auth_guard_1.AuthGuard, auth_service_1.AuthService];
//# sourceMappingURL=routers.js.map