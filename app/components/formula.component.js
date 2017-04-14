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
var filter_pipe_1 = require('../pipes/filter.pipe');
var translate_pipe_1 = require('../pipes/translate.pipe');
var has_pipe_1 = require('../pipes/has.pipe');
var formula_service_1 = require('../services/formula.service');
var communicate_service_1 = require('../services/communicate.service');
var organization_service_1 = require('../organization/organization.service');
var oms_config_1 = require('../oms.config');
var FormulaComponent = (function () {
    function FormulaComponent($communicate, $formula, $org) {
        var _this = this;
        this.$communicate = $communicate;
        this.$formula = $formula;
        this.$org = $org;
        this.key = "";
        this.models = [];
        this.orgs = [];
        this.pinOrg = {};
        this.multiple = [];
        this.loading = true;
        this.exporting = false;
        this.$formula.all().subscribe(function (res) {
            var data = res.json();
            _this.loading = false;
            _this.models = data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                location.href = '/login';
        });
        this.selected = {};
    }
    FormulaComponent.prototype.select = function (evt, node) {
        evt.preventDefault();
        if (this.selected && this.selected.ID != node.ID && this.selected.status) {
            oms_config_1.Oms.showMsg('alert_editing_cannot_select');
            evt.stopPropagation();
            return;
        }
        if (!node)
            return;
        this.selected = node;
        if (!this.selected.status) {
            this.$communicate.emitFormularSelected(node);
        }
    };
    FormulaComponent.prototype.selectOrganization = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        this.pinOrg = node;
        this.loading = true;
        this.$formula.getBy(oms_config_1.Oms.Category.organization, node.ID).subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.models = _data;
        }, function (error) {
            _this.loading = false;
        });
    };
    FormulaComponent.prototype.add = function (evt) {
        evt.preventDefault();
        var node = { status: 'add', title: '', code: '', ID: oms_config_1.Oms.CreateGuid(), Code: '', Title: '', OrgID: this.pinOrg.ID || 0 };
        this.selected = node;
        this.models.splice(0, 0, this.selected);
        evt.stopPropagation();
    };
    FormulaComponent.prototype.remove = function (evt) {
        var _this = this;
        evt.preventDefault();
        var list = _.filter(this.models, function (item) { return item.isChecked; });
        var arr = _.map(list, function (item) { return item.ID; });
        if (!arr.length)
            return;
        console.log(arr);
        if (!confirm(oms_config_1.Oms.getText('confirm_formular_delete')))
            return;
        this.$formula.deletes(arr).subscribe(function (res) {
            var _data = res.json();
            _this.models = _.filter(_this.models, function (item) {
                return !item.isChecked;
            });
            oms_config_1.Oms.showMsg("delete_success");
        }, function (error) {
            oms_config_1.Oms.showMsg("delete_error");
        });
        evt.stopPropagation();
    };
    FormulaComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        if (node.status) {
            return;
        }
        node.code = node.Code;
        node.title = node.Title;
        node.status = 'edit';
        evt.stopPropagation();
    };
    FormulaComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        if (!node || !node.ID)
            return;
        if (node.status == 'add') {
            if (this.selected && this.selected.ID == node.ID)
                this.selected = {};
            this.models = _.filter(this.models, function (item) {
                return item.ID != node.ID;
            });
        }
        else {
            delete node.code;
            delete node.title;
            delete node.status;
        }
        evt.stopPropagation();
    };
    FormulaComponent.prototype.save = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        if (!node || !node.status)
            return;
        var arr = _.filter(this.models, function (item) {
            return item.ID != node.ID && (item.Code == node.code || item.Title.toLowerCase() == node.title.toLowerCase());
        });
        if (arr.length >= 1) {
            oms_config_1.Oms.showMsg('alert_duplication_code_or_title');
            return;
        }
        node.Title = node.title;
        node.Code = node.code;
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        this.$formula[_invoke](node).subscribe(function (res) {
            _this.loading = false;
            if (node.status == 'add') {
                var _data = res.json();
                node.UserID = _data.UserID;
                node.ID = _data.ID;
            }
            delete node.title;
            delete node.code;
            delete node.status;
            _this.selected = node;
            if (!_this.selected.status) {
                _this.$communicate.emitFormularSelected(node);
            }
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg('save failed');
        });
        evt.stopPropagation();
    };
    FormulaComponent.prototype.delete = function (evt, node) {
        var _this = this;
        if (!node)
            return;
        if (confirm(oms_config_1.Oms.getText('confirm_formular_delete'))) {
            this.loading = true;
            this.$formula.delete(node.ID).subscribe(function (res) {
                _this.loading = false;
                _this.models = _.filter(_this.models, function (item) {
                    return item.ID != node.ID;
                });
                _this.models[0] && _this.select(evt, _this.models[0]);
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
    FormulaComponent.prototype.filter = function (evt, value) {
        evt.preventDefault();
        this.key = value;
        evt.stopPropagation();
    };
    FormulaComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$formula.download();
    };
    FormulaComponent.prototype.import = function (evt) {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            self.$formula.import(form).subscribe(function (x) {
                self.models = self.models.concat(x);
                oms_config_1.Oms.showMsg("import_success");
            }, function (error) {
                if (error.Message)
                    alert(error.Message.replace(/\|/gi, '\n'));
                else
                    oms_config_1.Oms.showMsg('import_error');
            });
        });
        input.click();
    };
    FormulaComponent.prototype.export = function (evt, doc) {
        evt.preventDefault();
        var ids = _.map(_.filter(this.models, { _selected: true }), 'ID');
        this.$formula.export(doc, ids);
        evt.stopPropagation();
    };
    FormulaComponent.prototype.diagnostic = function () {
        return JSON.stringify(this.models);
    };
    FormulaComponent = __decorate([
        core_1.Component({
            selector: '.formula-form',
            templateUrl: 'app/views/formula/formula.component.html',
            pipes: [filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe],
            providers: [formula_service_1.FormulaService, organization_service_1.OrganizationService]
        }), 
        __metadata('design:paramtypes', [communicate_service_1.CommunicateService, formula_service_1.FormulaService, organization_service_1.OrganizationService])
    ], FormulaComponent);
    return FormulaComponent;
}());
exports.FormulaComponent = FormulaComponent;
//# sourceMappingURL=formula.component.js.map