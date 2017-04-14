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
var MissionService = (function () {
    function MissionService(http) {
        this.http = http;
        this.url = oms_config_1.Oms.location + '/api/missions';
    }
    MissionService.prototype.all = function (suffix) {
        var _url = this.url + (suffix ? ('?suffix=' + suffix) : suffix);
        return this.http.get(_url, { headers: this.getToken() });
    };
    MissionService.prototype.get = function (id) {
        var _url = this.url + '/' + id;
        return this.http.get(_url, { headers: this.getToken() });
    };
    MissionService.prototype.getTaskRecord = function (id) {
        var _url = this.url + '/' + id + '/record';
        return this.http.get(_url, { headers: this.getToken() });
    };
    MissionService.prototype.getBy = function (category, id) {
        var _url = this.url + '/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.get(_url, { headers: this.getToken() });
    };
    MissionService.prototype.post = function (node) {
        var _headers = this.getToken();
        var options = { headers: _headers };
        return this.http.post(this.url, JSON.stringify(node), options);
    };
    MissionService.prototype.put = function (node) {
        var _url = this.url + '/{id}'.replace('{id}', node.ID);
        return this.http.put(_url, JSON.stringify(node), { headers: this.getToken() });
    };
    MissionService.prototype.copy = function (node) {
        var _url = this.url + '/{id}/copy/{uid}'.replace('{id}', node.SourceID).replace('{uid}', node.TargetID);
        return this.http.post(_url, {}, { headers: this.getToken() });
    };
    MissionService.prototype.patch = function (id, data) {
        var _url = this.url + '/{id}'.replace('{id}', id);
        return this.http.patch(_url, JSON.stringify(data), { headers: this.getToken() });
    };
    MissionService.prototype.dispatch = function (task) {
        var _url = this.url + '/{id}/dispatch'.replace('{id}', task.ID);
        return this.http.post(_url, JSON.stringify(task), { headers: this.getToken() });
    };
    MissionService.prototype.spy = function (taskDetailID, scales) {
        var _url = this.url + '/{id}/spy'.replace('{id}', taskDetailID);
        return this.http.post(_url, JSON.stringify({ guids: scales }), { headers: this.getToken() });
    };
    MissionService.prototype.delete = function (id) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    };
    MissionService.prototype.deletes = function (node) {
        var _url = this.url + '/batch';
        var opts = new http_1.RequestOptions();
        opts.body = JSON.stringify({ ids: node });
        opts.headers = this.getToken();
        opts.method = http_1.RequestMethod.Delete;
        opts.url = _url;
        return this.http.request(new http_1.Request(opts));
    };
    MissionService.prototype.download = function () {
        var _url = this.url + '/template';
        return this.http.get(_url, { headers: this.getToken() });
    };
    MissionService.prototype.import = function (node) {
        var _url = this.url + '/import';
        return this.http.get(_url, { headers: this.getToken() });
    };
    MissionService.prototype.export = function (node) {
    };
    MissionService.prototype.getToken = function () {
        var lang = localStorage.getItem('language');
        var token = sessionStorage.getItem('id_token');
        var headers = new http_1.Headers();
        if (token)
            headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        return headers;
    };
    MissionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MissionService);
    return MissionService;
}());
exports.MissionService = MissionService;
//# sourceMappingURL=mission.service.js.map