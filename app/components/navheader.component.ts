/**
 * Created by zero on 7/19/16.
 */
/**
 * Created by zero on 7/19/16.
 */
/**
 * Created by zero on 7/19/16.
 */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ProfileService } from "../auth/services/profile.service";
import { Xmeta } from '../xmeta.config'


declare var _: any;
declare var localStorage: any;

@Component({
    selector: 'my-header',
    templateUrl: 'app/views/system/navheader.component.html',
    pipes: [TranslatePipe],
    directives: [ROUTER_DIRECTIVES],
    providers: [ProfileService]
})
export class NavheaderComponent {
    key: any;
    models: Array<any>;
    loading: boolean;
    select: any;
    public lang: string;
    public name: string;


    constructor(private $profile: ProfileService) {
        this.lang = Xmeta.lang;
        let _profile: any = $profile.current();
        this.name = _profile.User.FullName;
        //this.model = new app.models.Dot();
    }

    signout(evt: any) {
        sessionStorage.clear();
        location.href = '/login';
    }

    chooseLanguage(lang: any) {
        this.$profile.post({ language: lang }).subscribe((res: any) => {
            localStorage.language = lang;
            location.reload();
        }, (error) => {
            localStorage.language = lang;
            location.reload();
        });
    }

    focus(e: any) {
        this.select = e.target;
    }


}