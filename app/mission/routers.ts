/**
 * Created by zero on 7/19/16.
 */
import { RouterConfig, Router }          from '@angular/router';
import {AuthGuard} from "../auth/services/auth.guard";
import { MissionComponent} from "./mission.component";

export const MissionRoutes:any = [
    {
        path: 'mission',
        component: MissionComponent,
        canActivate: [AuthGuard]
    }
];
