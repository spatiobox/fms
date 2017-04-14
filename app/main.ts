/**
 * Created by zero on 7/19/16.
 */
/**
 * Created by zero on 7/19/16.
 */
// main entry point
import { bootstrap }          from '@angular/platform-browser-dynamic';
import { provide }          from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { ROUTER_DIRECTIVES }          from '@angular/router';
import { AppRouterProviders } from './app.routes';
import { HTTP_PROVIDERS } from '@angular/http';
import {LoginComponent} from "./auth/components/login.component";
import {AppComponent} from "./app.component";

bootstrap(AppComponent, [
	disableDeprecatedForms(),
	provideForms(),
    AppRouterProviders,
    //Xmeta
    HTTP_PROVIDERS,
    ROUTER_DIRECTIVES
    //Location
    //provide(APP_BASE_HREF, {useValue: '/'})
]).catch(err => console.error(err));


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */