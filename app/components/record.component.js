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
var grep_pipe_1 = require('../pipes/grep.pipe');
var translate_pipe_1 = require('../pipes/translate.pipe');
var i18n_pipe_1 = require('../pipes/i18n.pipe');
var has_pipe_1 = require('../pipes/has.pipe');
var formula_service_1 = require('../services/formula.service');
var organization_service_1 = require('../organization/organization.service');
var record_service_1 = require('../services/record.service');
var profile_service_1 = require('../auth/services/profile.service');
var navbar_component_1 = require('../components/navbar.component');
var navheader_component_1 = require('../components/navheader.component');
var oms_config_1 = require('../oms.config');
var RecordComponent = (function () {
    function RecordComponent($record, $formula, $profile, $org) {
        var _this = this;
        this.$record = $record;
        this.$formula = $formula;
        this.$profile = $profile;
        this.$org = $org;
        this.models = [];
        this.orgs = [];
        this.bean = { date: null };
        this.formulas = [];
        this.loading = true;
        this.isAdmin = this.$profile.isAdmin();
        this.$record.getFormulas().subscribe(function (res) {
            var _data = res.json();
            _this.formulas = _data.list;
            _this.group = _.groupBy(_this.formulas, 'Title');
            if (_this.isAdmin)
                _this.formulas = _.sortBy(_this.formulas, ['UserID', 'Title']);
        }, function (error) {
        });
        this.$record.all().subscribe(function (res) {
            var _data = res.json();
            _this.loading = false;
            _this.models = _data.list;
        }, function (error) {
            _this.loading = false;
        });
        this.$org.all().subscribe(function (res) {
            var _data = res.json();
            _this.loading = false;
            _this.orgs = _data.list;
        }, function (error) {
            _this.loading = false;
        });
    }
    RecordComponent.prototype.select = function (evt, node) {
        if (node.selected) {
            node.selected = null;
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    RecordComponent.prototype.toggle = function (evt, isChecked) {
        var self = this;
        _.each(self.models, function (item) {
            if (isChecked)
                item.selected = true;
            else
                delete item.selected;
        });
    };
    RecordComponent.prototype.delete = function (evt) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        _.each(this.models, function (item) {
            if (item.selected)
                arr.push(item.ID);
        });
        if (!arr.length)
            return;
        this.$record.delete(arr).subscribe(function (res) {
            var _data = res.json();
            _this.models = _.filter(_this.models, function (item) {
                return !item.selected;
            });
            oms_config_1.Oms.showMsg("delete_success");
        }, function (error) {
            oms_config_1.Oms.showMsg("delete_error");
        });
    };
    RecordComponent.prototype.search = function (evt, formula, startdate, enddate, key) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        var grep = {};
        if (formula)
            grep.FormularID = formula;
        if (startdate || this.enddate)
            grep.RecordDate = {};
        if (startdate)
            grep.RecordDate["$gte"] = startdate;
        if (enddate)
            grep.RecordDate["$lt"] = enddate;
        if (this.key)
            grep["$regex"] = [
                { "FormularTitle": this.key },
                { "MaterialTitle": this.key },
                { "User.Position": this.key },
                { "User.Department": this.key },
                { "User.FullName": this.key },
                { "User.UserName": this.key }];
        var json = {};
        if (Object.getOwnPropertyNames(grep).length)
            json.grep = grep;
        json.sort = "{RecordDate:'desc'}";
        this.$record.search(json).subscribe(function (res) {
            var _data = res.json();
            _this.loading = false;
            _this.models = _data.list;
        }, function (error) {
            _this.loading = false;
        });
        evt.stopPropagation();
    };
    RecordComponent.prototype.filter = function (evt, value) {
        var _this = this;
        evt.preventDefault();
        this.loading = true;
        if (value) {
            this.$record.getBy('formula', value).subscribe(function (res) {
                var _data = res.json();
                _this.loading = false;
                _this.models = _data;
            }, function (error) {
                _this.loading = false;
                if (error.status == 401)
                    location.href = '/login.html';
            });
        }
        else {
            this.$record.all().subscribe(function (res) {
                var _data = res.json();
                _this.loading = false;
                _this.models = _data.list;
            }, function (error) {
                _this.loading = false;
                if (error.status == 401)
                    location.href = '/login.html';
            });
        }
        evt.stopPropagation();
    };
    RecordComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$record.download();
    };
    RecordComponent.prototype.import = function (evt) {
        var _this = this;
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            _this.$record.import(form).subscribe(function (res) {
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
    RecordComponent.prototype.export = function (evt, doc) {
        evt.preventDefault();
        var form = new FormData();
        var arr = [];
        _.each(this.models, function (item) {
            if (item.selected)
                arr.push(item.ID);
        });
        var grep = {};
        if (this.formula)
            grep.FormularID = this.formula;
        if (this.organization)
            grep.OrgID = this.organization;
        if (this.startdate || this.enddate)
            grep.RecordDate = {};
        if (this.startdate)
            grep.RecordDate["$gte"] = this.startdate;
        if (this.enddate)
            grep.RecordDate["$lt"] = this.enddate;
        if (this.key)
            grep["$regex"] = [
                { "FormularTitle": this.key },
                { "MaterialTitle": this.key },
                { "User.Position": this.key },
                { "User.UserName": this.key },
                { "User.Department": this.key },
                { "User.FullName": this.key },
                { "User.UserName": this.key }];
        if (arr.length)
            grep.ID = arr;
        var json = {};
        if (Object.getOwnPropertyNames(grep).length)
            json.grep = grep;
        json.sort = "{RecordDate:'desc'}";
        form.append('filter', JSON.stringify(json));
        this.$record.export(JSON.stringify(json), doc);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Date)
    ], RecordComponent.prototype, "startdate", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Date)
    ], RecordComponent.prototype, "enddate", void 0);
    RecordComponent = __decorate([
        core_1.Component({
            selector: 'my-records',
            templateUrl: 'app/views/formula/record.component.html',
            pipes: [filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe, i18n_pipe_1.I18nPipe, grep_pipe_1.GrepPipe],
            providers: [record_service_1.RecordService, formula_service_1.FormulaService, profile_service_1.ProfileService, organization_service_1.OrganizationService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent]
        }), 
        __metadata('design:paramtypes', [record_service_1.RecordService, formula_service_1.FormulaService, profile_service_1.ProfileService, organization_service_1.OrganizationService])
    ], RecordComponent);
    return RecordComponent;
}());
exports.RecordComponent = RecordComponent;
//# sourceMappingURL=record.component.js.map