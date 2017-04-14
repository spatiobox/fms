/**
 * Created by zero on 7/19/16.
 */
import { Component }          from '@angular/core';
import { ROUTER_DIRECTIVES,Router }  from '@angular/router';
import {FormulaComponent} from "./formula.component";
import {MaterialComponent} from "./material.component";
import {RecipeComponent} from "./recipe.component";
import {FilterPipe} from "../pipes/filter.pipe";
import {TranslatePipe} from "../pipes/translate.pipe";
import {HasPipe} from "../pipes/has.pipe";
import { NavbarComponent } from "./navbar.component";
import { NavheaderComponent } from "./navheader.component";
import {CommunicateService} from "../services/communicate.service";


@Component({
    selector: 'my-box',
    templateUrl: 'app/views/formula/formula.box.html',
    directives: [
        ROUTER_DIRECTIVES,
        NavbarComponent,
        NavheaderComponent,
        // RecordComponent,
        FormulaComponent,
        MaterialComponent,
        RecipeComponent
    ],
    pipes: [FilterPipe, TranslatePipe, HasPipe],
    providers: [CommunicateService /*app.services.FormularService, app.services.MaterialService, app.services.RecipeService*/]
})
export class FormulaBoxComponent {
    constructor(router: Router) {
        //router.navigate(['/formula']);
    }

}