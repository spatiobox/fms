/**
 * Created by zero on 7/19/16.
 */
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router }  from '@angular/router';
import {RecordComponent} from "./components/record.component";
import {NavheaderComponent} from "./components/navheader.component";
import {NavbarComponent} from "./components/navbar.component";
import {FormulaBoxComponent} from "./components/formula.box";
import {ProfileComponent} from "./components/profile.component";
import {CommunicateService} from "./services/communicate.service";
import {TranslatePipe} from "./pipes/translate.pipe";
import {LoginComponent} from "./auth/components/login.component";
import {ForgotComponent} from "./auth/components/forgot.component";
import {UserComponent} from "./user/user.component";
import { MissionComponent } from "./mission/mission.component";
import { DictionaryService } from "./dictionary/dictionary.service";
import { Xmeta } from './xmeta.config';



@Component({
    selector: 'my-app',
    templateUrl: 'app/app.html',
    providers: [
        CommunicateService,
        DictionaryService
    ],
    directives: [ROUTER_DIRECTIVES,
        //OmsRouterOutlet,
        //app.directives.NumberDirective,
        // FormulaBoxComponent,
        // RecordComponent,
        //UserFormComponent,
        // NavheaderComponent,
        // NavbarComponent,
        // ProfileComponent//,
        //LoginComponent
    ],
    //pipes: [ TranslatePipe ]
    precompile: [
        FormulaBoxComponent,
        RecordComponent,
        ProfileComponent,
        LoginComponent,
        ForgotComponent,
        UserComponent,
        MissionComponent


        // RecordComponent,
        // NavbarComponent,
        // NavheaderComponent
    ]
})
export class AppComponent {
    constructor(private $router: Router, private $dic: DictionaryService) {
        //$router.navigate(['/login']);
        this.$dic.search({ "grep": { "Code": "Region" } }).subscribe((res: any) => {
            let list = res.json().list;
            list.forEach((item: any) => {
                Xmeta.Region["zh-CN"][item.Name] = item.TitleCN;
                Xmeta.Region["zh-TW"][item.Name] = item.TitleTW;
                Xmeta.Region["en-US"][item.Name] = item.TitleEN;
            });
        });
    }

}
