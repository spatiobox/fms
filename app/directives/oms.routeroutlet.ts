///<reference path="../../node_modules/@angular/router/src/directives/router_outlet.d.ts"/>
import { Directive , ElementRef, DynamicComponentLoader, ResolvedReflectiveProvider,ComponentFactoryResolver} from '@angular/core';
import {RouterOutlet, Router, ActivatedRoute, RouterOutletMap } from "@angular/router";
import { Location} from "@angular/common";
/**
 * Created by zero on 7/19/16.
 */


@Directive({
    selector: 'my-app1'
})
export class OmsRouterOutlet{
    publicRoutes:any;
    private location: Location;
    private componentFactoryResolver: ComponentFactoryResolver;
    private activated :any;
    private _activatedRoute: ActivatedRoute;
    outletMap: RouterOutletMap;
    isActivated: boolean;
    component: Object;
    activatedRoute: ActivatedRoute;
    //private location: Location;

    constructor(private el:ElementRef, private loader:DynamicComponentLoader, private router: Router,location: Location) {
        this.publicRoutes = {
            //'signin': true,
            //'signup': true
        };
        this.location = location;
        //RouterOutlet.call(this, el, loader, router, location);
    }

    //change(e:any) {
    //
    //    if (!isNaN(Number(this.el.value))) {
    //        this.el.value = parseFloat(Number(this.el.value).toFixed(4));
    //    }
    //
    //}


    validate(key:any) {
        console.log(key);
        return {"custom": true};
    }
    deactivate(){}

    activate(activatedRoute: ActivatedRoute, providers: ResolvedReflectiveProvider[], outletMap: RouterOutletMap){

        //var url = instruction.urlPath;
        if (!sessionStorage.getItem('id_token')) {
            // todo: redirect to Login, may be there a better way?
            //console.log('here')
            //console.log(this.parentRouter);
            //location.href = '/login.html';
            //this.parentRouter.navigateByUrl('/signin');
            this.router.navigate(['Login']);
        }
        //return RouterOutlet.prototype.activate.call(this, instruction);
    }

}