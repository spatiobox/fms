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
var user_service_1 = require("./user.service");
var grep_pipe_1 = require("../pipes/grep.pipe");
var filter_pipe_1 = require("../pipes/filter.pipe");
var i18n_pipe_1 = require("../pipes/i18n.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("../components/navbar.component");
var navheader_component_1 = require("../components/navheader.component");
var UserComponent = (function () {
    function UserComponent($user, $router, $loader) {
        var _this = this;
        this.$user = $user;
        this.$router = $router;
        this.$loader = $loader;
        this.models = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true;
        this.$user.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.models = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
    }
    UserComponent.prototype.select = function (evt, node) {
        if (node.selected) {
            node.selected = null;
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    UserComponent.prototype.toggle = function (evt, isChecked, category) {
        _.each(_.filter(this.models, function (x) { return x.Status == category; }), function (item) {
            if (isChecked)
                item.selected = true;
            else
                delete item.selected;
        });
    };
    UserComponent.prototype.delete = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        arr.push(node.Id);
        if (confirm(oms_config_1.Oms.getText('confirm_delete'))) {
            this.$user.deletes(arr).subscribe(function (res) {
                _this.models = _.filter(_this.models, function (item) {
                    return item.Id != node.Id;
                });
                oms_config_1.Oms.showMsg("delete_success");
            }, function (error) {
                var msg = error.json();
                if (msg.Message) {
                    oms_config_1.Oms.showMsg(msg.Message);
                }
                else
                    oms_config_1.Oms.showMsg("delete_error");
            });
        }
    };
    UserComponent.prototype.deletes = function (evt) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        _.each(this.models, function (item) {
            if (item.selected)
                arr.push(item.Id);
        });
        if (!arr.length)
            return;
        if (confirm(oms_config_1.Oms.getText('confirm_delete'))) {
            this.$user.deletes(arr).subscribe(function (res) {
                _this.models = _.filter(_this.models, function (item) {
                    return !item.selected;
                });
                oms_config_1.Oms.showMsg("delete_success");
            }, function (error) {
                var msg = error.json();
                if (msg.Message) {
                    oms_config_1.Oms.showMsg(msg.Message);
                }
                else
                    oms_config_1.Oms.showMsg("delete_error");
            });
        }
    };
    UserComponent.prototype.search = function (evt, value) {
        evt.preventDefault();
        this.key = value;
    };
    UserComponent.prototype.process = function (evt, node, isAudit) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        this.$user.unlock(node, isAudit ? 1 : -1).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("success");
            node.Status = isAudit ? 1 : -1;
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("error");
        });
    };
    UserComponent.prototype.filter = function (evt, value) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        if (value) {
            this.$user.getBy('formular', value).subscribe(function (res) {
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
            this.$user.all().subscribe(function (res) {
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
    UserComponent.prototype.copy = function (evt, source, target) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        var data = {};
        data.SourceID = source;
        data.TargetID = target;
        console.info(data);
        this.$user.copy(data).subscribe(function (res) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("success");
        }, function (error) {
            _this.loading = false;
            oms_config_1.Oms.showMsg("error");
        });
    };
    UserComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        this.selected = node;
        this.selected.position = node.Position;
        this.selected.fullname = node.FullName;
        this.selected.department = node.Department;
        this.selected.company = node.Company;
        $('#emodal').modal('show');
        evt.stopPropagation();
    };
    UserComponent.prototype.save = function (evt, node) {
        evt.preventDefault();
        console.log('current selected', node);
        this.$user.patch(node.Id, { Department: node.Department, Position: node.Position, FullName: node.FullName, Company: node.Company }).subscribe(function (res) {
            oms_config_1.Oms.showMsg("save success");
            delete node.position;
            delete node.department;
            delete node.fullname;
            delete node.company;
            $('#emodal').modal('hide');
            return;
        }, function (err) {
            oms_config_1.Oms.showMsg("save failed");
            return;
        });
        evt.stopPropagation();
    };
    UserComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        console.log('current selected', node);
        node.Department = node.department;
        node.FullName = node.fullname;
        node.Position = node.position;
        node.Company = node.company;
        delete node.position;
        delete node.department;
        delete node.fullname;
        delete node.company;
        $('#emodal').modal('hide');
        evt.stopPropagation();
    };
    UserComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$user.download();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UserComponent.prototype, "password", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UserComponent.prototype, "confirmPassword", void 0);
    UserComponent = __decorate([
        core_1.Component({
            selector: 'my-users',
            templateUrl: 'app/user/user.component.html',
            pipes: [grep_pipe_1.GrepPipe, filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe, i18n_pipe_1.I18nPipe],
            providers: [user_service_1.UserService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent]
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, router_1.Router, core_1.DynamicComponentLoader])
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map