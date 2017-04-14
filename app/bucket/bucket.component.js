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
var bucket_service_1 = require("./bucket.service");
var formula_service_1 = require("../services/formula.service");
var grep_pipe_1 = require("../pipes/grep.pipe");
var filter_pipe_1 = require("../pipes/filter.pipe");
var i18n_pipe_1 = require("../pipes/i18n.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("../components/navbar.component");
var navheader_component_1 = require("../components/navheader.component");
var formula_component_1 = require("../components/formula.component");
var communicate_service_1 = require('../services/communicate.service');
var BucketComponent = (function () {
    function BucketComponent($bucket, $communicate, $router, $loader) {
        var _this = this;
        this.$bucket = $bucket;
        this.$communicate = $communicate;
        this.$router = $router;
        this.$loader = $loader;
        this.orgs = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true;
        this.cipher = {};
        this.$bucket.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.orgs = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
        this.$bucket.cipher().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.cipher = _data;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
    }
    BucketComponent.prototype.select = function (evt, node) {
        evt.preventDefault();
        if (node.selected) {
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    BucketComponent.prototype.add = function (evt) {
        evt.preventDefault();
        var guid = oms_config_1.Oms.CreateGuid();
        var node = { ID: guid, status: 'add', title: '', Title: '', scale: '', Scale: '', url: '', Url: '' };
        this.selected = node;
        this.orgs.splice(0, 0, this.selected);
        evt.stopPropagation();
    };
    BucketComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        if (node.status) {
            return;
        }
        node.id = node.ID;
        node.title = node.Title;
        node.scale = node.Scale;
        node.url = node.Url;
        node.status = 'edit';
        evt.stopPropagation();
    };
    BucketComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        if (node.status == 'add') {
            if (this.selected && this.selected.ID == node.ID)
                this.selected = {};
            this.orgs = _.filter(this.orgs, function (item) {
                return item.ID != node.ID;
            });
        }
        else {
            for (var p in node) {
                if (/^[a-z].*?/.test(p)) {
                    delete node[p];
                }
            }
        }
        evt.stopPropagation();
    };
    BucketComponent.prototype.save = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        if (!node || !node.status)
            return;
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
        var bean = {};
        bean.ID = node.ID;
        bean.Scale = node.scale;
        bean.Url = node.url;
        bean.Title = node.title;
        this.$bucket[_invoke](bean).subscribe(function (res) {
            _this.loading = false;
            if (node.status == 'add') {
                var _data = res.json();
                node.ID = _data.ID;
                node.Scale = _data.Scale;
                node.Url = _data.Url;
            }
            for (var p in node) {
                if (/^[a-z].*?/.test(p)) {
                    delete node[p];
                }
            }
            _this.selected = node;
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg('save failed');
        });
        evt.stopPropagation();
    };
    BucketComponent.prototype.saveCipher = function (evt, node) {
        var _this = this;
        this.$bucket.postCipher(node).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg('save success');
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg('save failed');
        });
    };
    BucketComponent.prototype.delete = function (evt, node) {
        var _this = this;
        if (!node)
            return;
        if (confirm(oms_config_1.Oms.getText('confirm_delete'))) {
            this.loading = true;
            this.$bucket.delete(node.ID).subscribe(function (res) {
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
    BucketComponent.prototype.deletes = function (evt) {
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
        this.$bucket.deletes(arr).subscribe(function (res) {
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
    BucketComponent.prototype.filter = function (evt, value) {
        evt.preventDefault();
        this.key = value;
        evt.stopPropagation();
    };
    BucketComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$bucket.download();
    };
    BucketComponent.prototype.export = function (evt, doc) {
        evt.preventDefault();
        this.$bucket.export(doc);
        evt.stopPropagation();
    };
    BucketComponent.prototype.diagnostic = function () {
        return JSON.stringify(this.orgs);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], BucketComponent.prototype, "password", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], BucketComponent.prototype, "confirmPassword", void 0);
    BucketComponent = __decorate([
        core_1.Component({
            selector: 'my-bucket',
            templateUrl: 'app/bucket/bucket.component.html',
            pipes: [grep_pipe_1.GrepPipe, filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe, i18n_pipe_1.I18nPipe],
            providers: [bucket_service_1.BucketService, formula_service_1.FormulaService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent, formula_component_1.FormulaComponent]
        }), 
        __metadata('design:paramtypes', [bucket_service_1.BucketService, communicate_service_1.CommunicateService, router_1.Router, core_1.DynamicComponentLoader])
    ], BucketComponent);
    return BucketComponent;
}());
exports.BucketComponent = BucketComponent;
//# sourceMappingURL=bucket.component.js.map