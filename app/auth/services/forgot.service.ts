/**
 * Created by zero on 7/19/16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestMethod, RequestOptions, URLSearchParams } from '@angular/http';
import { Xmeta } from '../../xmeta.config';

declare var $:any;
declare var _:any;

@Injectable()
export class ForgotService {
    url:string;


    constructor(private http:Http) {
        this.http = http;
        this.url = Xmeta.location + '/api/identity/forgot';
        //this.url = './mock/formulars.json';
    }

    post(node:any) {
        return this.http.post(this.url, JSON.stringify(node), {headers: this.getToken()});
    }

    put(node: any){
        return this.http.put(this.url, JSON.stringify(node), {headers: this.getToken()});
    }

    getToken() {
        let lang = localStorage.getItem('language');
        //let token = sessionStorage.getItem('id_token');
        var headers = new Headers();
        //if (token) headers.append('Authorization', 'Bearer ' + token);
        headers.append('Accept-Language', lang ? lang : 'zh-CN');
        headers.append('Content-Type', 'application/json');
        //headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }
}