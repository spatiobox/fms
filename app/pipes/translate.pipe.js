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
var oms_config_1 = require('../oms.config');
var TranslatePipe = (function () {
    function TranslatePipe() {
    }
    TranslatePipe.prototype.transform = function (value, args) {
        if (!value)
            return value;
        if (!oms_config_1.Oms.Region[oms_config_1.Oms.lang])
            return value;
        var spliter = oms_config_1.Oms.lang == 'en-US' ? ' ' : '';
        var arr = value.split(' ');
        var result = '';
        arr.forEach(function (item) {
            result += spliter + (oms_config_1.Oms.Region[oms_config_1.Oms.lang][item] || value);
        });
        return result;
    };
    TranslatePipe = __decorate([
        core_1.Pipe({ name: 'translate' }), 
        __metadata('design:paramtypes', [])
    ], TranslatePipe);
    return TranslatePipe;
}());
exports.TranslatePipe = TranslatePipe;
//# sourceMappingURL=translate.pipe.js.map