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
var Rx_1 = require("rxjs/Rx");
var CommunicateService = (function () {
    function CommunicateService() {
        this.material = {
            onSelected: new Rx_1.Subject(),
            onChanged: new Rx_1.Subject()
        };
        this.formula = {
            onSelected: new Rx_1.Subject(),
            onChanged: new Rx_1.Subject()
        };
    }
    CommunicateService.prototype.onFormularSelected = function () {
        return this.formula.onSelected;
    };
    CommunicateService.prototype.emitFormularSelected = function (node) {
        return this.formula.onSelected.next(node);
    };
    CommunicateService.prototype.onFormularChanged = function () {
        return this.formula.onChanged;
    };
    CommunicateService.prototype.emitFormularChanged = function (node) {
        this.formula.onChanged.next(node);
    };
    CommunicateService.prototype.onMaterialSelected = function () {
        return this.material.onSelected;
    };
    CommunicateService.prototype.emitMaterialSelected = function (array) {
        this.material.onSelected.next(array);
    };
    CommunicateService.prototype.onMaterialChanged = function () {
        return this.material.onChanged;
    };
    CommunicateService.prototype.emitMaterialChanged = function (node) {
        this.material.onChanged.next(node);
    };
    CommunicateService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], CommunicateService);
    return CommunicateService;
}());
exports.CommunicateService = CommunicateService;
//# sourceMappingURL=communicate.service.js.map