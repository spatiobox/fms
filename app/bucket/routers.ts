/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {LoginComponent} from "../auth/components/login.component";
import { BucketComponent} from "./bucket.component";
import {AuthGuard} from "../auth/services/auth.guard";


export const BucketRoutes:any = [
    {
        path: 'bucket',
        name: 'bucket',
        component: BucketComponent,
        canActivate: [AuthGuard]
    }
];
