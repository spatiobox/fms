/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, DynamicComponentLoader, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { Xmeta } from '../xmeta.config';
import { ProfileService } from "../auth/services/profile.service";
import { ScaleService } from "./scale.service";
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
    selector: 'my-scale',
    templateUrl: 'app/scale/scale.component.html',
    pipes: [GrepPipe, FilterPipe, TranslatePipe, HasPipe, I18nPipe],
    providers: [ScaleService, FormulaService, RecipeService, ScaleService],
    directives: [NavbarComponent, NavheaderComponent, FormulaComponent],
    inputs: ['search']
})

export class ScaleComponent implements OnChanges {
    key: any;
    formulas: Array<any>;
    orgs: Array<any>;
    loading: boolean;
    selected: any;
    el: any;
    formula: any;
    bean: any;
    users: Array<any>;
    scales: Array<any>;
    cache: Array<any>;
    timer: any;
    asyncScale: Observable<any>;
    //当前标签的序号
    current: any;

    @Input()
    search: any;


    constructor(private $scale: ScaleService, private $formula: FormulaService, private $recipe: RecipeService, private $router: Router, private $loader: DynamicComponentLoader) {
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
        this.$formula.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.formulas = _data.list;
        }, (error: any) => {
            this.loading = false;
        });

        this.$scale.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.scales = _data.list;

        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        });

    }

    mark(node: any, status: string) {
        let statusCode = -2;
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
            this.$scale.mark(node, statusCode).subscribe((res: any) => {
                let _data = res.json();
                let _index = _.findIndex(this.scales, { ID: _data.ID });
                if(_index>= 0){
                    this.scales.splice(_index, 1, _data);
                }
            }, (err: any) => {
                Xmeta.showMsg('error');
                return;
            });
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
        // console.log('recipe selected', node);
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
        this.$scale.delete(node.ID).subscribe((res: any) => {
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
            this.scales = _.filter(this.scales, (item: any) => { return item.ID != node.ID; });
            // let _data = res.json();
            // this.scales.push(_data);
            // console.log(_data);
        }, (err: any) => {
            Xmeta.showMsg('error');
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
        // console.log(node);

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
        this.$scale[_invoke](node).subscribe((res: any) => {
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
    //         this.$scale.delete(node.ID).subscribe((res: any) => {
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
    //     this.$scale.deletes(arr).subscribe((res: any) => {
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
    //     this.$scale.download();
    // }

    // export(evt: any, doc: any) {
    //     evt.preventDefault();
    //     this.$scale.export(doc);
    //     evt.stopPropagation();
    // }

    refresh() {

        this.$scale.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.scales = _data.list;

            console.log(this.scales)
            _.each(this.scales, (item: any) => {
                item.$ = {};
            });
        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        });
        // this.asyncScale = Observable.interval(1000).startWith(0)
        // this.asyncScale = Observable.create((observer: any, b:any) => {
        //     console.log('ob', observer);
        //     console.log('b', b);
        //     setTimeout((t) => {
        //         console.log('t', t);
        //         this.$scale.get('4CAC304A-59DD-4983-8A4D-5D16F22BD2FE').subscribe((res: any) => {
        //             let _data = res.json();
        //             console.log('async', _data);
        //             observer.next(_data);
        //             observer.complete();

        //         });
        //     }, 1000);
        // });
        this.$scale.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.scales = _data.list;
            this.cache = Object.assign({}, this.scales);
            // _.each(this.scales, (item: any) => {
            //     item.StatusTitle = this._getScaleStatusTitle(item.Status);
            // })
            // console.log('scales', _data); 

        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        });
    }

    ngOnChanges(changes: any) {
        console.log('change', changes);
    }

    // TODO: Remove this when we're done
    diagnostic() {
        return JSON.stringify(this.formulas);
    }

}
