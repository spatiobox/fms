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
var oms_config_1 = require('../oms.config');
var ConfigService = (function () {
    function ConfigService(http) {
        this.http = http;
        this.url = oms_config_1.Oms.location + '/api/config';
    }
    ConfigService.prototype.all = function () {
        return this.http.get(this.url, { headers: this.getToken() });
    };
    ConfigService.prototype.get = function (id) {
        var _url = this.url + '/' + id;
        return this.http.get(_url, { headers: this.getToken() });
    };
    ConfigService.prototype.getBy = function (category, id) {
        var _url = this.url + '/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.get(_url, { headers: this.getToken() });
    };
    ConfigService.prototype.post = function (node) {
        var _headers = this.getToken();
        var options = { headers: _headers };
        return this.http.post(this.url, JSON.stringify(node), options);
    };
    ConfigService.prototype.put = function (node) {
        var _url = this.url + '/{id}'.replace('{id}', node.Id);
        return this.http.put(_url, JSON.stringify(node), { headers: this.getToken() });
    };
    ConfigService.prototype.unlock = function (node, status) {
        var _url = this.url + '/{id}/unlock/{status}'.replace('{id}', node.Id).replace("{status}", status);
        return this.http.post(_url, {}, { headers: this.getToken() });
    };
    ConfigService.prototype.copy = function (node) {
        var _url = this.url + '/{id}/copy/{uid}'.replace('{id}', node.SourceID).replace('{uid}', node.TargetID);
        return this.http.post(_url, {}, { headers: this.getToken() });
    };
    ConfigService.prototype.patch = function (id, data) {
        var _url = this.url + '/{id}'.replace('{id}', id);
        return this.http.patch(_url, JSON.stringify(data), { headers: this.getToken() });
    };
    ConfigService.prototype.delete = function (id) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    };
    ConfigService.prototype.download = function () {
        var _url = this.url + '/template';
        return this.http.get(_url, { headers: this.getToken() });
    };
    ConfigService.prototype.import = function () {
    };
    ConfigService.prototype.export = function () {
    };
    ConfigService.prototype.getToken = function () {
        var lang = localStorage.getItem('language');
        var token = sessionStorage.getItem('id_token');
        var headers = new http_1.Headers();
        if (token)
            headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        return headers;
    };
    ConfigService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ConfigService);
    return ConfigService;
}());
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map