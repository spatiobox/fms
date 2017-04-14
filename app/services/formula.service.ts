/**
 * Created by zero on 7/19/16.
 */

import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestMethod, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject, Observable } from 'rxjs/Rx';
import { Xmeta } from '../xmeta.config';

@Injectable()
export class FormulaService {
    //http:Http;
    url: string;

    constructor(private http: Http) {
        //this.http = http;
        this.url = Xmeta.location + '/api/formulars';
        //this.url = './mock/formulars.json';
    }

    all() {
        return this.http.get(this.url, { headers: this.getToken() });
    }

    get(id: any) {
        var _url = this.url + '/' + id;
        let headers = this.getToken();
        headers.append('Content-type', 'application/json');
        return this.http.get(_url, { headers: headers })
    }

    getBy(category: any, id: any, suffix: any = null) {
        var _url = this.url + '/by/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        var headers = this.getToken();
        headers.append('Content-Type', 'application/json')
        return this.http.get(_url, { headers: headers });
    }

    post(node: any) {
        return this.http.post(this.url, JSON.stringify(node), { headers: this.getToken() });
    }

    put(node: any) {
        var _url = this.url + '/{id}'.replace('{id}', node.ID);
        return this.http.put(_url, JSON.stringify(node), { headers: this.getToken() });
    }

    patch(node: any) {
        return this.http.patch(this.url, JSON.stringify(node), { headers: this.getToken() });
    }

    delete(id: any) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    }

    deletes(ids: Array<any>) {
        var _url = this.url + '/batch';
        var opts = new RequestOptions();
        opts.body = JSON.stringify({ guids: ids });
        opts.headers = this.getToken();
        opts.method = RequestMethod.Delete;
        opts.url = _url;
        return this.http.request(new Request(opts));
    }

    download() {
        var _url = this.url + '/download/template';
        var _header = this.getToken();
        // _header.append('responseType', 'application/pdf');
        return this.http.request(_url, { headers: _header }).subscribe((x: any) => {
            var blob = new Blob([x._body], { type: x.headers.get('Content-Type') });
            //saveAs(blob, 'formular.csv');

            var url = window.URL.createObjectURL(blob);
            window.open(url);
        }, err => {
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

    export(doc: any, ids: Array<string>) {
        var _url = Xmeta.location + '/api/recipes/export/' + (doc ? doc : 'pdf') + '?sort=' + JSON.stringify({ "FormularID": "asc", "Sort": "asc" });
        var mime = doc == "pdf" ? 'application/pdf' : 'application/vnd.ms-excel';
        var _header = this.getToken();
        var data = JSON.stringify({ 'guids': ids });
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
                        console.log(xhr);
                        observer.next(new Blob([arr], { 'type': mime }));
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
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(data);
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