"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var forms_1 = require('@angular/forms');
var router_1 = require('@angular/router');
var app_routes_1 = require('./app.routes');
var http_1 = require('@angular/http');
var app_component_1 = require("./app.component");
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    forms_1.disableDeprecatedForms(),
    forms_1.provideForms(),
    app_routes_1.AppRouterProviders,
    http_1.HTTP_PROVIDERS,
    router_1.ROUTER_DIRECTIVES
]).catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.js.map