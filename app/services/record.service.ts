/**
 * Created by zero on 7/19/16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestMethod, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject, Observable } from 'rxjs/Rx';
import { Xmeta } from '../xmeta.config';


declare var _:any;

@Injectable()
export class RecordService {
    http:Http;
    url:string;

    constructor(http:Http) {
        this.http = http;
        this.url = Xmeta.location + '/api/records';
        //this.url = './mock/formulars.json';
    }

    all() {
        var _url = this.url + '?noPaging=true&sort={recorddate:"desc"}'
        return this.http.get(_url, {headers: this.getToken()});
    }

    get(id:any) {
        var _url = this.url + '/' + id;
        return this.http.get(_url, {headers: this.getToken()});
    }

    getBy(category:any, id:any) {
        var _url = this.url + '/by/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.get(_url, {headers: this.getToken()});
    }

    getFormulas(){
        var _url = this.url + '/with/formulas?suffix=16'
        return this.http.get(_url, {headers: this.getToken()});
    }

    post(node:any) {
        return this.http.post(this.url, node, {headers: this.getToken()});
    }

    put(node:any) {
        return this.http.put(this.url, node, {headers: this.getToken()});
    }

    patch(node:any) {
        return this.http.patch(this.url, node, {headers: this.getToken()});
    }

    search(node:any) {
        var _url = this.url + '/search';
        return this.http.post(_url, JSON.stringify(node), {headers: this.getToken()});
    }

    delete(node:any) {
        var _url = this.url + '/batch';
        var opts = new RequestOptions();
        opts.body = JSON.stringify({ guids: node });
        opts.headers = this.getToken();
        opts.method = RequestMethod.Delete;
        opts.url = _url;
        return this.http.request(new Request(opts));
    }

    download() {
        var _url = this.url + '/download/template';
        var _header = this.getToken();
        //_header.append('responseType', 'application/pdf');
        return this.http.request(_url, {headers: _header}).subscribe((x:any)=> {
            var blob = new Blob([x._body], {type: x.headers.get('Content-Type')});
            var url = window.URL.createObjectURL(blob);
            window.open(url);
        }, (error:any)=> {
            alert('download error');
        });
    }

    import(data:any) {
        var _url = this.url + '/import';
        var _header = this.getToken();
        _header.append('Content-Type', 'multipart/form-data');
        return Observable.create((observer:any) => {
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

    export(data:any, doc:any) {
        var _url = this.url + '/export/' + (doc ? doc : 'pdf');
        var mime = doc == "pdf" ? 'application/pdf' : 'application/vnd.ms-excel';
        var _header = this.getToken();
        //return this.http.get(_url, { headers: this.getToken() }).subscribe(x => {
        //        var blob = new Blob([ x._body], { type: 'application/pdf' });
        //        var url= window.URL.createObjectURL(blob);
        //        window.open(url);
        //});
        Observable.create((observer:any) => {

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var str = xhr.responseText;
                        var arr = new Uint8Array(str.length);
                        for (var i = 0; i < str.length; ++i) {
                            arr[i] = str.charCodeAt(i);
                        }
                        observer.next(new Blob([arr], {'type': mime}));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            };

            xhr.open('POST', _url, true);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.setRequestHeader('Authorization', _header.get('Authorization'));
            xhr.setRequestHeader('Accept-Language', _header.get('Accept-Language'));
            xhr.send(data);
        }).subscribe((x:any)=> {
            //var blob = new Blob([ x._body ], { type: x.headers.get('Content-Type') });
            var url = window.URL.createObjectURL(x);
            window.open(url);
        });

    }

    getToken() {
        var lang = localStorage.getItem('language');
        var token = sessionStorage.getItem('id_token');
        var headers = new Headers();
        if (token) headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        return headers;
    }
}