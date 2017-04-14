/**
 * Created by zero on 7/20/16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Xmeta } from '../../xmeta.config'
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";
/**
 * Async modal dialog service
 * DialogService makes this app easier to test by faking this service.
 * TODO: better modal implementation that doesn't use window.confirm
 */
@Injectable()
export class AuthGuard implements CanActivate {
    //url:string;
    //http:Http;

    constructor(private $auth: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.$auth.isLoggedIn()) { return true; }

        // Store the attempted URL for redirecting
        this.$auth.redirectUrl = state.url;

        // Navigate to the login page
        this.router.navigate(['/login']);
        return false;
    }

}