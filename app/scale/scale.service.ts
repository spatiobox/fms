/**
 * Created by zero on 7/19/16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestMethod, RequestOptions, URLSearchParams } from '@angular/http';
import { Subject, Observable } from 'rxjs/Rx';
import { Xmeta } from '../xmeta.config';


declare var _: any;

@Injectable()
export class ScaleService {
    url: string;

    constructor(private http: Http) {
        this.url = Xmeta.location + '/api/scales';
        //this.url = './mock/formulars.json';
    }

    all() {
        return this.http.get(this.url, { headers: this.getToken() });
    }

    get(id: any) {
        var _url = this.url + '/' + id;
        return this.http.get(_url, { headers: this.getToken() });
    }

    getBy(category: any, id: any) {
        var _url = this.url + '/{category}/{id}'.replace('{category}', category).replace('{id}', id);
        return this.http.get(_url, { headers: this.getToken() });
    }

    post(node: any) {
        var _headers = this.getToken();
        var options = { headers: _headers };
        return this.http.post(this.url, JSON.stringify(node), options);
    }


    put(node: any) {
        var _url = this.url + '/{id}'.replace('{id}', node.ID);
        return this.http.put(_url, JSON.stringify(node), { headers: this.getToken() });
    }


    copy(node: any) {
        var _url = this.url + '/{id}/copy/{uid}'.replace('{id}', node.SourceID).replace('{uid}', node.TargetID);
        return this.http.post(_url, {}, { headers: this.getToken() });
    }

    mark(node: any, status: number) {
        let data: any = null;

        switch (status) {
            case -1:
                data = { LastHeartbeat: new Date() };
                break;
            case 0:
                data = { LastHeartbeat: '2000-01-01' };
                break;
            case 1:
                data = {
                    MissionDetailID: null,
                    Weight: null,
                    DeviationWeight: null,
                    Status: 1
                };
                break;
            // case 2:
            //     data = { MissionDetailID: null,
            //             Status: 1 };
            //     break;
            // case 4:
            //     (data || (data = {})).Status = 4;
            //     break;
            // case 8:
            //     (data || (data = {})).Status = 8;
            //     break;
            default:
                break;
        }
        if (status != -1) {
            let _url = this.url + '/{id}'.replace('{id}', node.ID);
            return this.http.patch(_url, JSON.stringify(data), { headers: this.getToken() });
        } else {
            let _url = this.url + '/{id}/tasks'.replace('{id}', node.ID);
            return this.http.get(_url, { headers: this.getToken() });
        }
    }

    patch(id: any, data: any) {
        var _url = this.url + '/{id}'.replace('{id}', id);
        return this.http.patch(_url, JSON.stringify(data), { headers: this.getToken() });
    }

    delete(id: any) {
        var _url = this.url + '/' + id;
        return this.http.delete(_url, { headers: this.getToken() });
    }

    deletes(node: any) {
        var _url = this.url + '/batch';
        var opts = new RequestOptions();
        opts.body = JSON.stringify({ ids: node });
        opts.headers = this.getToken();
        opts.method = RequestMethod.Delete;
        opts.url = _url;
        return this.http.request(new Request(opts));
    }

    download() {
        var _url = this.url + '/template';
        return this.http.get(_url, { headers: this.getToken() });
    }

    import(node: any) {

        var _url = this.url + '/import';
        return this.http.get(_url, { headers: this.getToken() });
    }

    export(node: any) {

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