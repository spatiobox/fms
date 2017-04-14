/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {LoginComponent} from "../auth/components/login.component";
import {AuthGuard} from "./services/auth.guard";
import {AuthService} from "./services/auth.service";
import {ForgotComponent} from "./components/forgot.component";
import {RegisterComponent} from "./components/register.component";


export const AuthRoutes: any = [
    { path: 'login', name: 'Login', component: LoginComponent },
    { path: 'forgot', name: 'Forgot', component: ForgotComponent },
    { path: 'register', name: 'Register', component: RegisterComponent }
];

export const AuthProviders = [AuthGuard, AuthService];