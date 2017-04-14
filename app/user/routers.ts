/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {LoginComponent} from "../auth/components/login.component";
import {UserComponent} from "./user.component";
import {AuthGuard} from "../auth/services/auth.guard";


export const UserRoutes:any = [
    {
        path: 'user',
        name: 'User',
        component: UserComponent,
        canActivate: [AuthGuard]
    }
];
