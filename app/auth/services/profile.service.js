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
var oms_config_1 = require('../../oms.config');
var ProfileService = (function () {
    function ProfileService(http) {
        this.http = http;
        this.url = oms_config_1.Oms.location + '/api/profile';
    }
    ProfileService.prototype.all = function () {
        return this.http.get(this.url, { headers: this.getToken() });
    };
    ProfileService.prototype.get = function () {
        return this.http.get(this.url, { headers: this.getToken() });
    };
    ProfileService.prototype.getBy = function (category, id) {
        var _url = this.url + '/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.post(_url, { headers: this.getToken() });
    };
    ProfileService.prototype.post = function (node) {
        var _url = this.url;
        return this.http.post(_url, JSON.stringify(node), { headers: this.getToken() });
    };
    ProfileService.prototype.changePassword = function (node) {
        var _url = oms_config_1.Oms.location + "/api/identity/changepassword";
        return this.http.post(_url, JSON.stringify(node), { headers: this.getToken() });
    };
    ProfileService.prototype.put = function (node) {
        var _url = this.url + '/{id}'.replace('{id}', node.ID);
        return this.http.put(_url, JSON.stringify(node), { headers: this.getToken() });
    };
    ProfileService.prototype.patch = function (node) {
        return this.http.patch(this.url, JSON.stringify(node), { headers: this.getToken() });
    };
    ProfileService.prototype.current = function () {
        var profile = sessionStorage.getItem("profile");
        if (profile)
            profile = JSON.parse(profile);
        return profile;
    };
    ProfileService.prototype.isAdmin = function () {
        var profile = sessionStorage.getItem("profile");
        if (profile)
            profile = JSON.parse(profile);
        var list = _.filter(profile.Roles, function (item) {
            return item.Name == 'administrator';
        });
        return list.length > 0;
    };
    ProfileService.prototype.delete = function (id) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    };
    ProfileService.prototype.download = function () {
        var _url = this.url + '/download/template';
        var _header = this.getToken();
        _header.append('responseType', 'application/pdf');
        return this.http.request(_url, { headers: _header }).subscribe(function (x) {
            console.log('download', x);
            var blob = new Blob([x._body], { type: x.headers.get('Content-Type') });
            var url = window.URL.createObjectURL(blob);
            window.open(url);
        }, function (error) {
            alert('download error');
        });
    };
    ProfileService.prototype.import = function (data) {
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
    ProfileService.prototype.export = function () {
        var _url = this.url + '/export';
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
                        observer.next(new Blob([arr], { 'type': 'application/pdf' }));
                        observer.complete();
                    }
                    else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            };
            xhr.open('GET', _url, true);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.setRequestHeader('Authorization', _header.get('Authorization'));
            xhr.send();
        }).subscribe(function (x) {
            var url = window.URL.createObjectURL(x);
            window.open(url);
        });
    };
    ProfileService.prototype.getToken = function () {
        var lang = localStorage.getItem('language');
        var token = sessionStorage.getItem('id_token');
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + token });
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        return headers;
    };
    ProfileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map