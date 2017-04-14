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
var translate_pipe_1 = require('../pipes/translate.pipe');
var profile_service_1 = require("../auth/services/profile.service");
var oms_config_1 = require('../oms.config');
var NavheaderComponent = (function () {
    function NavheaderComponent($profile) {
        this.$profile = $profile;
        this.lang = oms_config_1.Oms.lang;
        var _profile = $profile.current();
        this.name = _profile.User.FullName;
    }
    NavheaderComponent.prototype.signout = function (evt) {
        sessionStorage.clear();
        location.href = '/login';
    };
    NavheaderComponent.prototype.chooseLanguage = function (lang) {
        this.$profile.post({ language: lang }).subscribe(function (res) {
            localStorage.language = lang;
            location.reload();
        }, function (error) {
            localStorage.language = lang;
            location.reload();
        });
    };
    NavheaderComponent.prototype.focus = function (e) {
        this.select = e.target;
    };
    NavheaderComponent = __decorate([
        core_1.Component({
            selector: 'my-header',
            templateUrl: 'app/views/system/navheader.component.html',
            pipes: [translate_pipe_1.TranslatePipe],
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [profile_service_1.ProfileService]
        }), 
        __metadata('design:paramtypes', [profile_service_1.ProfileService])
    ], NavheaderComponent);
    return NavheaderComponent;
}());
exports.NavheaderComponent = NavheaderComponent;
//# sourceMappingURL=navheader.component.js.map