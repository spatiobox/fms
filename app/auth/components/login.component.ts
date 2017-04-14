/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef,ViewEncapsulation }        from '@angular/core';
import { ROUTER_DIRECTIVES, Router }    from '@angular/router';
import { FilterPipe } from '../../pipes/filter.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { HasPipe } from '../../pipes/has.pipe';
import { FormulaService } from '../../services/formula.service';
import { CommunicateService } from '../../services/communicate.service';
import { Xmeta } from '../../xmeta.config';
import { AuthService } from "../services/auth.service";
import {ProfileService} from "../services/profile.service";
import {FormulaBoxComponent} from "../../components/formula.box";

declare var _:any;
declare var localStorage:any;

@Component({
    selector: 'my-auth',
    templateUrl: 'app/auth/views/login.tmp.html',
    directives: [ ROUTER_DIRECTIVES, FormulaBoxComponent ],
    pipes: [FilterPipe, TranslatePipe, HasPipe],
    providers: [ProfileService, FormulaService, CommunicateService]
})
export class LoginComponent {
    message:string;
    loading:boolean;

    constructor(private $router:Router, private $auth:AuthService, private $profile:ProfileService) {
        this.$profile = $profile;
        this.$router = $router;
        //this.model = new app.models.Dot();
        this.message = "";
        if($auth.isLoggedIn()){
            this.$profile.get().subscribe((res:any) => {
                var _profile = res.json();
                sessionStorage.removeItem('profile');
                sessionStorage.setItem('profile', JSON.stringify(_profile));
                this.$router.navigate([ '/' ]);
            }, (error:any) => {
                //Xmeta.showMsg("network error");
                if(error.status == 401) sessionStorage.clear();
                return;
            });
        }

    }

    chooseLanguage(lang:any) {
        this.$profile.post({ language: lang}).subscribe((res:any)=>{ 
            localStorage.language = lang;
            location.reload();
        }, (error) =>{
            localStorage.language = lang;
            location.reload();
        });
    }

    signin(evt:any, username:any, password:any) {
        evt.preventDefault();
        if (this.loading) return;
        this.loading = true;
        this.message = '';
//                    var _url =  app.location + '/OAuth/Token';

        var param = {
            "grant_type": "password",
            "username": username,
            "password": password
        };

        this.$auth.post(param).subscribe(res => {
            this.loading = false;
            let _data = res.json();
            sessionStorage.setItem('id_token', _data.access_token);

            this.$profile.get().subscribe((res:any) => {
                var _profile = res.json();
                sessionStorage.setItem('profile', JSON.stringify(_profile));
                this.$router.navigate([ '/' ]);
            }, (error:any) => {
                Xmeta.showMsg("network error");
                return;
            });

        }, (error:any)=> {
            this.loading = false;
            if (error.status == 400) {
                var msg = error.json();
                if (msg.error == 'invalid_grant') {
                    //this.message = msg.error;
                    Xmeta.showMsg(msg.error);
                    return;
                }else if(msg.error){
                    Xmeta.showMsg(msg.error_description);
                    return;
                }
            } else {
                // alert("login_failed_please_retry!");
                Xmeta.showMsg("login_failed_please_retry")
                return;
            }
        });
        evt.stopPropagation();
    }
    signout(evt:any){
        sessionStorage.removeItem('profile');
        sessionStorage.removeItem('id_token');
    }
}