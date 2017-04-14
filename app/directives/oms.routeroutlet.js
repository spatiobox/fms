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
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var OmsRouterOutlet = (function () {
    function OmsRouterOutlet(el, loader, router, location) {
        this.el = el;
        this.loader = loader;
        this.router = router;
        this.publicRoutes = {};
        this.location = location;
    }
    OmsRouterOutlet.prototype.validate = function (key) {
        console.log(key);
        return { "custom": true };
    };
    OmsRouterOutlet.prototype.deactivate = function () { };
    OmsRouterOutlet.prototype.activate = function (activatedRoute, providers, outletMap) {
        if (!sessionStorage.getItem('id_token')) {
            this.router.navigate(['Login']);
        }
    };
    OmsRouterOutlet = __decorate([
        core_1.Directive({
            selector: 'my-app1'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, router_1.Router, common_1.Location])
    ], OmsRouterOutlet);
    return OmsRouterOutlet;
}());
exports.OmsRouterOutlet = OmsRouterOutlet;
//# sourceMappingURL=oms.routeroutlet.js.map