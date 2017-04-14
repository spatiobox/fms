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
var mission_service_1 = require("./mission.service");
var scale_service_1 = require("../scale/scale.service");
var formula_service_1 = require("../services/formula.service");
var recipe_service_1 = require("../services/recipe.service");
var grep_pipe_1 = require("../pipes/grep.pipe");
var filter_pipe_1 = require("../pipes/filter.pipe");
var i18n_pipe_1 = require("../pipes/i18n.pipe");
var has_pipe_1 = require("../pipes/has.pipe");
var navbar_component_1 = require("../components/navbar.component");
var navheader_component_1 = require("../components/navheader.component");
var formula_component_1 = require("../components/formula.component");
var MissionComponent = (function () {
    function MissionComponent($mission, $formula, $recipe, $scale, $router, $loader) {
        var _this = this;
        this.$mission = $mission;
        this.$formula = $formula;
        this.$recipe = $recipe;
        this.$scale = $scale;
        this.$router = $router;
        this.$loader = $loader;
        this.formulas = [];
        this.bean = { date: null };
        this.users = [];
        this.missions = [];
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
        this.$mission.all(oms_config_1.Oms.Category.missiondetail).subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.missions = _data.list;
            _this.search.Value = (_this.missions[0] || {}).ID;
            _.each(_this.missions, function (item) {
                item.$ = {};
                if (item.Status == 0) {
                    _this.bindScales(item);
                }
                if (item.Status == 1) {
                    var _list = _.filter(item.MissionDetails, function (detail) { return detail.Status == 1 && detail.Scales.length; });
                    var _recipes = _.map(_list, 'RecipeID');
                    _this.spy(item, _recipes);
                }
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
    }
    MissionComponent.prototype.selectRecipe = function (task, detail) {
        if (detail.Status != 2) {
            task.$.selected = detail;
        }
    };
    MissionComponent.prototype.filter = function (list, status) {
        if (status === null) {
            return this.scales = Object.assign({}, this.cache);
        }
        else {
            return _.filter(this.cache, function (item) { return item.Status === status; });
        }
    };
    MissionComponent.prototype.selectScale = function (task, scale) {
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
    MissionComponent.prototype._getMissionStatusTitle = function (status) {
        var result = 'unassigned';
        if (status == 1) {
            result = 'working';
        }
        else if (status == 2) {
            result = 'accomplished';
        }
        return result;
    };
    MissionComponent.prototype._getDetailStatusTitle = function (status) {
        var result = 'ready';
        if (status == 1) {
            result = 'weighing';
        }
        else if (status == 2) {
            result = 'accomplished';
        }
        return result;
    };
    MissionComponent.prototype._getScaleStatusTitle = function (status) {
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
    MissionComponent.prototype.addMission = function (node) {
        var _this = this;
        var _task = {
            ID: oms_config_1.Oms.CreateGuid(),
            Title: node.Title,
            FormularID: node.ID,
            IsTeamwork: false,
            TeamID: '',
            IsAutomatic: false,
            MissionDetails: [],
            Status: 0,
            $: {},
            CreateDate: new Date()
        };
        this.$mission.post(_task).subscribe(function (res) {
            var _data = res.json();
            _data.$ = {};
            _this.missions.push(_data);
            _this.bindScales(_data);
        }, function (err) {
            oms_config_1.Oms.showMsg('error');
        });
    };
    MissionComponent.prototype.bindScales = function (task) {
        var _this = this;
        this.$mission.getTaskRecord(task.ID).subscribe(function (res) {
            var _data = res.json();
            _.each(_data, function (rec, index) {
                var scale = _.find(_this.scales, { ID: rec.ScaleID });
                var detail = _.find(task.MissionDetails, { RecipeID: rec.RecipeID });
                if (scale && scale.Status == 1 && detail) {
                    scale.DeviationWeight = rec.DeviationWeight;
                    scale.MaterialTitle = detail.MaterialTitle;
                    scale.MissionDetailID = detail.ID;
                    scale.MissionID = task.ID;
                    scale.RecipeID = rec.RecipeID;
                    scale.Weight = rec.Weight;
                    detail.Scales.push(scale);
                }
            });
        }, function (err) { });
    };
    MissionComponent.prototype.addMissionDetail = function (task, list) {
        var _this = this;
        _.each(list, function (item) {
            task.MissionDetails.push({
                ID: oms_config_1.Oms.CreateGuid(),
                MissionID: task.ID,
                RecipeID: item.ID,
                Scales: [],
                Weight: 0,
                Status: 0,
                StatusTitle: _this._getDetailStatusTitle(0),
                StandardWeight: item.Weight,
                Deviation: item.Deviation,
                IsRatio: item.IsRatio,
                DeviationWeight: item.DeviationWeight,
                MaterialID: item.MaterialID,
                MaterialTitle: item.MaterialTitle
            });
        });
        return task;
    };
    MissionComponent.prototype.deleteMission = function (node) {
        var _this = this;
        var msg = oms_config_1.Oms.getText('cancel mission');
        if (!confirm(msg + "?"))
            return;
        this.$mission.delete(node.ID).subscribe(function (res) {
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
            _this.missions = _.filter(_this.missions, function (item) { return item.ID != node.ID; });
        }, function (err) {
            oms_config_1.Oms.showMsg('error');
        });
    };
    MissionComponent.prototype.dispatch = function (task) {
        var _this = this;
        var _list = _.filter(task.MissionDetails, function (item) { return item.Status != 2 && item.Scales.length; });
        if (!_list.length) {
            oms_config_1.Oms.showMsg('unassigned');
            return;
        }
        var _scales = _.filter(this.scales, function (item) { return item.Status == 1 && item.MissionID == task.ID; });
        if (!_scales.length) {
            oms_config_1.Oms.showMsg('unassigned');
            return;
        }
        var msgs = [];
        var recipe_ids = [];
        _.each(_list, function (item) {
            item.CreateDate = new Date();
            var _std = item.StandardWeight;
            var _allocate = _.sumBy(item.Scales, 'Weight') + item.Weight;
            if (_allocate > _std) {
                var _over_allocate_msg = oms_config_1.Oms.getText('over_allocate').replace('${title}', item.MaterialTitle);
                msgs.push(_over_allocate_msg);
                return true;
            }
            recipe_ids.push(item.RecipeID);
        });
        if (msgs.length) {
            oms_config_1.Oms.showMsg(msgs.join('\n'));
            return;
        }
        this.$mission.dispatch(task).subscribe(function (res) {
            var _data = res.json();
            task.Status = _data.Status;
            task.StatusTitle = _data.StatusTitle;
            task.MissionDetails = _data.MissionDetails;
            var _scales_in_working = [];
            _.each(_this.scales, function (item) {
                if (item.Status == 1 && _.includes(recipe_ids, item.RecipeID)) {
                    item.Status = 2;
                    item.StatusTitle = _this._getScaleStatusTitle(item.Status);
                    _scales_in_working.push(item.ID);
                }
            });
            _this.spy(task, recipe_ids);
            oms_config_1.Oms.showMsg("success");
        }, function (err) {
            oms_config_1.Oms.showMsg("error");
            _.each(_this.scales, function (item) {
                if (item.Status == 2 && _.includes(recipe_ids, item.RecipeID)) {
                    item.Status = 1;
                    item.StatusTitle = _this._getScaleStatusTitle(item.Status);
                }
            });
        });
    };
    MissionComponent.prototype.spy = function (task, recipes) {
        var _this = this;
        if (!recipes.length)
            return;
        _.each(recipes, function (item) {
            var _idx = _.findIndex(task.MissionDetails, { RecipeID: item });
            var _scales = _.map(task.MissionDetails[_idx].Scales, 'ID');
            if (_scales.length) {
                (_this.timer[task.ID] || (_this.timer[task.ID] = {}))[task.MissionDetails[_idx].ID] = setInterval(function () {
                    task.MissionDetails[_idx]._loading = true;
                    _this.$mission.spy(task.MissionDetails[_idx].ID, _scales).subscribe(function (res) {
                        task.MissionDetails[_idx]._loading = false;
                        var _data = res.json();
                        task.MissionDetails.splice(_idx, 1, _data.Model);
                        _.each(_data.Scales, function (node) {
                            var _index = _.findIndex(_this.scales, { 'ID': node.ID });
                            if (_index > -1) {
                                _this.scales.splice(_index, 1, node);
                            }
                        });
                        if (!task.MissionDetails[_idx].Scales.length) {
                            clearInterval(_this.timer[task.ID][task.MissionDetails[_idx].ID]);
                        }
                    }, function (err) {
                        task.MissionDetails[_idx]._loading = false;
                        clearInterval(_this.timer[task.ID][task.MissionDetails[_idx].ID]);
                    });
                }, 10000);
            }
        });
    };
    MissionComponent.prototype.edit = function (evt, node) {
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
    MissionComponent.prototype.cancel = function (evt, node) {
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
    MissionComponent.prototype.action = function (scale, act) {
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
    MissionComponent.prototype.save = function (evt, node) {
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
        this.$mission[_invoke](node).subscribe(function (res) {
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
    MissionComponent.prototype.refresh = function () {
        var _this = this;
        this.$mission.all(oms_config_1.Oms.Category.missiondetail).subscribe(function (res) {
            _this.loading = false;
            var _data = res.json();
            _this.missions = _data.list;
            _.each(_this.missions, function (item) {
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
    MissionComponent.prototype.ngOnChanges = function (changes) {
    };
    MissionComponent.prototype.diagnostic = function () {
        return JSON.stringify(this.formulas);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MissionComponent.prototype, "search", void 0);
    MissionComponent = __decorate([
        core_1.Component({
            selector: 'my-mission',
            templateUrl: 'app/mission/mission.component.html',
            pipes: [grep_pipe_1.GrepPipe, filter_pipe_1.FilterPipe, translate_pipe_1.TranslatePipe, has_pipe_1.HasPipe, i18n_pipe_1.I18nPipe],
            providers: [mission_service_1.MissionService, formula_service_1.FormulaService, recipe_service_1.RecipeService, scale_service_1.ScaleService],
            directives: [navbar_component_1.NavbarComponent, navheader_component_1.NavheaderComponent, formula_component_1.FormulaComponent],
            inputs: ['search']
        }), 
        __metadata('design:paramtypes', [mission_service_1.MissionService, formula_service_1.FormulaService, recipe_service_1.RecipeService, scale_service_1.ScaleService, router_1.Router, core_1.DynamicComponentLoader])
    ], MissionComponent);
    return MissionComponent;
}());
exports.MissionComponent = MissionComponent;
//# sourceMappingURL=mission.component.js.map