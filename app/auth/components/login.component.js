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
var filter_pipe_1 = require('../../pipes/filter.pipe');
var translate_pipe_1 = require('../../pipes/translate.pipe');
var has_pipe_1 = require('../../pipes/has.pipe');
var formula_service_1 = require('../../services/formula.service');
var communicate_service_1 = require('../../services/communicate.service');
var oms_config_1 = require('../../oms.config');
var auth_service_1 = require("../services/auth.service");
var profile_service_1 = require("../services/profile.service");
var formula_box_1 = require("../../components/formula.box");
var LoginComponent = (function () {
    function LoginComponent($router, $auth, $profile) {
        var _this = this;
        this.$router = $router;
        this.$auth = $auth;
        this.$profile = $profile;
        this.$profile = $profile;
        this.$router = $router;
        this.message = "";
        if ($auth.isLoggedIn()) {
            this.$profile.get().subscribe(function (res) {
                var _profile = res.json();
                sessionStorage.removeItem('profile');
                sessionStorage.setItem('profile', JSON.stringify(_profile));
                _this.$router.navigate(['/']);
            }, function (error) {
                if (error.status == 401)
                    sessionStorage.clear();
                return;
            });
        }
    }
    LoginComponent.prototype.chooseLanguage = function (lang) {
        this.$profile.post({ language: lang }).subscribe(function (res) {
            localStorage.language = lang;
            location.reload();
        }, function (error) {
            localStorage.language = lang;
            location.reload();
        });
    };
    LoginComponent.prototype.signin = function (evt, username, password) {
        var _this = this;
        evt.preventDefault();
        if (this.loading)
            return;
        this.loading = true;
        this.message = '';
        var param = {
            "grant_type": "password",
            "username": username,
            "password": password
        };
        this.$auth.post(param).subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            sessionStorage.setItem('id_token', _data.access_token);
            _this.$profile.get().subscribe(function (res) {
                var _profile = res.json();
                sessionStorage.setItem('profile', JSON.stringify(_profile));
                _this.$router.navigate(['/']);
            }, function (error) {
                oms_config_1.Oms.showMsg("network error");
                return;
            });
        }, function (error) {
            _this.loading = false;
            if (error.status == 400) {
                var msg = error.json();
                if (msg.error == 'invalid_grant') {
                    oms_config_1.Oms.showMsg(msg.error);
                    return;
                }
                else if (msg.error) {
                    oms_config_1.Oms.showMsg(msg.error_description);
                    return;
                }
            }
            else {
                oms_config_1.Oms.showMsg("login_failed_please_retry");
                return;
            }
        });
        evt.stopPropagation();
    };
    LoginComponent.prototype.signout = function (evt) {
        sessionStorage.removeItem('profile');
        sessionStorage.removeItem('id_token');
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'my-auth',
            templateUrl: 'app/auth/views/login.tmp.html',
            directives: [router_1.ROUTER_DIRECTIVES, formula_box_1.FormulaBoxComponent],
            pipes: [filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe],
            providers: [profile_service_1.ProfileService, formula_service_1.FormulaService, communicate_service_1.CommunicateService]
        }), 
        __metadata('design:paramtypes', [router_1.Router, auth_service_1.AuthService, profile_service_1.ProfileService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map