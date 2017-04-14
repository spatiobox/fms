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
var translate_pipe_1 = require('../pipes/translate.pipe');
var oms_config_1 = require('../oms.config');
var dictionary_service_1 = require("./dictionary.service");
var grep_pipe_1 = require("../pipes/grep.pipe");
var filter_pipe_1 = require("../pipes/filter.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("../components/navbar.component");
var navheader_component_1 = require("../components/navheader.component");
var DictionaryComponent = (function () {
    function DictionaryComponent($dic, $router, $loader) {
        var _this = this;
        this.$dic = $dic;
        this.$router = $router;
        this.$loader = $loader;
        this.models = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true;
        this.$dic.search({ code: "region" }).subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.models = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
    }
    DictionaryComponent.prototype.select = function (evt, node) {
        if (node.selected) {
            node.selected = null;
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    DictionaryComponent.prototype.change = function (evt, node, category) {
        var value = evt.target.value;
        var origin = node["Title" + category.toUpperCase()];
        node[category + "Updating"] = true;
        var param = {};
        param["Title" + category.toUpperCase()] = value;
        this.$dic.patch(node.ID, param).subscribe(function (res) {
            node["Title" + category.toUpperCase()] = value;
            node[category + "Updating"] = false;
        }, function (error) {
            evt.target.value = origin;
            node[category + "Updating"] = false;
            oms_config_1.Oms.showMsg("save failed");
        });
    };
    DictionaryComponent.prototype.toggle = function (evt, isChecked, category) {
        _.each(_.filter(this.models, function (x) { return x.Status == category; }), function (item) {
            if (isChecked)
                item.selected = true;
            else
                delete item.selected;
        });
    };
    DictionaryComponent.prototype.delete = function (evt) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        _.each(this.models, function (item) {
            if (item.selected)
                arr.push(item.ID);
        });
        if (!arr.length)
            return;
        this.$dic.delete(arr).subscribe(function (res) {
            _this.models = _.filter(_this.models, function (item) {
                return !item.selected;
            });
            oms_config_1.Oms.showMsg("delete_success");
        }, function (error) {
            oms_config_1.Oms.showMsg("delete_error");
        });
    };
    DictionaryComponent.prototype.search = function (evt, value) {
        evt.preventDefault();
        this.key = value;
    };
    DictionaryComponent.prototype.process = function (evt, node, isAudit) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        this.$dic.unlock(node, isAudit ? 1 : -1).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("success");
            node.Status = isAudit ? 1 : -1;
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("error");
        });
    };
    DictionaryComponent.prototype.export = function (evt) {
        evt.preventDefault();
    };
    DictionaryComponent.prototype.filter = function (evt, value) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        if (value) {
            this.$dic.getBy('formular', value).subscribe(function (res) {
                _this.loading = false;
                var _data = res.json();
                _this.models = _data;
            }, function (error) {
                _this.loading = false;
                if (error.status == 401)
                    _this.$router.navigate(['/login']);
            });
        }
        else {
            this.$dic.all().subscribe(function (res) {
                _this.loading = false;
                var _data = res.json();
                _this.models = _data.list;
            }, function (error) {
                _this.loading = false;
                if (error.status == 401)
                    _this.$router.navigate(['/login']);
            });
        }
        evt.stopPropagation();
    };
    DictionaryComponent.prototype.copy = function (evt, source, target) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        var data = {};
        data.SourceID = source;
        data.TargetID = target;
        console.info(data);
        this.$dic.copy(data).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("success");
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("error");
        });
    };
    DictionaryComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        this.selected = node;
        this.selected.position = node.Position;
        this.selected.fullname = node.FullName;
        this.selected.department = node.Department;
        $('#emodal').modal('show');
        evt.stopPropagation();
    };
    DictionaryComponent.prototype.save = function (evt, node) {
        evt.preventDefault();
        console.log('current selected', node);
        this.$dic.patch(node.Id, { Department: node.Department, Position: node.Position, FullName: node.FullName }).subscribe(function (res) {
            oms_config_1.Oms.showMsg("save success");
            delete node.position;
            delete node.department;
            delete node.fullname;
            $('#emodal').modal('hide');
            return;
        }, function (err) {
            oms_config_1.Oms.showMsg("save failed");
            return;
        });
        evt.stopPropagation();
    };
    DictionaryComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        console.log('current selected', node);
        node.Department = node.department;
        node.FullName = node.fullname;
        node.Position = node.position;
        delete node.position;
        delete node.department;
        delete node.fullname;
        $('#emodal').modal('hide');
        evt.stopPropagation();
    };
    DictionaryComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$dic.download();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DictionaryComponent.prototype, "password", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DictionaryComponent.prototype, "confirmPassword", void 0);
    DictionaryComponent = __decorate([
        core_1.Component({
            selector: 'my-dictionary',
            templateUrl: 'app/dictionary/dictionary.component.html',
            pipes: [grep_pipe_1.GrepPipe, filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe],
            providers: [dictionary_service_1.DictionaryService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent]
        }), 
        __metadata('design:paramtypes', [dictionary_service_1.DictionaryService, router_1.Router, core_1.DynamicComponentLoader])
    ], DictionaryComponent);
    return DictionaryComponent;
}());
exports.DictionaryComponent = DictionaryComponent;
//# sourceMappingURL=dictionary.component.js.map