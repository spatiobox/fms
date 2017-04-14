/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, OnInit, OnDestroy,Input } from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { Xmeta } from '../xmeta.config';
import {ProfileService} from "../auth/services/profile.service";
import { NavbarComponent } from "./navbar.component"
import { NavheaderComponent } from "./navheader.component"
//import { NumberDirective } from 'app/directives/communicate.service';

declare var _:any;
declare var $:any;

@Component({
    selector: 'my-profile',
    templateUrl: 'app/views/system/profile.component.html',
    pipes: [TranslatePipe],
    directives: [ NavbarComponent, NavheaderComponent ],
    providers: [ProfileService]
})
export class ProfileComponent {
    key:any;
    models:Array<any>;
    loading:boolean;
    selected:any;
    el:any;
    formula:any;

    @Input()
    password:string;

    @Input()
    confirmPassword:string;

    constructor(private $profile:ProfileService) {
        this.models = [];
        this.loading = false;
        //this.$profile.all().then(json => { this.loading = false; this.models = json.list; }, error => {
        //    this.loading = false;
        //    if(error.status==401) location.href='/login.html';
        //});
    }

    filter() {

    }

    reset(evt:any) {
        evt.preventDefault();
        if (!this.password || !this.confirmPassword) {

            return;
        }
        if (this.password != this.confirmPassword) {
            alert("两次密码输入不一致");
            return;
        }
        var json = {
            "userName": "123",
            "password": this.password,
            "email": "test@test.t",
            "phonenumber": "test",
            "confirmPassword": this.confirmPassword
        }
        this.$profile.changePassword(json).subscribe((res:any)=> {
            Xmeta.showMsg('success');
        }, (err:any)=> {
            var result = err.json && err.json();
            for (var i in result.ModelState) {
                alert(result.ModelState[i][0]);
            }
        });

    }



}