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
var scale_service_1 = require("./scale.service");
var formula_service_1 = require("../services/formula.service");
var recipe_service_1 = require("../services/recipe.service");
var grep_pipe_1 = require("../pipes/grep.pipe");
var filter_pipe_1 = require("../pipes/filter.pipe");
var i18n_pipe_1 = require("../pipes/i18n.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("../components/navbar.component");
var navheader_component_1 = require("../components/navheader.component");
var formula_component_1 = require("../components/formula.component");
var ScaleComponent = (function () {
    function ScaleComponent($scale, $formula, $recipe, $router, $loader) {
        var _this = this;
        this.$scale = $scale;
        this.$formula = $formula;
        this.$recipe = $recipe;
        this.$router = $router;
        this.$loader = $loader;
        this.formulas = [];
        this.bean = { date: null };
        this.users = [];
        this.scales = [];
        this.search = { Key: 'MissionID', Value: 0 };
        this.scales = [];
        this.cache = [];
        this.selected = {};
        this.loading = true;
        this.timer = {};
        this.current = 0;
        this.$formula.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.formulas = _data.list;
        }, function (error) {
            _this.loading = false;
        });
        this.$scale.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.scales = _data.list;
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
    }
    ScaleComponent.prototype.mark = function (node, status) {
        var _this = this;
        var statusCode = -2;
        switch (status) {
            case 'heartbeat':
                statusCode = -1;
                break;
            case 'offline':
                statusCode = 0;
                break;
            case 'idle':
                statusCode = 1;
                break;
            case 'working':
                statusCode = 2;
                break;
            case 'pause':
                statusCode = 4;
                break;
            case 'cancel':
                statusCode = 8;
                break;
        }
        if (statusCode > -2) {
            this.$scale.mark(node, statusCode).subscribe(function (res) {
                var _data = res.json();
                var _index = _.findIndex(_this.scales, { ID: _data.ID });
                if (_index >= 0) {
                    _this.scales.splice(_index, 1, _data);
                }
            }, function (err) {
                oms_config_1.Oms.showMsg('error');
                return;
            });
        }
    };
    ScaleComponent.prototype.selectScale = function (task, scale) {
        if (!task.$.selected)
            return;
        if (scale.Status == 1) {
            if (_.find(task.$.selected.Scales, { ID: scale.ID })) {
                task.$.selected.Scales = _.filter(task.$.selected.Scales, function (item) { return item.ID != scale.ID; });
                scale.MissionID = '';
                scale.MissionDetailID = '';
                scale.RecipeID = '';
                scale.MaterialTitle = '';
                delete scale.Weight;
            }
            else if (!scale.RecipeID || scale.RecipeID == "00000000-0000-0000-0000-000000000000") {
                scale.MissionID = task.ID;
                scale.MissionDetailID = task.$.selected.ID;
                scale.Weight = task.$.selected.StandardWeight - task.$.selected.Weight;
                scale.RecipeID = task.$.selected.RecipeID;
                scale.MaterialTitle = task.$.selected.MaterialTitle;
                task.$.selected.Scales.push(scale);
            }
        }
    };
    ScaleComponent.prototype._getMissionStatusTitle = function (status) {
        var result = 'unassigned';
        if (status == 1) {
            result = 'working';
        }
        else if (status == 2) {
            result = 'accomplished';
        }
        return result;
    };
    ScaleComponent.prototype._getDetailStatusTitle = function (status) {
        var result = 'ready';
        if (status == 1) {
            result = 'weighing';
        }
        else if (status == 2) {
            result = 'accomplished';
        }
        return result;
    };
    ScaleComponent.prototype._getScaleStatusTitle = function (status) {
        var result = 'offline';
        if (status == 1) {
            result = 'idle';
        }
        else if (status == 2) {
            result = 'working';
        }
        else if (status == 4) {
            result = 'pause';
        }
        else if (status == 8) {
            result = 'cancel';
        }
        return result;
    };
    ScaleComponent.prototype.deleteMission = function (node) {
        var _this = this;
        var msg = oms_config_1.Oms.getText('cancel mission');
        if (!confirm(msg + "?"))
            return;
        this.$scale.delete(node.ID).subscribe(function (res) {
            _.each(_this.scales, function (item) {
                if (item.MissionID == node.ID) {
                    delete item.Weight;
                    item.RecipeID = '';
                    item.MissionDetailID = '';
                    item.MissionID = '';
                    item.MaterialTitle = '';
                    item.Status = 1;
                    item.StatusTitle = _this._getScaleStatusTitle(item.Status);
                }
            });
            _this.scales = _.filter(_this.scales, function (item) { return item.ID != node.ID; });
        }, function (err) {
            oms_config_1.Oms.showMsg('error');
        });
    };
    ScaleComponent.prototype.edit = function (evt, node) {
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
    ScaleComponent.prototype.cancel = function (evt, node) {
        evt.preventDefault();
        if (node.status == 'add') {
            if (this.selected && this.selected.ID == node.ID)
                this.selected = {};
            this.formulas = _.filter(this.formulas, function (item) {
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
    ScaleComponent.prototype.action = function (scale, act) {
        var _this = this;
        var bean = {};
        switch (act) {
            case 'pause':
                bean.Status = 4;
                break;
            case 'play':
                bean.Status = 2;
                break;
            case 'stop':
                bean.Status = 8;
                break;
        }
        this.$scale.patch(scale.ID, bean).subscribe(function (res) {
            scale.Status = bean.Status;
            scale.StatusTitle = _this._getScaleStatusTitle(bean.Status);
            oms_config_1.Oms.showMsg('success');
        }, function (err) {
            oms_config_1.Oms.showMsg('success');
        });
    };
    ScaleComponent.prototype.save = function (evt, node) {
        var _this = this;
        evt.preventDefault();
        if (!node || !node.status)
            return;
        var arr = _.filter(this.formulas, function (item) {
            return item.ID != node.ID && (item.ID == node.id || item.Title.toLowerCase() == node.title.toLowerCase());
        });
        if (arr.length >= 1) {
            oms_config_1.Oms.showMsg('alert_duplication_code_or_title');
            return;
        }
        node.Title = node.title;
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        this.$scale[_invoke](node).subscribe(function (res) {
            _this.loading = false;
            if (node.status == 'add') {
                var _data = res.json();
                node.ID = _data.ID;
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
    ScaleComponent.prototype.refresh = function () {
        var _this = this;
        this.$scale.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.scales = _data.list;
            console.log(_this.scales);
            _.each(_this.scales, function (item) {
                item.$ = {};
            });
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
        this.$scale.all().subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.scales = _data.list;
            _this.cache = Object.assign({}, _this.scales);
        }, function (error) {
            _this.loading = false;
            if (error.status == 401)
                _this.$router.navigate(['/login']);
        });
    };
    ScaleComponent.prototype.ngOnChanges = function (changes) {
        console.log('change', changes);
    };
    ScaleComponent.prototype.diagnostic = function () {
        return JSON.stringify(this.formulas);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ScaleComponent.prototype, "search", void 0);
    ScaleComponent = __decorate([
        core_1.Component({
            selector: 'my-scale',
            templateUrl: 'app/scale/scale.component.html',
            pipes: [grep_pipe_1.GrepPipe, filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe, i18n_pipe_1.I18nPipe],
            providers: [scale_service_1.ScaleService, formula_service_1.FormulaService, recipe_service_1.RecipeService, scale_service_1.ScaleService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent, formula_component_1.FormulaComponent],
            inputs: ['search']
        }), 
        __metadata('design:paramtypes', [scale_service_1.ScaleService, formula_service_1.FormulaService, recipe_service_1.RecipeService, router_1.Router, core_1.DynamicComponentLoader])
    ], ScaleComponent);
    return ScaleComponent;
}());
exports.ScaleComponent = ScaleComponent;
//# sourceMappingURL=scale.component.js.map