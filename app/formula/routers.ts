/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {FormulaBoxComponent} from "../components/formula.box";
import {RecordComponent} from "../components/record.component";
import {LoginComponent} from "../auth/components/login.component";
import {AuthGuard} from "../auth/services/auth.guard";
import {ProfileComponent} from "../components/profile.component";
import {NavheaderComponent} from "../components/navheader.component";
import {FormulaComponent} from "../components/formula.component";
import {NavbarComponent} from "../components/navbar.component";

export const FormulaRoutes:any = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/record'
    },
    {
        path: 'formula',
        component: FormulaBoxComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'record',
        component: RecordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    }
];
