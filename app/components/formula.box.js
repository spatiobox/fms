"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var formula_component_1 = require("./formula.component");
var material_component_1 = require("./material.component");
var recipe_component_1 = require("./recipe.component");
var filter_pipe_1 = require("../pipes/filter.pipe");
var translate_pipe_1 = require("../pipes/translate.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("./navbar.component");
var navheader_component_1 = require("./navheader.component");
var communicate_service_1 = require("../services/communicate.service");
var FormulaBoxComponent = (function () {
    function FormulaBoxComponent(router) {
    }
    FormulaBoxComponent = __decorate([
        core_1.Component({
            selector: 'my-box',
            templateUrl: 'app/views/formula/formula.box.html',
            directives: [
                router_1.ROUTER_DIRECTIVES,
                navbar_component_1.NavbarComponent,
                navheader_component_1.NavheaderComponent,
                formula_component_1.FormulaComponent,
                material_component_1.MaterialComponent,
                recipe_component_1.RecipeComponent
            ],
            pipes: [filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe],
            providers: [communicate_service_1.CommunicateService]
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], FormulaBoxComponent);
    return FormulaBoxComponent;
}());
exports.FormulaBoxComponent = FormulaBoxComponent;
//# sourceMappingURL=formula.box.js.map