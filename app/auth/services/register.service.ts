/**
 * Created by zero on 7/19/16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestMethod, RequestOptions, URLSearchParams } from '@angular/http';
import { Xmeta } from '../../xmeta.config';


declare var _:any;

@Injectable()
export class RegisterService {
    url:string;


    constructor(private http:Http) {
        this.url = Xmeta.location + '/api/identity';
        //this.url = './mock/formulars.json';
    }


    post(node:any) {
        var _url = this.url + '/register';
        var _headers = this.getToken();

        var options = {headers: _headers};
        return this.http.post(_url, JSON.stringify(node), options);
    }

    check(value:any, category:any){
        var _url = this.url + '/check/' + category;
        var _headers = this.getToken();

        var options = {headers: _headers};
        var data :any = {};
        if(category == "user") data.UserName = value;
        else if(category == "phone") data.PhoneNumber = value;
        else data.Email = value;
        return this.http.post(_url, JSON.stringify(data), options);

    }



    getToken() {
        //var token = sessionStorage.getItem('id_token');
        var headers = new Headers();
        //headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        //if(token) headers.append('Authorization', 'Bearer '+token);
        return headers;
    }
}