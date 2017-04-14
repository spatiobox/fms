/**
 * Created by zero on 7/19/16.
 */
/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, OnInit, OnDestroy }          from '@angular/core';
import { Router, RouterConfig, ROUTER_DIRECTIVES }          from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ProfileService } from "../auth/services/profile.service";



declare var _:any;

@Component({
    selector: 'my-nav',
    templateUrl: 'app/views/system/navbar.component.html',
    directives: [
        ROUTER_DIRECTIVES
//                app.directives.OmsRouterOutlet

    ],
    providers: [ProfileService],
    pipes: [TranslatePipe]
})
export class NavbarComponent {
    key:any;
    models:Array<any>;
    loading:boolean;
    select:any;
    el:ElementRef;
    menus:Array<any>;

    constructor(private $profile: ProfileService,private $router: Router/*,  private $routerConfig: RouteConfig*/) {
        //this.$router = $router;
        //this.$profile = $profile;
        this.menus = [];
        let _profile = $profile.current();
        //console.log('profile', _profile);
        // if (!_profile) location.href = '/login';
        if(_profile && _profile.Permissions){
            // var arr = _.map(_profile.Permissions, function (item:any, index:any) {
            //    return {
            //        path: item.Url,
            //        name: item.Controller,
            //        component: item.Code.replace('formular', 'formula').replace('Formular', 'Formula'),
            //        useAsDefault: item.IsDefault
            //    };
            // });
            this.menus = _.filter(_profile.Permissions, function (item:any) {
                return item.IsNav;
            });

        }
        //arr.push({
        //    path: "/**",
        //    //name: "root",
        //    redirectTo: ["Formula"]
        //});
        ////$router.router.config(arr);
        //$router.resetConfig(arr);
    }

    navigate(url:any) {
        this.$router.navigate([url]);
    }

    focus(e:any) {
        this.select = e.target;
    }


}