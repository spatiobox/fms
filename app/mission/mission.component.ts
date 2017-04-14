/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, DynamicComponentLoader, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { Xmeta } from '../xmeta.config';
import { ProfileService } from "../auth/services/profile.service";
import { MissionService } from "./mission.service";
import { ScaleService } from "../scale/scale.service";
import { FormulaService } from "../services/formula.service";
import { RecipeService } from "../services/recipe.service";
import { GrepPipe } from "../pipes/grep.pipe";
import { FilterPipe } from "../pipes/filter.pipe";
import { I18nPipe } from "../pipes/i18n.pipe";
import { HasPipe } from "../pipes/has.pipe";
import { NavbarComponent } from "../components/navbar.component";
import { NavheaderComponent } from "../components/navheader.component";
import { FormulaComponent } from "../components/formula.component";
import { CommunicateService } from '../services/communicate.service';
import { Observable, Subscriber } from 'rxjs/Rx';
// import { MomentModule } from 'angular2-momnet';


declare var _: any;
declare var $: any;
declare var moment: any;

@Component({
    selector: 'my-mission',
    templateUrl: 'app/mission/mission.component.html',
    pipes: [GrepPipe, FilterPipe, TranslatePipe, HasPipe, I18nPipe],
    providers: [MissionService, FormulaService, RecipeService, ScaleService],
    directives: [NavbarComponent, NavheaderComponent, FormulaComponent],
    inputs: ['search']
})

export class MissionComponent implements OnChanges {
    key: any;
    formulas: Array<any>;
    orgs: Array<any>;
    loading: boolean;
    selected: any;
    el: any;
    formula: any;
    bean: any;
    users: Array<any>;
    missions: Array<any>;
    // scales: Array<any>;
    scales: Array<any>;
    cache: Array<any>;
    timer: any;
    asyncScale: Observable<any>;
    //当前标签的序号
    current: any;

    @Input()
    search: any;


    constructor(private $mission: MissionService, private $formula: FormulaService, private $recipe: RecipeService, private $scale: ScaleService, private $router: Router, private $loader: DynamicComponentLoader) {
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
        this.$formula.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.formulas = _data.list;
        }, (error: any) => {
            this.loading = false;
        });
        this.$mission.all(Xmeta.Category.missiondetail).subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.missions = _data.list;
            this.search.Value = (this.missions[0] || {}).ID;

            _.each(this.missions, (item: any) => {
                item.$ = {};
                //如果任务未派工，则进行按派工记录分配台秤
                if (item.Status == 0) {
                    this.bindScales(item);
                }

                if (item.Status == 1) {
                    let _list = _.filter(item.MissionDetails, (detail: any) => { return detail.Status == 1 && detail.Scales.length; });
                    let _recipes = _.map(_list, 'RecipeID');
                    this.spy(item, _recipes);
                }
            });
        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        });
        this.$scale.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.scales = _data.list;
            this.cache = Object.assign({}, this.scales);
            

        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        }); 
    }

    /**
     * 選擇要派工的物料
     */
    selectRecipe(task: any, detail: any) {
        //任务已取消，不能进行选择
        // if (task.Status == 8) return;

        //当配方明细的物料状态是准备（未开始）状态时，才可以进行台秤分配
        if (detail.Status != 2) {
            task.$.selected = detail;
        }
    }

    filter(list: Array<any>, status: any): Array<any> {
        if (status === null) {
            return this.scales = Object.assign({}, this.cache);
        } else {
            return _.filter(this.cache, (item: any) => { return item.Status === status; });
        }
    }

    /**
     * 选择物料所分配的台秤
     */
    selectScale(task: any, scale: any) {
        if (!task.$.selected) return;
        if (scale.Status == 1) {
            if (_.find(task.$.selected.Scales, { ID: scale.ID })) {
                // task.$.selected.ScaleID = '';
                // task.$.selected.Scales.push();
                task.$.selected.Scales = _.filter(task.$.selected.Scales, (item: any) => { return item.ID != scale.ID });
                scale.MissionID = '';
                scale.MissionDetailID = '';
                scale.RecipeID = '';
                scale.MaterialTitle = '';
                delete scale.Weight;
            } else if (!scale.RecipeID || scale.RecipeID == "00000000-0000-0000-0000-000000000000") {
                scale.MissionID = task.ID;
                scale.MissionDetailID = task.$.selected.ID;
                scale.Weight = task.$.selected.StandardWeight - task.$.selected.Weight;
                scale.RecipeID = task.$.selected.RecipeID;
                scale.MaterialTitle = task.$.selected.MaterialTitle;
                task.$.selected.Scales.push(scale);
            }

        }
    }


    _getMissionStatusTitle(status: any) {
        // 0: 未派工, 1: 派工中, 2: 已完成
        let result = 'unassigned';
        if (status == 1) {
            result = 'working';
        } else if (status == 2) {
            result = 'accomplished';
        }
        return result;
    }

    _getDetailStatusTitle(status: any) {
        // 0：未开始，1：称重中， 2，已完成
        let result = 'ready';
        if (status == 1) {
            result = 'weighing';
        } else if (status == 2) {
            result = 'accomplished';
        }

        return result;
    }
    _getScaleStatusTitle(status: any) {
        // 0: 离线，1：空闲，2：工作中，4：暂停任务
        let result = 'offline';
        if (status == 1) {
            result = 'idle';
        } else if (status == 2) {
            result = 'working';
        } else if (status == 4) {
            result = 'pause';
        } else if (status == 8) {
            result = 'cancel';
        }

        return result;
    }


    /**
     * 新增任务
     * 
     * @param {*} node
     * 
     * @memberOf MissionComponent
     */
    addMission(node: any) {

        let _task = {
            ID: Xmeta.CreateGuid(),
            Title: node.Title,
            FormularID: node.ID,
            IsTeamwork: false,
            TeamID: '',
            IsAutomatic: false,
            MissionDetails: [] as (Array<any>),
            Status: 0,
            /** 存储状态相关 */
            $: {},
            CreateDate: new Date()
        };

        this.$mission.post(_task).subscribe((res: any) => {
            let _data = res.json();
            _data.$ = {};
            this.missions.push(_data);
            this.bindScales(_data);

        }, (err: any) => {
            Xmeta.showMsg('error');
        });
    }

    /**
     * 绑定派工记录
     * 
     * @param {*} node
     * 
     * @memberOf MissionComponent
     */
    bindScales(task: any) {
        this.$mission.getTaskRecord(task.ID).subscribe((res: any) => {
            let _data = res.json();

            _.each(_data, (rec: any, index: number) => {
                let scale = _.find(this.scales, { ID: rec.ScaleID });
                let detail = _.find(task.MissionDetails, { RecipeID: rec.RecipeID });

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
        }, (err: any) => { });
    }

    addMissionDetail(task: any, list: any) {
        // task.MissionDetails = [];
        _.each(list, (item: any) => {
            task.MissionDetails.push({
                ID: Xmeta.CreateGuid(),
                MissionID: task.ID,
                RecipeID: item.ID,
                Scales: [],
                Weight: 0, //已称重
                Status: 0,
                StatusTitle: this._getDetailStatusTitle(0),
                StandardWeight: item.Weight,
                Deviation: item.Deviation,
                IsRatio: item.IsRatio,
                DeviationWeight: item.DeviationWeight,
                MaterialID: item.MaterialID,
                MaterialTitle: item.MaterialTitle
            });
        });
        return task;
    }


    /**
     * 删除任务
     * 
     * @param {*} node
     * @returns
     * 
     * @memberOf MissionComponent
     */
    deleteMission(node: any) {
        let msg = Xmeta.getText('cancel mission');
        if (!confirm(msg + "?")) return;
        this.$mission.delete(node.ID).subscribe((res: any) => {
            // let _data = res.json();
            _.each(this.scales, (item: any) => {
                if (item.MissionID == node.ID) {
                    delete item.Weight;
                    item.RecipeID = '';
                    item.MissionDetailID = '';
                    item.MissionID = '';
                    item.MaterialTitle = '';
                    item.Status = 1;
                    item.StatusTitle = this._getScaleStatusTitle(item.Status);
                }
            });
            this.missions = _.filter(this.missions, (item: any) => { return item.ID != node.ID; });
            // let _data = res.json();
            // this.missions.push(_data);

        }, (err: any) => {
            Xmeta.showMsg('error');
        });
    }


    /**
     * 派工
     * 
     * @param {*} task
     * @returns
     * 
     * @memberOf MissionComponent
     */
    dispatch(task: any) {
        /**
         * 1. 變更mission， missiondetail， scale表的狀態，重量
         * 2. 當detail處於完成狀態時，不可以選中
         * 3. 超出detail的標準重量時，不可以分配通過
         * 4. 臺稱在非空閒狀態時，不可以分配
         */
        let _list = _.filter(task.MissionDetails, (item: any) => { return item.Status != 2 && item.Scales.length; });
        if (!_list.length) {
            Xmeta.showMsg('unassigned');
            return;
        }
        let _scales = _.filter(this.scales, (item: any) => { return item.Status == 1 && item.MissionID == task.ID; });
        if (!_scales.length) {
            Xmeta.showMsg('unassigned');
            return;
        }
        let msgs: Array<string> = [];

        //
        let recipe_ids: Array<string> = [];
        _.each(_list, (item: any) => {

            item.CreateDate = new Date();
            //标准重量
            let _std = item.StandardWeight;

            //已分配的重量
            let _allocate = _.sumBy(item.Scales, 'Weight') + item.Weight;

            if (_allocate > _std) {
                let _over_allocate_msg = Xmeta.getText('over_allocate').replace('${title}', item.MaterialTitle);
                msgs.push(_over_allocate_msg);
                // return false;  //不继续循环 break;
                return true; //继续循环 continue
            }
            recipe_ids.push(item.RecipeID);
        });
        if (msgs.length) {
            Xmeta.showMsg(msgs.join('\n'));
            return;
        }

        this.$mission.dispatch(task).subscribe((res: any) => {
            let _data = res.json();
            task.Status = _data.Status;
            task.StatusTitle = _data.StatusTitle;
            task.MissionDetails = _data.MissionDetails;

            let _scales_in_working: Array<any> = [];
            _.each(this.scales, (item: any) => {
                if (item.Status == 1 && _.includes(recipe_ids, item.RecipeID)) {
                    item.Status = 2;
                    item.StatusTitle = this._getScaleStatusTitle(item.Status);

                    _scales_in_working.push(item.ID);
                }
            });

            this.spy(task, recipe_ids);

            Xmeta.showMsg("success");
        }, (err: any) => {
            Xmeta.showMsg("error");
            _.each(this.scales, (item: any) => {
                if (item.Status == 2 && _.includes(recipe_ids, item.RecipeID)) {
                    item.Status = 1;
                    item.StatusTitle = this._getScaleStatusTitle(item.Status);
                }
            });
        });
    }


    /**
     * 监视任务单的状态
     * 
     * @param {*} task 
     * @param {Array<any>} recipes 
     * 
     * @memberOf MissionComponent
     */
    spy(task: any, recipes: Array<any>) {
        if (!recipes.length) return;
        _.each(recipes, (item: any) => {
            // let _detail = _.find(task.MissionDetails, { RecipeID: item });

            /** 臺稱索引號 */
            let _idx = _.findIndex(task.MissionDetails, { RecipeID: item });
            let _scales = _.map(task.MissionDetails[_idx].Scales, 'ID');

            if (_scales.length) {
                (this.timer[task.ID] || (this.timer[task.ID] = {}))[task.MissionDetails[_idx].ID] = setInterval(() => {
                    task.MissionDetails[_idx]._loading = true;
                    this.$mission.spy(task.MissionDetails[_idx].ID, _scales).subscribe((res: any) => {
                        task.MissionDetails[_idx]._loading = false;
                        let _data = res.json();
                        
                        task.MissionDetails.splice(_idx, 1, _data.Model);
                        _.each(_data.Scales, (node: any) => {
                            let _index = _.findIndex(this.scales, { 'ID': node.ID });
                            if (_index > -1) {
                                this.scales.splice(_index, 1, node);
                            }
                        });

                        // this.scales = _.filter(this.scales, (x: any) => { return !_.includes(_scales, x.ID); });
                        // this.scales = this.scales.concat(_data.Scales);

                        if (!task.MissionDetails[_idx].Scales.length) {
                            clearInterval(this.timer[task.ID][task.MissionDetails[_idx].ID]);
                        }
                    }, err => {
                        task.MissionDetails[_idx]._loading = false;
                        clearInterval(this.timer[task.ID][task.MissionDetails[_idx].ID]);
                    });
                }, 10000);
            }
        });
    }

    edit(evt: any, node: any) {
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
    }

    cancel(evt: any, node: any) {
        evt.preventDefault();
        // if (!node || !node.ID) return;
        if (node.status == 'add') {
            if (this.selected && this.selected.ID == node.ID) this.selected = {};
            this.formulas = _.filter(this.formulas, (item: any) => {
                return item.ID != node.ID;
            });

        } else {
            // delete node.id;
            // delete node.title;
            // delete node.scale;
            // delete node.url;
            // delete node.status;

            for (var p in node) {
                if (/^[a-z].*?/.test(p)) {
                    delete node[p];
                }
            }
        }
        evt.stopPropagation();
    }

    action(scale: any, act: any) {
        let bean: any = {};

        switch (act) {
            case 'pause':
                bean.Status = 4;
                break;
            case 'play':
                bean.Status = 2;
                break;
            case 'stop': //cancel
                bean.Status = 8;
                break;
        }
        this.$scale.patch(scale.ID, bean).subscribe((res: any) => {
            scale.Status = bean.Status;
            scale.StatusTitle = this._getScaleStatusTitle(bean.Status);
            Xmeta.showMsg('success');
        }, (err: any) => {
            Xmeta.showMsg('success');
        })
    }

    save(evt: any, node: any) {
        evt.preventDefault();
        if (!node || !node.status) return;

        var arr = _.filter(this.formulas, (item: any) => {
            return item.ID != node.ID && (item.ID == node.id || item.Title.toLowerCase() == node.title.toLowerCase());
        });
        if (arr.length >= 1) {
            Xmeta.showMsg('alert_duplication_code_or_title');
            return;
        }

        node.Title = node.title;
        // node.ID = node.id;
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        this.$mission[_invoke](node).subscribe((res: any) => {
            this.loading = false;
            if (node.status == 'add') {
                let _data = res.json();
                node.ID = _data.ID;
            }
            // delete node.title;
            // delete node.id;
            // delete node.scale;
            // delete node.url;
            // delete node.status;

            for (var p in node) {
                if (/^[a-z].*?/.test(p)) {
                    delete node[p];
                }
            }
            this.selected = node;
            // if (!this.selected.status) {
            //     this.$communicate.emitFormularSelected(node);
            // }
        }, (error: any) => {
            this.loading = false;
            Xmeta.showMsg('save failed');
        });
        evt.stopPropagation();
    }

    // delete(evt: any, node: any) {
    //     //evt.preventDefault();
    //     if (!node) return;
    //     if (confirm(Xmeta.getText('confirm_delete'))) {
    //         this.loading = true;
    //         this.$mission.delete(node.ID).subscribe((res: any) => {
    //             this.loading = false;
    //             //let data = res.json();
    //             this.formulas = _.filter(this.formulas, (item: any) => {
    //                 return item.ID != node.ID;
    //             });
    //             this.formulas[0] && this.select(evt, this.formulas[0]);
    //             Xmeta.showMsg('delete_success');
    //         }, (error: any) => {
    //             this.loading = false;
    //             var msg = error.json();
    //             if (msg.Message) alert(msg.Message);
    //             else Xmeta.showMsg("alert_delete_error");
    //         });
    //     }
    //     evt.stopPropagation();
    // }

    // deletes(evt: any) {
    //     evt.preventDefault();
    //     let arr: Array<any> = [];
    //     _.each(this.formulas, function (item: any) {
    //         if (item.selected) arr.push(item.ID);
    //     });
    //     if (!arr.length) return;
    //     if (!confirm(Xmeta.getText('confirm_delete'))) return;
    //     this.$mission.deletes(arr).subscribe((res: any) => {
    //         this.formulas = _.filter(this.formulas, function (item: any) {
    //             return !item.selected;
    //         });
    //         Xmeta.showMsg("delete_success");
    //     }, (error: any) => {
    //         let info = error.json();

    //         if (info.Message && info.Message.indexOf(':') >= 0) {
    //             let alarm = '';
    //             var msgs = info.Message.split('|');
    //             _.forEach(msgs, (str: any) => {
    //                 let srr = str.split(':');
    //                 alarm += Xmeta.getText('delete_materials_already_used').replace('{0}', srr[0]).replace('{1}', srr[1]) + '\n';
    //             })
    //             alarm = Xmeta.getText('delete_error') + ':\n' + alarm;
    //             alert(alarm);
    //         }
    //         else
    //             Xmeta.showMsg("delete_error");
    //     });
    //     evt.stopPropagation();

    // }

    // filter(evt: any, value: any) {
    //     evt.preventDefault();
    //     this.key = value;
    //     evt.stopPropagation();
    // }

    // download(evt: any) {
    //     evt.preventDefault();
    //     this.$mission.download();
    // }

    // export(evt: any, doc: any) {
    //     evt.preventDefault();
    //     this.$mission.export(doc);
    //     evt.stopPropagation();
    // }

    refresh() {

        this.$mission.all(Xmeta.Category.missiondetail).subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.missions = _data.list;


            _.each(this.missions, (item: any) => {
                item.$ = {};
            });
        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        }); 
        this.$scale.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.scales = _data.list;
            this.cache = Object.assign({}, this.scales);
            // _.each(this.scales, (item: any) => {
            //     item.StatusTitle = this._getScaleStatusTitle(item.Status);
            // })


        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        });
    }

    ngOnChanges(changes: any) {

    }

    // TODO: Remove this when we're done
    diagnostic() {
        return JSON.stringify(this.formulas);
    }

}
