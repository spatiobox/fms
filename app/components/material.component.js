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
var material_service_1 = require('../services/material.service');
var communicate_service_1 = require('../services/communicate.service');
var oms_config_1 = require('../oms.config');
var MaterialComponent = (function () {
    function MaterialComponent($communicate, $material, elemRef) {
        var _this = this;
        this.$communicate = $communicate;
        this.$material = $material;
        this.elemRef = elemRef;
        this.el = elemRef.nativeElement;
        this.models = [];
        this.loading = true;
        this.$material.all().subscribe(function (res) {
            var _data = res.json();
            _this.loading = false;
            _this.models = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                location.href = '/login';
        });
    }
    MaterialComponent.prototype.select = function (evt, node) {
        if (node.selected) {
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    MaterialComponent.prototype.add = function (evt) {
        evt.preventDefault();
        var node = { status: 'add', title: '', code: '', Title: '', ID: oms_config_1.Oms.CreateGuid(), Code: '' };
        this.models.splice(0, 0, node);
        evt.stopPropagation();
    };
    MaterialComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        node.code = node.Code;
        node.title = node.Title;
        node.status = 'edit';
        evt.stopPropagation();
    };
    MaterialComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        if (node.status == 'add') {
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
    MaterialComponent.prototype.save = function (evt, node) {
        var _this = this;
        if (!node)
            return;
        if (!node.status)
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
        this.$material[_invoke](node).subscribe(function (res) {
            _this.loading = false;
            if (node.status == 'add') {
                var _data = res.json();
                node.UserID = _data.UserID;
                node.ID = _data.ID;
            }
            delete node.title;
            delete node.code;
            delete node.status;
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg('save failed');
        });
        this.$communicate.emitMaterialChanged(node);
    };
    MaterialComponent.prototype.delete = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        if (!node)
            return;
        if (confirm(oms_config_1.Oms.getText('confirm_delete'))) {
            this.loading = true;
            this.$material.delete(node.ID).subscribe(function (res) {
                _this.loading = false;
                _this.models = _.filter(_this.models, function (item) {
                    return item.ID != node.ID;
                });
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
    MaterialComponent.prototype.deletes = function (evt) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        _.each(this.models, function (item) {
            if (item.selected)
                arr.push(item.ID);
        });
        if (!arr.length)
            return;
        this.$material.deletes(arr).subscribe(function (res) {
            _this.models = _.filter(_this.models, function (item) {
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
    MaterialComponent.prototype.filter = function (evt, value) {
        evt.preventDefault();
        this.key = value;
        evt.stopPropagation();
    };
    MaterialComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$material.download();
    };
    MaterialComponent.prototype.import = function (evt) {
        var _this = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            _this.$material.import(form).subscribe(function (res) {
                _this.models = _this.models.concat(res);
                oms_config_1.Oms.showMsg("import_success");
            }, function (err) {
                if (err.Message)
                    alert(err.Message.replace(/\|/gi, '\n'));
                else
                    oms_config_1.Oms.showMsg('import_error');
            });
        });
        input.click();
    };
    MaterialComponent.prototype.export = function (evt, doc) {
        evt.preventDefault();
        this.$material.export(doc);
    };
    MaterialComponent.prototype.join = function (evt) {
        evt.preventDefault();
        var hasEditingNode = false;
        var _arr = _.filter(this.models, function (item) {
            if (item.selected && item.status) {
                hasEditingNode = true;
                return;
            }
            return item.selected;
        });
        if (hasEditingNode) {
            oms_config_1.Oms.showMsg('alert_editing_join');
            return;
        }
        if (!_arr || !_arr.length) {
            oms_config_1.Oms.showMsg('alert_nothing_selected');
            return;
        }
        this.$communicate.emitMaterialSelected(_arr);
        evt.stopPropagation();
    };
    MaterialComponent.prototype.ngOnDestroy = function () {
    };
    MaterialComponent = __decorate([
        core_1.Component({
            selector: '.material-form',
            templateUrl: 'app/views/formula/material.component.html',
            pipes: [filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe],
            providers: [material_service_1.MaterialService]
        }), 
        __metadata('design:paramtypes', [communicate_service_1.CommunicateService, material_service_1.MaterialService, core_1.ElementRef])
    ], MaterialComponent);
    return MaterialComponent;
}());
exports.MaterialComponent = MaterialComponent;
//# sourceMappingURL=material.component.js.map