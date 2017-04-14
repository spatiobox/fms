"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var record_component_1 = require("./components/record.component");
var formula_box_1 = require("./components/formula.box");
var profile_component_1 = require("./components/profile.component");
var communicate_service_1 = require("./services/communicate.service");
var login_component_1 = require("./auth/components/login.component");
var forgot_component_1 = require("./auth/components/forgot.component");
var user_component_1 = require("./user/user.component");
var mission_component_1 = require("./mission/mission.component");
var dictionary_service_1 = require("./dictionary/dictionary.service");
var oms_config_1 = require('./oms.config');
var AppComponent = (function () {
    function AppComponent($router, $dic) {
        this.$router = $router;
        this.$dic = $dic;
        this.$dic.search({ "grep": { "Code": "Region" } }).subscribe(function (res) {
            var list = res.json().list;
            list.forEach(function (item) {
                oms_config_1.Oms.Region["zh-CN"][item.Name] = item.TitleCN;
                oms_config_1.Oms.Region["zh-TW"][item.Name] = item.TitleTW;
                oms_config_1.Oms.Region["en-US"][item.Name] = item.TitleEN;
            });
        });
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.html',
            providers: [
                communicate_service_1.CommunicateService,
                dictionary_service_1.DictionaryService
            ],
            directives: [router_1.ROUTER_DIRECTIVES,
            ],
            precompile: [
                formula_box_1.FormulaBoxComponent,
                record_component_1.RecordComponent,
                profile_component_1.ProfileComponent,
                login_component_1.LoginComponent,
                forgot_component_1.ForgotComponent,
                user_component_1.UserComponent,
                mission_component_1.MissionComponent
            ]
        }), 
        __metadata('design:paramtypes', [router_1.Router, dictionary_service_1.DictionaryService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map