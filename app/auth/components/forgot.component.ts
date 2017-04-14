/**
 * Created by zero on 7/20/16.
 */
/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef }        from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute, RouterState }    from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { HasPipe } from '../../pipes/has.pipe';
import { Xmeta } from '../../xmeta.config';
import { AuthService } from "../services/auth.service";
import { ForgotService} from "../services/forgot.service";

declare var _:any;
declare var localStorage:any;

@Component({
    selector: 'my-forgot',
    templateUrl: 'app/auth/views/forgot.tmp.html',
    directives: [ROUTER_DIRECTIVES],
    pipes: [TranslatePipe, HasPipe],
    providers: [ForgotService]
})
export class ForgotComponent {
    message:string;
    loading:boolean;
    params:any;
    email:string;
    token:string;
    success:string;
    userid:string;

    constructor(private $router:Router, private $auth:AuthService, private $forgot:ForgotService) {
        this.message = "";

        this.params = $router.routerState.queryParams.subscribe((param:any)=> {
            if (param.token) this.token = param.token;
            if (param.uid) this.userid = param.uid;

        });
        //console.info(this.email);
        console.info(this.token);
        //console.info(this.params);

    }

    forgot(evt:any, email:string) {
        evt.preventDefault();
        this.message = '';

        var param = {
            "email": email
        };
        this.loading = true;
        this.$forgot.post(param).subscribe((res:any)=> {
            this.loading = false;
            this.success = 'send success';
            //console.log(param);
        }, (error:any)=> {
            this.loading = false;
            if (error.status == 400) {
                var msg = error.json();
                if (msg.error == 'invalid_grant') {
                    //this.message = msg.error;
                    Xmeta.showMsg(msg.error);
                    return;
                } else {
                    this.message = 'send failed';
                }
            } else {
                this.message = 'send failed';
                return;
            }
        });
        evt.stopPropagation();
    }

    reset(evt:any, password:string, confirmPassword: string) {
        evt.preventDefault();
        this.message = '';

        if(password != confirmPassword){
            this.message = 'password error';
            return;
        }

        var param = {
            "password": password,
            "token": this.token,
            "userid": this.userid
        };
        this.loading = true;
        this.$forgot.put(param).subscribe((res:any)=> {
            this.loading = false;
            this.success = 'reset success';
            Xmeta.showMsg('reset success');
            this.$router.navigate(['/login']);
            //console.log(param);
        }, (error:any)=> {
            this.loading = false;
            if (error.status == 400) {
                var msg = error.json();
                if (msg.error == 'invalid_grant') {
                    //this.message = msg.error;
                    Xmeta.showMsg(msg.error);
                    return;
                } else {
                    this.message = 'reset failed';
                }
            } else {
                this.message = 'reset failed';
                return;
            }
        });
        evt.stopPropagation();

    }
}