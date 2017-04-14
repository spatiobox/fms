/**
 * Created by zero on 7/19/16.
 */

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject, Observable } from 'rxjs/Rx';
import { Xmeta } from '../../xmeta.config';

declare var _: any;

@Injectable()
export class ProfileService {
    url: string;
    //http:Http

    constructor(private http: Http) {
        this.url = Xmeta.location + '/api/profile';
    }

    all() {
        return this.http.get(this.url, { headers: this.getToken() });
    }

    get() {
        return this.http.get(this.url, { headers: this.getToken() });
    }

    getBy(category: any, id: any) {
        var _url = this.url + '/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.post(_url, { headers: this.getToken() });
    }

    post(node: any) {
        var _url = this.url;
        return this.http.post(_url, JSON.stringify(node), { headers: this.getToken() })
    }

    changePassword(node: any) {
        var _url = Xmeta.location + "/api/identity/changepassword";
        return this.http.post(_url, JSON.stringify(node), { headers: this.getToken() })
    }

    put(node: any) {
        var _url = this.url + '/{id}'.replace('{id}', node.ID);
        return this.http.put(_url, JSON.stringify(node), { headers: this.getToken() });
    }

    patch(node: any) {
        return this.http.patch(this.url, JSON.stringify(node), { headers: this.getToken() });
    }

    current() {
        let profile :any = sessionStorage.getItem("profile");
        if (profile) profile = JSON.parse(profile);
        return profile;
    }

    isAdmin() {
        var profile: any = sessionStorage.getItem("profile");
        if (profile) profile = JSON.parse(profile);
        let list = _.filter(profile.Roles, (item: any) => { 
            return item.Name == 'administrator';
        });
        return list.length > 0;
    }

    delete(id: any) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    }

    download() {
        var _url = this.url + '/download/template';
        var _header = this.getToken();
        _header.append('responseType', 'application/pdf');
        return this.http.request(_url, { headers: _header }).subscribe((x: any) => {
            console.log('download', x);
            var blob = new Blob([x._body], { type: x.headers.get('Content-Type') });
            var url = window.URL.createObjectURL(blob);
            window.open(url);
        }, (error: any) => {
            alert('download error');
        });
    }

    import(data: any) {
        var _url = this.url + '/import';
        var _header = this.getToken();
        _header.append('Content-Type', 'multipart/form-data');
        return Observable.create((observer: any) => {

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            };

            xhr.open('POST', _url, true);
            xhr.setRequestHeader('Authorization', _header.get('Authorization'));
            xhr.send(data);
        });
    }

    export() {
        var _url = this.url + '/export';
        var _header = this.getToken();
        ////_header.append('Accept', 'application/pdf');
        //_header.append('responseType', 'blob');
        ////_header.append('Content-Type', 'text/plain; charset=x-user-defined');
        //return this.http.request(_url, { headers: _header }).subscribe(x=>{
        //        console.log(x);
        //        var list = new Uint8Array(x._body);
        //        var arr = new Uint8Array(list.length);
        //        for(var i = 0; i < list.byteLength; i++){
        //            arr[i] = list.charAt(i) & 0xff;
        //        }
        //        //saveAs(x, 'formular.pdf');
        //        //saveAs(x, 'formular.pdf');
        //        var blob = new Blob([ arr ], { type: x.headers.get('Content-Type') });
        //        //var blob1 = this.auto_bom(blob);
        ////download(x._body, '1.pdf', 'application/pdf');
        //console.log('blob', blob);
        //        var url= window.URL.createObjectURL(blob);
        //        window.open(url);
        //
        //
        //}, err=>{
        //    alert('download error');
        //});
        Observable.create((observer: any) => {

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var str = xhr.responseText;
                        var arr = new Uint8Array(str.length);
                        for (var i = 0; i < str.length; ++i) {
                            arr[i] = str.charCodeAt(i);
                        }
                        observer.next(new Blob([arr], { 'type': 'application/pdf' }));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            };

            xhr.open('GET', _url, true);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.setRequestHeader('Authorization', _header.get('Authorization'));
            xhr.send();
        }).subscribe((x: any) => {
            //var blob = new Blob([ x._body ], { type: x.headers.get('Content-Type') });
            var url = window.URL.createObjectURL(x);
            window.open(url);
        });
    }

    getToken() {
        var lang = localStorage.getItem('language');
        var token = sessionStorage.getItem('id_token');
        var headers = new Headers({ 'Authorization': 'Bearer ' + token });
        //headers.append('Content-type', 'application/json');
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        return headers;
    }
}