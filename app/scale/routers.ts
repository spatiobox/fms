/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {AuthGuard} from "../auth/services/auth.guard";
import { ScaleComponent} from "./scale.component";

export const ScaleRoutes:any = [
    {
        path: 'scale',
        component: ScaleComponent,
        canActivate: [AuthGuard]
    }
];
