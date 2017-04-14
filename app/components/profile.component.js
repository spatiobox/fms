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
var translate_pipe_1 = require('../pipes/translate.pipe');
var oms_config_1 = require('../oms.config');
var profile_service_1 = require("../auth/services/profile.service");
var navbar_component_1 = require("./navbar.component");
var navheader_component_1 = require("./navheader.component");
var ProfileComponent = (function () {
    function ProfileComponent($profile) {
        this.$profile = $profile;
        this.models = [];
        this.loading = false;
    }
    ProfileComponent.prototype.filter = function () {
    };
    ProfileComponent.prototype.reset = function (evt) {
        evt.preventDefault();
        if (!this.password || !this.confirmPassword) {
            return;
        }
        if (this.password != this.confirmPassword) {
            alert("两次密码输入不一致");
            return;
        }
        var json = {
            "userName": "123",
            "password": this.password,
            "email": "test@test.t",
            "phonenumber": "test",
            "confirmPassword": this.confirmPassword
        };
        this.$profile.changePassword(json).subscribe(function (res) {
            oms_config_1.Oms.showMsg('success');
        }, function (err) {
            var result = err.json && err.json();
            for (var i in result.ModelState) {
                alert(result.ModelState[i][0]);
            }
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ProfileComponent.prototype, "password", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ProfileComponent.prototype, "confirmPassword", void 0);
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'my-profile',
            templateUrl: 'app/views/system/profile.component.html',
            pipes: [translate_pipe_1.TranslatePipe],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent],
            providers: [profile_service_1.ProfileService]
        }), 
        __metadata('design:paramtypes', [profile_service_1.ProfileService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map