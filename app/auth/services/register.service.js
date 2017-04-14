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
var http_1 = require('@angular/http');
var oms_config_1 = require('../../oms.config');
var RegisterService = (function () {
    function RegisterService(http) {
        this.http = http;
        this.url = oms_config_1.Oms.location + '/api/identity';
    }
    RegisterService.prototype.post = function (node) {
        var _url = this.url + '/register';
        var _headers = this.getToken();
        var options = { headers: _headers };
        return this.http.post(_url, JSON.stringify(node), options);
    };
    RegisterService.prototype.check = function (value, category) {
        var _url = this.url + '/check/' + category;
        var _headers = this.getToken();
        var options = { headers: _headers };
        var data = {};
        if (category == "user")
            data.UserName = value;
        else if (category == "phone")
            data.PhoneNumber = value;
        else
            data.Email = value;
        return this.http.post(_url, JSON.stringify(data), options);
    };
    RegisterService.prototype.getToken = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        return headers;
    };
    RegisterService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], RegisterService);
    return RegisterService;
}());
exports.RegisterService = RegisterService;
//# sourceMappingURL=register.service.js.map