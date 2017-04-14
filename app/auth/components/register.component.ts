/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef,ViewEncapsulation }        from '@angular/core';
import { ROUTER_DIRECTIVES, Router }    from '@angular/router';
import { FilterPipe } from '../../pipes/filter.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nPipe } from '../../pipes/i18n.pipe';
import { HasPipe } from '../../pipes/has.pipe';
import { FormulaService } from '../../services/formula.service';
import { CommunicateService } from '../../services/communicate.service';
import { Xmeta } from '../../xmeta.config';
import { AuthService } from "../services/auth.service.ts";
import { ProfileService } from "../services/profile.service";
import { FormulaBoxComponent } from "../../components/formula.box";
import {RegisterService} from "../services/register.service";

declare var _:any;
declare var localStorage:any;

@Component({
    selector: 'my-register',
    templateUrl: 'app/auth/views/register.tmp.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        RegisterService
    ],
    pipes: [TranslatePipe, I18nPipe]
})
export class RegisterComponent {
    message:string;
    loading:boolean;
    isEmailOk:number;
    isUserOk:number;
    isPhoneOk:number;

    constructor(private $router:Router, private $register:RegisterService) {

    }

    check(evt: any, value: string, category: string){
        evt.preventDefault();
        switch (category) {
            case "user":
                this.isUserOk = -1;
                        // code...
                this.$register.check(value, category).subscribe((res:any)=> {
                        this.isUserOk = 1;
                }, (error:any)=> {
                        this.isUserOk = 2;
                });
                break;
            case "phone":
                this.isPhoneOk = -1;
                        // code...
                this.$register.check(value, category).subscribe((res:any)=> {
                        this.isPhoneOk = 1;
                }, (error:any)=> {
                        this.isPhoneOk = 2;
                });
                break;
            case "email":
            default:
                this.isEmailOk = -1;
                this.$register.check(value, category).subscribe((res:any)=> {
                        this.isEmailOk = 1;
                }, (error:any)=> {
                        this.isEmailOk = 2;
                });
                // code...
                break;
        }

        evt.stopPropagation();
    }

    register(evt:any, user:string, email:string, phone:string, password:string, confirmPassword:string, company:string, department: string, position: string, fullname: string) {
        evt.preventDefault();
        if (this.loading) return;
        this.message = '';

        if(this.isEmailOk !== 1){
            Xmeta.showMsg("register_exist_email");
            return;
        }
        if(this.isUserOk !== 1){
            Xmeta.showMsg("register_exist_user");
            return;
        }
        if(this.isPhoneOk !== 1){
            Xmeta.showMsg("register_exist_phone");
            return;
        }

        if (password != confirmPassword) {
            Xmeta.showMsg("password_confirm_failed");
            return;

        }


        var param = {
            "username": user,
            "email": email,
            "company": company,
            "phoneNumber": phone,
            "password": password,
            "confirmPassword": confirmPassword,
            "department": department,
            "position": position,
            "fullname": fullname
        };
        this.loading = true;
        this.$register.post(param).subscribe((res:any)=> {
            this.loading = false;
            Xmeta.showMsg("register success");
            location.href = '/login';
        }, (e:any)=> {
            this.loading = false;
            if (e.status == 400) {
                var msg = e.json();
                if (msg.error == 'invalid_grant') {
                    //this.message = msg.error;
                    Xmeta.showMsg(msg.error);
                    return;
                }else{
                    Xmeta.showMsg(msg.Message);
                    return;
                }
            } else {
                Xmeta.showMsg("register failed , please retry");
                return;
            }
        });
        evt.stopPropagation();
    }

}