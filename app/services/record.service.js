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
var RecordService = (function () {
    function RecordService(http) {
        this.http = http;
        this.url = oms_config_1.Oms.location + '/api/records';
    }
    RecordService.prototype.all = function () {
        var _url = this.url + '?noPaging=true&sort={recorddate:"desc"}';
        return this.http.get(_url, { headers: this.getToken() });
    };
    RecordService.prototype.get = function (id) {
        var _url = this.url + '/' + id;
        return this.http.get(_url, { headers: this.getToken() });
    };
    RecordService.prototype.getBy = function (category, id) {
        var _url = this.url + '/by/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.get(_url, { headers: this.getToken() });
    };
    RecordService.prototype.getFormulas = function () {
        var _url = this.url + '/with/formulas?suffix=16';
        return this.http.get(_url, { headers: this.getToken() });
    };
    RecordService.prototype.post = function (node) {
        return this.http.post(this.url, node, { headers: this.getToken() });
    };
    RecordService.prototype.put = function (node) {
        return this.http.put(this.url, node, { headers: this.getToken() });
    };
    RecordService.prototype.patch = function (node) {
        return this.http.patch(this.url, node, { headers: this.getToken() });
    };
    RecordService.prototype.search = function (node) {
        var _url = this.url + '/search';
        return this.http.post(_url, JSON.stringify(node), { headers: this.getToken() });
    };
    RecordService.prototype.delete = function (node) {
        var _url = this.url + '/batch';
        var opts = new http_1.RequestOptions();
        opts.body = JSON.stringify({ guids: node });
        opts.headers = this.getToken();
        opts.method = http_1.RequestMethod.Delete;
        opts.url = _url;
        return this.http.request(new http_1.Request(opts));
    };
    RecordService.prototype.download = function () {
        var _url = this.url + '/download/template';
        var _header = this.getToken();
        return this.http.request(_url, { headers: _header }).subscribe(function (x) {
            var blob = new Blob([x._body], { type: x.headers.get('Content-Type') });
            var url = window.URL.createObjectURL(blob);
            window.open(url);
        }, function (error) {
            alert('download error');
        });
    };
    RecordService.prototype.import = function (data) {
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
    RecordService.prototype.export = function (data, doc) {
        var _url = this.url + '/export/' + (doc ? doc : 'pdf');
        var mime = doc == "pdf" ? 'application/pdf' : 'application/vnd.ms-excel';
        var _header = this.getToken();
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
            xhr.send(data);
        }).subscribe(function (x) {
            var url = window.URL.createObjectURL(x);
            window.open(url);
        });
    };
    RecordService.prototype.getToken = function () {
        var lang = localStorage.getItem('language');
        var token = sessionStorage.getItem('id_token');
        var headers = new http_1.Headers();
        if (token)
            headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        return headers;
    };
    RecordService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], RecordService);
    return RecordService;
}());
exports.RecordService = RecordService;
//# sourceMappingURL=record.service.js.map