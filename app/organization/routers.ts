/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {LoginComponent} from "../auth/components/login.component";
import { OrganizationComponent} from "./organization.component";
import {AuthGuard} from "../auth/services/auth.guard";


export const OrganizationRoutes:any = [
    {
        path: 'organization',
        name: 'Organization',
        component: OrganizationComponent,
        canActivate: [AuthGuard]
    }
];
