/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {LoginComponent} from "../auth/components/login.component";
import {ConfigComponent} from "./config.component";
import {AuthGuard} from "../auth/services/auth.guard";


export const ConfigRoutes:any = [
    {
        path: 'config',
        name: 'Config',
        component: ConfigComponent,
        canActivate: [AuthGuard]
    }
];
