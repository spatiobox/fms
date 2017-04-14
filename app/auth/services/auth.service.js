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
var AuthService = (function () {
    function AuthService($http) {
        this.$http = $http;
        this.http = $http;
        this.url = oms_config_1.Oms.location + '/OAuth/Token';
        this.redirectUrl = '/login';
    }
    AuthService.prototype.isLoggedIn = function () {
        return !!sessionStorage.getItem('id_token');
    };
    AuthService.prototype.all = function () {
        return this.http.get(this.url).subscribe(function (x) {
            if (x.status == 200)
                return x.json();
        });
    };
    AuthService.prototype.get = function (id) {
        var _url = this.url + '/' + id;
        return this.http.get(_url, { headers: this.getToken() });
    };
    AuthService.prototype.getBy = function (category, id) {
        var _url = this.url + '/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.post(_url, { headers: this.getToken() }).subscribe(function (x) {
            if (x.status == 200)
                return Promise.resolve(x.json());
        });
    };
    AuthService.prototype.post = function (node) {
        var _headers = this.getToken();
        var str = '';
        for (var i in node) {
            str += '&' + i + '=' + node[i];
        }
        var options = { headers: _headers };
        return this.http.post(this.url, str, options);
    };
    AuthService.prototype.put = function (node) {
        var _url = this.url + '/{id}'.replace('{id}', node.ID);
        return this.http.put(_url, $.param(node), { headers: this.getToken() }).subscribe(function (x) {
            if (x.status == 200)
                return x.json();
        });
    };
    AuthService.prototype.patch = function (node) {
        return this.http.patch(this.url, JSON.stringify(node), { headers: this.getToken() });
    };
    AuthService.prototype.delete = function (id) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    };
    AuthService.prototype.download = function () {
        var _url = this.url + '/template';
        return this.http.get(_url, { headers: this.getToken() });
    };
    AuthService.prototype.import = function () {
    };
    AuthService.prototype.export = function () {
    };
    AuthService.prototype.getToken = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map