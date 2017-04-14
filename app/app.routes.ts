/**
 * Created by zero on 7/19/16.
 */
import { provideRouter, RouterConfig, RouterOutlet }  from '@angular/router';
import { FormulaRoutes } from '../app/formula/routers'
import { AuthRoutes, AuthProviders } from '../app/auth/routers'
import { UserRoutes } from '../app/user/routers'
import { OrganizationRoutes } from '../app/organization/routers'
import { DictionaryRoutes } from '../app/dictionary/routers'
import { ConfigRoutes } from '../app/config/routers'
import { MissionRoutes } from '../app/mission/routers'
import { ScaleRoutes } from '../app/scale/routers'
import { BucketRoutes } from '../app/bucket/routers'

//import { loginRoutes,
//    authProviders }      from './login.routes';

//import { CanDeactivateGuard } from './interfaces';

//...heroesRoutes,
//...loginRoutes,
//...crisisCenterRoutes
export const routes:RouterConfig =  FormulaRoutes.concat(AuthRoutes)
        .concat(UserRoutes)
        .concat(DictionaryRoutes)
        .concat(OrganizationRoutes)
        .concat(BucketRoutes)
        .concat(ConfigRoutes)
        .concat(MissionRoutes)
        .concat(ScaleRoutes)


export const AppRouterProviders = [
    provideRouter(routes),
    AuthProviders
    //authProviders,
    //CanDeactivateGuard
];


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */