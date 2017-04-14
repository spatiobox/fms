/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {LoginComponent} from "../auth/components/login.component";
import { DictionaryComponent} from "./dictionary.component";
import {AuthGuard} from "../auth/services/auth.guard";


export const DictionaryRoutes:any = [
    {
        path: 'dictionary',
        name: 'Dictionary',
        component: DictionaryComponent,
        canActivate: [AuthGuard]
    }
];