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
var Rx_1 = require('rxjs/Rx');
var oms_config_1 = require('../oms.config');
var FormulaService = (function () {
    function FormulaService(http) {
        this.http = http;
        this.url = oms_config_1.Oms.location + '/api/formulars';
    }
    FormulaService.prototype.all = function () {
        return this.http.get(this.url, { headers: this.getToken() });
    };
    FormulaService.prototype.get = function (id) {
        var _url = this.url + '/' + id;
        var headers = this.getToken();
        headers.append('Content-type', 'application/json');
        return this.http.get(_url, { headers: headers });
    };
    FormulaService.prototype.getBy = function (category, id, suffix) {
        if (suffix === void 0) { suffix = null; }
        var _url = this.url + '/by/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        var headers = this.getToken();
        headers.append('Content-Type', 'application/json');
        return this.http.get(_url, { headers: headers });
    };
    FormulaService.prototype.post = function (node) {
        return this.http.post(this.url, JSON.stringify(node), { headers: this.getToken() });
    };
    FormulaService.prototype.put = function (node) {
        var _url = this.url + '/{id}'.replace('{id}', node.ID);
        return this.http.put(_url, JSON.stringify(node), { headers: this.getToken() });
    };
    FormulaService.prototype.patch = function (node) {
        return this.http.patch(this.url, JSON.stringify(node), { headers: this.getToken() });
    };
    FormulaService.prototype.delete = function (id) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    };
    FormulaService.prototype.deletes = function (ids) {
        var _url = this.url + '/batch';
        var opts = new http_1.RequestOptions();
        opts.body = JSON.stringify({ guids: ids });
        opts.headers = this.getToken();
        opts.method = http_1.RequestMethod.Delete;
        opts.url = _url;
        return this.http.request(new http_1.Request(opts));
    };
    FormulaService.prototype.download = function () {
        var _url = this.url + '/download/template';
        var _header = this.getToken();
        return this.http.request(_url, { headers: _header }).subscribe(function (x) {
            var blob = new Blob([x._body], { type: x.headers.get('Content-Type') });
            var url = window.URL.createObjectURL(blob);
            window.open(url);
        }, function (err) {
            alert('download error');
        });
    };
    FormulaService.prototype.import = function (data) {
        var _url = this.url + '/import';
        var _header = this.getToken();
        _header.append('Content-Type', 'multipart/form-data');
        return Rx_1.Observable.create(function (observer) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    }
                    else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            };
            xhr.open('POST', _url, true);
            xhr.setRequestHeader('Authorization', _header.get('Authorization'));
            xhr.send(data);
        });
    };
    FormulaService.prototype.export = function (doc, ids) {
        var _url = oms_config_1.Oms.location + '/api/recipes/export/' + (doc ? doc : 'pdf') + '?sort=' + JSON.stringify({ "FormularID": "asc", "Sort": "asc" });
        var mime = doc == "pdf" ? 'application/pdf' : 'application/vnd.ms-excel';
        var _header = this.getToken();
        var data = JSON.stringify({ 'guids': ids });
        Rx_1.Observable.create(function (observer) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var str = xhr.responseText;
                        var arr = new Uint8Array(str.length);
                        for (var i = 0; i < str.length; ++i) {
                            arr[i] = str.charCodeAt(i);
                        }
                        console.log(xhr);
                        observer.next(new Blob([arr], { 'type': mime }));
                        observer.complete();
                    }
                    else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            };
            xhr.open('POST', _url, true);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.setRequestHeader('Authorization', _header.get('Authorization'));
            xhr.setRequestHeader('Accept-Language', _header.get('Accept-Language'));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(data);
        }).subscribe(function (x) {
            var url = window.URL.createObjectURL(x);
            window.open(url);
        });
    };
    FormulaService.prototype.getToken = function () {
        var lang = localStorage.getItem('language');
        var token = sessionStorage.getItem('id_token');
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + token });
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        return headers;
    };
    FormulaService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], FormulaService);
    return FormulaService;
}());
exports.FormulaService = FormulaService;
//# sourceMappingURL=formula.service.js.map