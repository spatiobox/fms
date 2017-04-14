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
var ForgotService = (function () {
    function ForgotService(http) {
        this.http = http;
        this.http = http;
        this.url = oms_config_1.Oms.location + '/api/identity/forgot';
    }
    ForgotService.prototype.post = function (node) {
        return this.http.post(this.url, JSON.stringify(node), { headers: this.getToken() });
    };
    ForgotService.prototype.put = function (node) {
        return this.http.put(this.url, JSON.stringify(node), { headers: this.getToken() });
    };
    ForgotService.prototype.getToken = function () {
        var lang = localStorage.getItem('language');
        var headers = new http_1.Headers();
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        headers.append('Content-Type', 'application/json');
        return headers;
    };
    ForgotService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ForgotService);
    return ForgotService;
}());
exports.ForgotService = ForgotService;
//# sourceMappingURL=forgot.service.js.map