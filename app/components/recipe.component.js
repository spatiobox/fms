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
var sum_pipe_1 = require('../pipes/sum.pipe');
var translate_pipe_1 = require('../pipes/translate.pipe');
var has_pipe_1 = require('../pipes/has.pipe');
var formula_service_1 = require('../services/formula.service');
var recipe_service_1 = require('../services/recipe.service');
var profile_service_1 = require('../auth/services/profile.service');
var communicate_service_1 = require('../services/communicate.service');
var oms_config_1 = require('../oms.config');
var decimal_directive_1 = require("../directives/decimal.directive");
var RecipeComponent = (function () {
    function RecipeComponent($communicate, $formula, $recipe, $profile, elemRef) {
        var _this = this;
        this.$communicate = $communicate;
        this.$formula = $formula;
        this.$recipe = $recipe;
        this.$profile = $profile;
        this.elemRef = elemRef;
        this.el = elemRef.nativeElement;
        this.sum = _.sum;
        this.loading = false;
        this.formula = {};
        this.isAdmin = this.$profile.isAdmin();
        $communicate.onFormularSelected().subscribe(function (x) { return _this.switchFormular(x); });
        $communicate.onFormularChanged().subscribe(function (x) { return _this.refreshFormular(x); });
        $communicate.onMaterialSelected().subscribe(function (x) { return _this.joinMaterial(x); });
        $communicate.onMaterialChanged().subscribe(function (x) { return _this.refreshMaterial(x); });
        this.models = [];
    }
    RecipeComponent.prototype.select = function (evt, node) {
        if (node.selected) {
            delete node.selected;
        }
        else {
            node.selected = true;
        }
    };
    RecipeComponent.prototype.check = function (evt, input) {
        evt.preventDefault();
        console.log('input', input);
        if (!isNaN(Number(input.value)))
            input.value = Math.abs(parseFloat(Number(input.value).toFixed(4)));
    };
    RecipeComponent.prototype.setClass = function (evt, input) {
        $(input)[input.validity.valid ? "removeClass" : "addClass"]("has-error");
    };
    RecipeComponent.prototype.IsRatioChanged = function (evt, node, v) {
        console.log(v, typeof v);
        node.isratio = Boolean(v);
    };
    RecipeComponent.prototype.switchFormular = function (node) {
        var _this = this;
        this.formula = node;
        this.loading = true;
        this.$recipe.getBy(oms_config_1.Oms.Category.formula, node.ID).subscribe(function (res) {
            var _data = res.json();
            var _list = _.filter(_data, function (item) {
                return item.FormularID == node.ID;
            });
            _this.loading = false;
            _this.models = _list;
            return _this.loading;
        });
    };
    RecipeComponent.prototype.refreshFormular = function (node) {
        this.formula = node;
    };
    RecipeComponent.prototype.joinMaterial = function (nodes) {
        var _this = this;
        if (!(this.formula && this.formula.ID)) {
            oms_config_1.Oms.showMsg('alert_formular_not_selected');
            return;
        }
        if (nodes && nodes.length) {
            nodes.map(function (x) {
                var m = _.find(_this.models, function (item) {
                    return item.MaterialID == x.ID;
                });
                if (!m) {
                    var recipe = {
                        ID: oms_config_1.Oms.CreateGuid(),
                        UserID: _this.formula.UserID,
                        FormularID: _this.formula.ID,
                        FormularTitle: _this.formula.Title,
                        MaterialID: x.ID,
                        MaterialTitle: x.Title,
                        Weight: 0.0,
                        Deviation: 0.0,
                        IsRatio: false,
                        Sort: _this.models.length + 1,
                        status: 'add',
                        weight: 0,
                        deviation: 0,
                        isratio: false
                    };
                    _this.models.push(recipe);
                }
            });
        }
    };
    RecipeComponent.prototype.refreshMaterial = function (node) {
        if (!node)
            return;
        var m = _.find(this.models, function (item) {
            return item.MaterialID == node.ID;
        });
        if (m) {
            m.MaterialTitle = node.Title;
        }
    };
    RecipeComponent.prototype.edit = function (evt, node) {
        evt.preventDefault();
        node.weight = node.Weight;
        node.deviation = node.Deviation;
        node.isratio = node.IsRatio ? "true" : "false";
        node.status = 'edit';
        evt.stopPropagation();
    };
    RecipeComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        if (node.status == 'add') {
            this.models = _.filter(this.models, function (item) {
                return item.ID != node.ID;
            });
        }
        else {
            delete node.weight;
            delete node.deviation;
            delete node.isratio;
            delete node.status;
        }
        evt.stopPropagation();
    };
    RecipeComponent.prototype.resort = function (evt, offset) {
        var _this = this;
        evt.preventDefault();
        if (!offset) {
            _.each(this.models, function (item, index) {
                _this.$recipe.patch({ ID: item.ID, Sort: index + 1 }).subscribe(function (res) {
                    var data = res.json();
                    item.Sort = data.Sort;
                }, function (error) {
                    oms_config_1.Oms.showMsg("resort failed");
                });
            });
        }
        else {
            var rs = _.filter(this.models, function (item) { return item.selected; });
            _.each(rs, function (item, index) {
                var cur = _.indexOf(_this.models, item);
                console.log(cur);
                if (offset == 1) {
                    if (_this.models[cur + 1]) {
                        _this.models.splice(cur + 2, 0, item);
                        _this.models.splice(cur, 1);
                    }
                }
                else if (offset == -1) {
                    if (_this.models[cur - 1]) {
                        _this.models.splice(cur, 1);
                        _this.models.splice(cur - 1, 0, item);
                    }
                }
            });
        }
        evt.stopPropagation();
    };
    RecipeComponent.prototype.save = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        if (!node)
            return;
        if (!node.status)
            return;
        node.Weight = node.weight;
        console.log(node.deviation);
        node.Deviation = node.deviation;
        node.IsRatio = node.isratio == "true";
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        this.$recipe[_invoke](node).subscribe(function (res) {
            _this.loading = false;
            if (node.status == 'add') {
                var _data = res.json();
                node.UserID = _data.UserID;
                node.ID = _data.ID;
            }
            delete node.weight;
            delete node.deviation;
            delete node.isratio;
            delete node.status;
        }, function (e) {
            _this.loading = false;
            oms_config_1.Oms.showMsg('save failed');
        });
        evt.stopPropagation();
    };
    RecipeComponent.prototype.delete = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        if (!node)
            return;
        if (confirm(oms_config_1.Oms.getText('confirm_delete'))) {
            this.loading = true;
            this.$recipe.delete(node.ID).subscribe(function (res) {
                _this.loading = false;
                _this.models = _.filter(_this.models, function (item) {
                    return item.ID != node.ID;
                });
            }, function (error) {
                _this.loading = false;
                oms_config_1.Oms.showMsg('delete failed');
            });
        }
        evt.stopPropagation();
    };
    RecipeComponent.prototype.deletes = function (evt) {
        var _this = this;
        evt.preventDefault();
        var arr = [];
        _.each(this.models, function (item) {
            if (item.selected)
                arr.push(item.ID);
        });
        if (!arr.length)
            return;
        this.$recipe.deletes(arr).subscribe(function (res) {
            _this.models = _.filter(_this.models, function (item) {
                return !item.selected;
            });
            oms_config_1.Oms.showMsg("delete_success");
        }, function (error) {
            oms_config_1.Oms.showMsg("delete_error");
        });
        evt.stopPropagation();
    };
    RecipeComponent.prototype.filter = function (evt, value) {
        evt.preventDefault();
        this.key = value;
        evt.stopPropagation();
    };
    RecipeComponent.prototype.download = function (evt) {
        evt.preventDefault();
        this.$recipe.download();
    };
    RecipeComponent.prototype.import = function (evt) {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            self.$recipe.import(form).subscribe(function (x) {
                oms_config_1.Oms.showMsg("import_success");
                location.reload();
            }, function (err) {
                if (err.Message)
                    oms_config_1.Oms.showMsg(err.Message.replace(/\|/gi, '\n'));
                else
                    oms_config_1.Oms.showMsg('import_error');
            });
        });
        input.click();
    };
    RecipeComponent.prototype.export = function (evt, doc) {
        evt.preventDefault();
        this.$recipe.export(doc);
    };
    RecipeComponent.prototype.sum = function (reducer, item) {
        return reducer + (item.Weight || 0);
    };
    RecipeComponent = __decorate([
        core_1.Component({
            selector: '.recipe-form',
            templateUrl: 'app/views/formula/recipe.component.html',
            pipes: [filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe, sum_pipe_1.SumPipe],
            providers: [formula_service_1.FormulaService, recipe_service_1.RecipeService, profile_service_1.ProfileService],
            directives: [decimal_directive_1.DecimalDirective]
        }), 
        __metadata('design:paramtypes', [communicate_service_1.CommunicateService, formula_service_1.FormulaService, recipe_service_1.RecipeService, profile_service_1.ProfileService, core_1.ElementRef])
    ], RecipeComponent);
    return RecipeComponent;
}());
exports.RecipeComponent = RecipeComponent;
//# sourceMappingURL=recipe.component.js.map