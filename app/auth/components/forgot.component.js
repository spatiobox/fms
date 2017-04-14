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
var has_pipe_1 = require('../../pipes/has.pipe');
var oms_config_1 = require('../../oms.config');
var auth_service_1 = require("../services/auth.service");
var forgot_service_1 = require("../services/forgot.service");
var ForgotComponent = (function () {
    function ForgotComponent($router, $auth, $forgot) {
        var _this = this;
        this.$router = $router;
        this.$auth = $auth;
        this.$forgot = $forgot;
        this.message = "";
        this.params = $router.routerState.queryParams.subscribe(function (param) {
            if (param.token)
                _this.token = param.token;
            if (param.uid)
                _this.userid = param.uid;
        });
        console.info(this.token);
    }
    ForgotComponent.prototype.forgot = function (evt, email) {
        var _this = this;
        evt.preventDefault();
        this.message = '';
        var param = {
            "email": email
        };
        this.loading = true;
        this.$forgot.post(param).subscribe(function (res) {
            _this.loading = false;
            _this.success = 'send success';
        }, function (error) {
            _this.loading = false;
            if (error.status == 400) {
                var msg = error.json();
                if (msg.error == 'invalid_grant') {
                    oms_config_1.Oms.showMsg(msg.error);
                    return;
                }
                else {
                    _this.message = 'send failed';
                }
            }
            else {
                _this.message = 'send failed';
                return;
            }
        });
        evt.stopPropagation();
    };
    ForgotComponent.prototype.reset = function (evt, password, confirmPassword) {
        var _this = this;
        evt.preventDefault();
        this.message = '';
        if (password != confirmPassword) {
            this.message = 'password error';
            return;
        }
        var param = {
            "password": password,
            "token": this.token,
            "userid": this.userid
        };
        this.loading = true;
        this.$forgot.put(param).subscribe(function (res) {
            _this.loading = false;
            _this.success = 'reset success';
            oms_config_1.Oms.showMsg('reset success');
            _this.$router.navigate(['/login']);
        }, function (error) {
            _this.loading = false;
            if (error.status == 400) {
                var msg = error.json();
                if (msg.error == 'invalid_grant') {
                    oms_config_1.Oms.showMsg(msg.error);
                    return;
                }
                else {
                    _this.message = 'reset failed';
                }
            }
            else {
                _this.message = 'reset failed';
                return;
            }
        });
        evt.stopPropagation();
    };
    ForgotComponent = __decorate([
        core_1.Component({
            selector: 'my-forgot',
            templateUrl: 'app/auth/views/forgot.tmp.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            pipes: [translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe],
            providers: [forgot_service_1.ForgotService]
        }), 
        __metadata('design:paramtypes', [router_1.Router, auth_service_1.AuthService, forgot_service_1.ForgotService])
    ], ForgotComponent);
    return ForgotComponent;
}());
exports.ForgotComponent = ForgotComponent;
//# sourceMappingURL=forgot.component.js.map