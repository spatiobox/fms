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
var config_service_1 = require("./config.service");
var grep_pipe_1 = require("../pipes/grep.pipe");
var filter_pipe_1 = require("../pipes/filter.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("../components/navbar.component");
var navheader_component_1 = require("../components/navheader.component");
var ConfigComponent = (function () {
    function ConfigComponent($config, $router, $loader) {
        var _this = this;
        this.$config = $config;
        this.$router = $router;
        this.$loader = $loader;
        this.models = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true;
        this.$config.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.models = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
    }
    ConfigComponent.prototype.select = function (evt, node) {
        if (node.selected) {
            node.selected = null;
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    ConfigComponent.prototype.toggle = function (evt, isChecked, category) {
        _.each(_.filter(this.models, function (x) { return x.Status == category; }), function (item) {
            if (isChecked)
                item.selected = true;
            else
                delete item.selected;
        });
    };
    ConfigComponent.prototype.delete = function (evt) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        _.each(this.models, function (item) {
            if (item.selected)
                arr.push(item.ID);
        });
        if (!arr.length)
            return;
        this.$config.delete(arr).subscribe(function (res) {
            _this.models = _.filter(_this.models, function (item) {
                return !item.selected;
            });
            oms_config_1.Oms.showMsg("delete_success");
        }, function (error) {
            oms_config_1.Oms.showMsg("delete_error");
        });
    };
    ConfigComponent.prototype.search = function (evt, value) {
        evt.preventDefault();
        this.key = value;
    };
    ConfigComponent.prototype.process = function (evt, node, isAudit) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        this.$config.unlock(node, isAudit ? 1 : -1).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("success");
            node.Status = isAudit ? 1 : -1;
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("error");
        });
    };
    ConfigComponent.prototype.filter = function (evt, value) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        if (value) {
            this.$config.getBy('formular', value).subscribe(function (res) {
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
            this.$config.all().subscribe(function (res) {
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
    ConfigComponent.prototype.copy = function (evt, source, target) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        var data = {};
        data.SourceID = source;
        data.TargetID = target;
        console.info(data);
        this.$config.copy(data).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("success");
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("error");
        });
    };
    ConfigComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        this.selected = node;
        this.selected.position = node.Position;
        this.selected.fullname = node.FullName;
        this.selected.department = node.Department;
        $('#emodal').modal('show');
        evt.stopPropagation();
    };
    ConfigComponent.prototype.save = function (evt, node) {
        evt.preventDefault();
        console.log('current selected', node);
        this.$config.patch(node.Id, { Department: node.Department, Position: node.Position, FullName: node.FullName }).subscribe(function (res) {
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
    ConfigComponent.prototype.cancel = function (evt, node) {
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
    ConfigComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$config.download();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ConfigComponent.prototype, "password", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ConfigComponent.prototype, "confirmPassword", void 0);
    ConfigComponent = __decorate([
        core_1.Component({
            selector: 'my-config',
            templateUrl: 'app/config/config.component.html',
            pipes: [grep_pipe_1.GrepPipe, filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe],
            providers: [config_service_1.ConfigService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent]
        }), 
        __metadata('design:paramtypes', [config_service_1.ConfigService, router_1.Router, core_1.DynamicComponentLoader])
    ], ConfigComponent);
    return ConfigComponent;
}());
exports.ConfigComponent = ConfigComponent;
//# sourceMappingURL=config.component.js.map