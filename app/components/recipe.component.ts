/**
 * Created by zero on 7/19/16.
 */
/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { FilterPipe } from '../pipes/filter.pipe';
import { SumPipe } from '../pipes/sum.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';
import { HasPipe } from '../pipes/has.pipe';
import { FormulaService } from '../services/formula.service';
import { MaterialService } from '../services/material.service';
import { RecipeService } from '../services/recipe.service';
import { ProfileService } from '../auth/services/profile.service';
import { CommunicateService } from '../services/communicate.service';
import { Xmeta } from '../xmeta.config';
import { DecimalDirective } from "../directives/decimal.directive";

declare var _: any;
declare var $: any;

@Component({
    selector: '.recipe-form',
    templateUrl: 'app/views/formula/recipe.component.html',
    pipes: [FilterPipe, TranslatePipe, HasPipe, SumPipe],
    providers: [FormulaService, RecipeService, ProfileService],
    directives: [DecimalDirective]
})
export class RecipeComponent {
    key: any;
    models: Array<any>;
    loading: boolean;
    selected: any;
    el: any;
    formula: any;
    isAdmin: boolean;

    constructor(private $communicate: CommunicateService,
        private $formula: FormulaService,
        private $recipe: RecipeService,
        private $profile: ProfileService,
        private elemRef: ElementRef) {
        this.el = elemRef.nativeElement;
        this.sum = _.sum;
        this.loading = false;
        this.formula = {};
        this.isAdmin = this.$profile.isAdmin();

        $communicate.onFormularSelected().subscribe((x: any) => this.switchFormular(x));
        $communicate.onFormularChanged().subscribe((x: any) => this.refreshFormular(x));
        $communicate.onMaterialSelected().subscribe((x: any) => this.joinMaterial(x));
        $communicate.onMaterialChanged().subscribe((x: any) => this.refreshMaterial(x));
        this.models = [];
    }

    select(evt: any, node: any) {
        if (node.selected) {
            delete node.selected;
        } else {
            node.selected = true;
        }
    }

    check(evt: any, input: any) {
        evt.preventDefault();
        console.log('input', input);

        if (!isNaN(Number(input.value)))
            input.value = Math.abs(parseFloat(Number(input.value).toFixed(4)));
    }

    setClass(evt: any, input: any) {
        $(input)[input.validity.valid ? "removeClass" : "addClass"]("has-error");
    }

    IsRatioChanged(evt: any, node: any, v: any) {
        console.log(v, typeof v);
        node.isratio = Boolean(v);
    }

    switchFormular(node: any) {
        this.formula = node;
        this.loading = true;
        this.$recipe.getBy(Xmeta.Category.formula, node.ID).subscribe((res: any) => {
            let _data = res.json();
            let _list = _.filter(_data, function (item: any) {
                return item.FormularID == node.ID;
            });
            this.loading = false;
            this.models = _list;
            return this.loading;
        });
    }

    refreshFormular(node: any) {
        this.formula = node;
    }

    joinMaterial(nodes: any) {
        if (!(this.formula && this.formula.ID)) {
            Xmeta.showMsg('alert_formular_not_selected');
            return;
        }
        if (nodes && nodes.length) {
            nodes.map((x: any) => {
                var m = _.find(this.models, function (item: any) {
                    return item.MaterialID == x.ID;
                });
                if (!m) {
                    var recipe = {
                        ID: Xmeta.CreateGuid(),
                        UserID: this.formula.UserID,
                        FormularID: this.formula.ID,
                        FormularTitle: this.formula.Title,
                        MaterialID: x.ID,
                        MaterialTitle: x.Title,
                        Weight: 0.0,
                        Deviation: 0.0,
                        IsRatio: false,
                        Sort: this.models.length + 1,
                        status: 'add',
                        weight: 0,
                        deviation: 0,
                        isratio: false
                    };
                    // this.models.splice(0, 0, recipe);
                    this.models.push(recipe);
                }
            });

            // var scroller = this.el.querySelector(".autoscroll");
            // scroller.scrollTop = 0;
            

        }
    }

    refreshMaterial(node: any) {
        if (!node) return;
        var m = _.find(this.models, function (item: any) {
            return item.MaterialID == node.ID;
        });
        if (m) {
            m.MaterialTitle = node.Title;
        }
    }

    edit(evt: any, node: any) {
        evt.preventDefault();
        node.weight = node.Weight;
        node.deviation = node.Deviation;
        node.isratio = node.IsRatio ? "true" : "false";
        node.status = 'edit';
        evt.stopPropagation();
    }

    cancel(evt: any, node: any) {
        evt.preventDefault();
        if (node.status == 'add') {
            this.models = _.filter(this.models, function (item: any) {
                return item.ID != node.ID;
            });
        } else {
            delete node.weight;
            delete node.deviation;
            delete node.isratio;
            delete node.status;
        }
        evt.stopPropagation();
    }

    resort(evt: any, offset: number) {
        evt.preventDefault();
        
        if (!offset) {
            _.each(this.models, (item: any, index: number) => {
                this.$recipe.patch({ ID: item.ID, Sort: index + 1 }).subscribe((res: any) => {
                    let data = res.json();
                    item.Sort = data.Sort;
                }, (error: any) => {
                    Xmeta.showMsg("resort failed");
                });
            });
        } else {
            let rs = _.filter(this.models, (item: any) => { return item.selected; });
            _.each(rs, (item: any, index: number) => {
                let cur = _.indexOf(this.models, item);
                    console.log(cur);
                if (offset == 1) {
                    if(this.models[cur + 1]){
                        // let sort = this.models[cur + 1].Sort;
                        // this.models[cur+1].Sort = this.models[cur].Sort;
                        // this.models[cur].Sort = sort;
                        this.models.splice(cur + 2, 0, item);
                        this.models.splice(cur, 1);
                    }
                } else if (offset == -1) {
                    if(this.models[cur - 1]){
                        // let sort = this.models[cur - 1].Sort;
                        // this.models[cur - 1].Sort = this.models[cur].Sort;
                        // this.models[cur].Sort = sort;
                        this.models.splice(cur, 1);
                        this.models.splice(cur - 1, 0, item);
                    }
                }
            });
        }

        evt.stopPropagation();
    }

    save(evt: any, node: any) {
        evt.preventDefault();
        if (!node) return;
        if (!node.status) return;
        node.Weight = node.weight;
        console.log(node.deviation);
        node.Deviation = node.deviation;
        node.IsRatio = node.isratio == "true";
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        this.$recipe[_invoke](node).subscribe((res: any) => {
            this.loading = false;
            if (node.status == 'add') {
                let _data = res.json();
                node.UserID = _data.UserID;
                node.ID = _data.ID;
            }
            delete node.weight;
            delete node.deviation;
            delete node.isratio;
            delete node.status;
        }, (e: any) => {
            this.loading = false;
            Xmeta.showMsg('save failed');
        });
        evt.stopPropagation();
    }

    delete(evt: any, node: any) {
        evt.preventDefault();
        if (!node) return;
        if (confirm(Xmeta.getText('confirm_delete'))) {
            this.loading = true;
            this.$recipe.delete(node.ID).subscribe((res: any) => {
                this.loading = false;
                this.models = _.filter(this.models, function (item: any) {
                    return item.ID != node.ID;
                });
            }, (error: any) => {
                this.loading = false;
                Xmeta.showMsg('delete failed');
            });
        }
        evt.stopPropagation();
    }

    deletes(evt: any) {
        evt.preventDefault();
        let arr: Array<any> = [];
        _.each(this.models, function (item: any) {
            if (item.selected) arr.push(item.ID);
        });
        if (!arr.length) return;
        this.$recipe.deletes(arr).subscribe((res: any) => {
            this.models = _.filter(this.models, function (item: any) {
                return !item.selected;
            });
            Xmeta.showMsg("delete_success");
        }, (error: any) => {
            Xmeta.showMsg("delete_error");
        });
        evt.stopPropagation();
    }

    filter(evt: any, value: any) {
        evt.preventDefault();
        this.key = value;
        evt.stopPropagation();
    }

    download(evt: any) {
        evt.preventDefault();
        this.$recipe.download();
    }

    import(evt: any) {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', function (e: any) {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            self.$recipe.import(form).subscribe((x: any) => {
                Xmeta.showMsg("import_success");
                location.reload();
            }, (err: any) => {
                if (err.Message) Xmeta.showMsg(err.Message.replace(/\|/gi, '\n'));
                else Xmeta.showMsg('import_error');
            });
        });
        input.click();
    }

    export(evt: any, doc: any) {
        evt.preventDefault();
        this.$recipe.export(doc);
        //evt.stopPropagation();
    }

    sum(reducer: any, item: any) {
        return reducer + (item.Weight || 0);
    }


}