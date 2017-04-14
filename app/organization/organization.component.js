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
var organization_service_1 = require("./organization.service");
var formula_service_1 = require("../services/formula.service");
var grep_pipe_1 = require("../pipes/grep.pipe");
var filter_pipe_1 = require("../pipes/filter.pipe");
var i18n_pipe_1 = require("../pipes/i18n.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("../components/navbar.component");
var navheader_component_1 = require("../components/navheader.component");
var formula_component_1 = require("../components/formula.component");
var communicate_service_1 = require('../services/communicate.service');
var OrganizationComponent = (function () {
    function OrganizationComponent($org, $communicate, $router, $loader) {
        var _this = this;
        this.$org = $org;
        this.$communicate = $communicate;
        this.$router = $router;
        this.$loader = $loader;
        this.orgs = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true;
        this.$org.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.orgs = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
        this.$org.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.formulas = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
    }
    OrganizationComponent.prototype.select = function (evt, node) {
        evt.preventDefault();
        if (node.selected) {
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    OrganizationComponent.prototype.add = function (evt) {
        evt.preventDefault();
        var node = { status: 'add', title: '', id: 0, ID: 0, Title: '' };
        this.selected = node;
        this.orgs.splice(0, 0, this.selected);
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        if (node.status) {
            return;
        }
        node.id = node.ID;
        node.title = node.Title;
        node.status = 'edit';
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        if (node.status == 'add') {
            if (this.selected && this.selected.ID == node.ID)
                this.selected = {};
            this.orgs = _.filter(this.orgs, function (item) {
                return item.ID != node.ID;
            });
        }
        else {
            delete node.id;
            delete node.title;
            delete node.status;
        }
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.save = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        if (!node || !node.status)
            return;
        console.log(node);
        var arr = _.filter(this.orgs, function (item) {
            return item.ID != node.ID && (item.ID == node.id || item.Title.toLowerCase() == node.title.toLowerCase());
        });
        if (arr.length >= 1) {
            oms_config_1.Oms.showMsg('alert_duplication_code_or_title');
            return;
        }
        node.Title = node.title;
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        this.$org[_invoke](node).subscribe(function (res) {
            _this.loading = false;
            if (node.status == 'add') {
                var _data = res.json();
                node.ID = _data.ID;
            }
            delete node.title;
            delete node.id;
            delete node.status;
            _this.selected = node;
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg('save failed');
        });
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.delete = function (evt, node) {
        var _this = this;
        if (!node)
            return;
        if (confirm(oms_config_1.Oms.getText('confirm_delete'))) {
            this.loading = true;
            this.$org.delete(node.ID).subscribe(function (res) {
                _this.loading = false;
                _this.orgs = _.filter(_this.orgs, function (item) {
                    return item.ID != node.ID;
                });
                _this.orgs[0] && _this.select(evt, _this.orgs[0]);
                oms_config_1.Oms.showMsg('delete_success');
            }, function (error) {
                _this.loading = false;
                var msg = error.json();
                if (msg.Message)
                    alert(msg.Message);
                else
                    oms_config_1.Oms.showMsg("alert_delete_error");
            });
        }
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.deletes = function (evt) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        _.each(this.orgs, function (item) {
            if (item.selected)
                arr.push(item.ID);
        });
        if (!arr.length)
            return;
        if (!confirm(oms_config_1.Oms.getText('confirm_delete')))
            return;
        this.$org.deletes(arr).subscribe(function (res) {
            _this.orgs = _.filter(_this.orgs, function (item) {
                return !item.selected;
            });
            oms_config_1.Oms.showMsg("delete_success");
        }, function (error) {
            var info = error.json();
            if (info.Message && info.Message.indexOf(':') >= 0) {
                var alarm_1 = '';
                var msgs = info.Message.split('|');
                _.forEach(msgs, function (str) {
                    var srr = str.split(':');
                    alarm_1 += oms_config_1.Oms.getText('delete_materials_already_used').replace('{0}', srr[0]).replace('{1}', srr[1]) + '\n';
                });
                alarm_1 = oms_config_1.Oms.getText('delete_error') + ':\n' + alarm_1;
                alert(alarm_1);
            }
            else
                oms_config_1.Oms.showMsg("delete_error");
        });
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.filter = function (evt, value) {
        evt.preventDefault();
        this.key = value;
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$org.download();
    };
    OrganizationComponent.prototype.export = function (evt, doc) {
        evt.preventDefault();
        this.$org.export(doc);
        evt.stopPropagation();
    };
    OrganizationComponent.prototype.diagnostic = function () {
        return JSON.stringify(this.orgs);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], OrganizationComponent.prototype, "password", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], OrganizationComponent.prototype, "confirmPassword", void 0);
    OrganizationComponent = __decorate([
        core_1.Component({
            selector: 'my-organization',
            templateUrl: 'app/organization/organization.component.html',
            pipes: [grep_pipe_1.GrepPipe, filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe, i18n_pipe_1.I18nPipe],
            providers: [organization_service_1.OrganizationService, formula_service_1.FormulaService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent, formula_component_1.FormulaComponent]
        }), 
        __metadata('design:paramtypes', [organization_service_1.OrganizationService, communicate_service_1.CommunicateService, router_1.Router, core_1.DynamicComponentLoader])
    ], OrganizationComponent);
    return OrganizationComponent;
}());
exports.OrganizationComponent = OrganizationComponent;
//# sourceMappingURL=organization.component.js.map