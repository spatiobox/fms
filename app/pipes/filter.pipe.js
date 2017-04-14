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
var FilterPipe = (function () {
    function FilterPipe() {
    }
    FilterPipe.prototype.transform = function (value, args) {
        if (!value)
            return [];
        if (!value.length)
            return value;
        if (!args)
            return value;
        if (!args.length)
            return value;
        if (args[0] == "" || !args[0])
            return value;
        var _arr = _.filter(value, function (item) {
            return (item.Title && item.Title.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.Code && item.Code.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.MaterialTitle && item.MaterialTitle.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.MaterialID && item.MaterialID.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.FormularTitle && item.FormularTitle.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.FormularID && item.FormularID.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.RecordDate && item.RecordDate.indexOf(args[0]) >= 0);
        });
        return _arr;
    };
    FilterPipe = __decorate([
        core_1.Pipe({ name: 'filter' }), 
        __metadata('design:paramtypes', [])
    ], FilterPipe);
    return FilterPipe;
}());
exports.FilterPipe = FilterPipe;
//# sourceMappingURL=filter.pipe.js.map