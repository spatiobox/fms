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
var translate_pipe_1 = require('../../pipes/translate.pipe');
var i18n_pipe_1 = require('../../pipes/i18n.pipe');
var oms_config_1 = require('../../oms.config');
var register_service_1 = require("../services/register.service");
var RegisterComponent = (function () {
    function RegisterComponent($router, $register) {
        this.$router = $router;
        this.$register = $register;
    }
    RegisterComponent.prototype.check = function (evt, value, category) {
        var _this = this;
        evt.preventDefault();
        switch (category) {
            case "user":
                this.isUserOk = -1;
                this.$register.check(value, category).subscribe(function (res) {
                    _this.isUserOk = 1;
                }, function (error) {
                    _this.isUserOk = 2;
                });
                break;
            case "phone":
                this.isPhoneOk = -1;
                this.$register.check(value, category).subscribe(function (res) {
                    _this.isPhoneOk = 1;
                }, function (error) {
                    _this.isPhoneOk = 2;
                });
                break;
            case "email":
            default:
                this.isEmailOk = -1;
                this.$register.check(value, category).subscribe(function (res) {
                    _this.isEmailOk = 1;
                }, function (error) {
                    _this.isEmailOk = 2;
                });
                break;
        }
        evt.stopPropagation();
    };
    RegisterComponent.prototype.register = function (evt, user, email, phone, password, confirmPassword, company, department, position, fullname) {
        var _this = this;
        evt.preventDefault();
        if (this.loading)
            return;
        this.message = '';
        if (this.isEmailOk !== 1) {
            oms_config_1.Oms.showMsg("register_exist_email");
            return;
        }
        if (this.isUserOk !== 1) {
            oms_config_1.Oms.showMsg("register_exist_user");
            return;
        }
        if (this.isPhoneOk !== 1) {
            oms_config_1.Oms.showMsg("register_exist_phone");
            return;
        }
        if (password != confirmPassword) {
            oms_config_1.Oms.showMsg("password_confirm_failed");
            return;
        }
        var param = {
            "username": user,
            "email": email,
            "company": company,
            "phoneNumber": phone,
            "password": password,
            "confirmPassword": confirmPassword,
            "department": department,
            "position": position,
            "fullname": fullname
        };
        this.loading = true;
        this.$register.post(param).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("register success");
            location.href = '/login';
        }, function (e) {
            _this.loading = false;
            if (e.status == 400) {
                var msg = e.json();
                if (msg.error == 'invalid_grant') {
                    oms_config_1.Oms.showMsg(msg.error);
                    return;
                }
                else {
                    oms_config_1.Oms.showMsg(msg.Message);
                    return;
                }
            }
            else {
                oms_config_1.Oms.showMsg("register failed , please retry");
                return;
            }
        });
        evt.stopPropagation();
    };
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'my-register',
            templateUrl: 'app/auth/views/register.tmp.html',
            directives: [
                router_1.ROUTER_DIRECTIVES
            ],
            providers: [
                register_service_1.RegisterService
            ],
            pipes: [translate_pipe_1.TranslatePipe, i18n_pipe_1.I18nPipe]
        }), 
        __metadata('design:paramtypes', [router_1.Router, register_service_1.RegisterService])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map