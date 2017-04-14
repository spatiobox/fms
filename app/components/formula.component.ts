/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { FilterPipe } from '../pipes/filter.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';
import { HasPipe } from '../pipes/has.pipe';
import { FormulaService } from '../services/formula.service';
import { CommunicateService } from '../services/communicate.service';
import { OrganizationService } from '../organization/organization.service';
import { Xmeta } from '../xmeta.config';

declare var _: any;
declare var console: any;

@Component({
    selector: '.formula-form',
    templateUrl: 'app/views/formula/formula.component.html',
    //directives: [ ng.core.UPLOAD_DIRECTIVES ],
    pipes: [FilterPipe, TranslatePipe, HasPipe],
    providers: [FormulaService, OrganizationService]
})
export class FormulaComponent {
    key: any;
    models: Array<any>;
    orgs: Array<any>;
    loading: boolean;
    exporting: boolean;
    selected: any;
    pinOrg: any;
    multiple: any;


    constructor(private $communicate: CommunicateService, private $formula: FormulaService, private $org: OrganizationService) {
        this.key = "";
        this.models = [];
        this.orgs = [];
        this.pinOrg = {};
        this.multiple = [];
        this.loading = true;
        this.exporting = false;
        this.$formula.all().subscribe(res => {
            let data = res.json();
            this.loading = false;
            this.models = data.list;
        }, error => {
            this.loading = false;
            if (error.status == 401) location.href = '/login';
        });
        // var self = this;
        // this.$org.all().subscribe((res:any) => {
        //     let data = res.json();
        //     this.orgs = data.list;
        //     this.pinOrg = this.orgs[0];
        //     if(this.pinOrg.ID){
        //         this.$formula.getBy(Xmeta.Category.organization, this.pinOrg.ID).subscribe((_res:any) => {
        //             this.loading = false;
        //             let _data = _res.json();
        //             this.models = _data;
        //         }, (err:any)=> {
        //             self.loading = false;
        //             if (err.status == 401) location.href = '/login';
        //         });
        //     }
        // }, (error:any)=> { 
        //     this.loading = false;
        //     if (error.status == 401) location.href = '/login';
        // });
        this.selected = {};
    }

    select(evt: any, node: any) {
        evt.preventDefault();
        if (this.selected && this.selected.ID != node.ID && this.selected.status) {
            Xmeta.showMsg('alert_editing_cannot_select');
            evt.stopPropagation();
            return;
        }
        if (!node) return;
        this.selected = node;

        if (!this.selected.status) {
            this.$communicate.emitFormularSelected(node);
        }
    }

    selectOrganization(evt: any, node: any) {
        evt.preventDefault();
        this.pinOrg = node;
        this.loading = true;
        this.$formula.getBy(Xmeta.Category.organization, node.ID).subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.models = _data;
        }, (error: any) => {
            this.loading = false;
        })
    }

    add(evt: any) {
        evt.preventDefault();
        var node = { status: 'add', title: '', code: '', ID: Xmeta.CreateGuid(), Code: '', Title: '', OrgID: this.pinOrg.ID || 0 };
        this.selected = node;
        this.models.splice(0, 0, this.selected);
        evt.stopPropagation();
    }

    remove(evt: any) {
        evt.preventDefault();
        let list = _.filter(this.models, (item: any) => { return item.isChecked; });
        let arr: Array<any> = _.map(list, (item: any) => { return item.ID; });
        if (!arr.length) return;
        console.log(arr);
        if (!confirm(Xmeta.getText('confirm_formular_delete'))) return;
        this.$formula.deletes(arr).subscribe((res: any) => {
            let _data = res.json();
            this.models = _.filter(this.models, function (item: any) {
                return !item.isChecked;
            });
            Xmeta.showMsg("delete_success");
        }, (error: any) => {
            Xmeta.showMsg("delete_error");
        });
        evt.stopPropagation();
    }

    edit(evt: any, node: any) {
        evt.preventDefault();
        if (node.status) {
            return;
        }
        node.code = node.Code;
        node.title = node.Title;
        node.status = 'edit';
        evt.stopPropagation();
    }

    cancel(evt: any, node: any) {
        evt.preventDefault();
        if (!node || !node.ID) return;
        if (node.status == 'add') {
            if (this.selected && this.selected.ID == node.ID) this.selected = {};
            this.models = _.filter(this.models, (item: any) => {
                return item.ID != node.ID;
            });
        } else {
            delete node.code;
            delete node.title;
            delete node.status;
        }
        evt.stopPropagation();
    }

    save(evt: any, node: any) {
        evt.preventDefault();
        if (!node || !node.status) return;


        var arr = _.filter(this.models, (item: any) => {
            return item.ID != node.ID && (item.Code == node.code || item.Title.toLowerCase() == node.title.toLowerCase());
        });
        if (arr.length >= 1) {
            Xmeta.showMsg('alert_duplication_code_or_title');
            return;
        }

        node.Title = node.title;
        node.Code = node.code;
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        this.$formula[_invoke](node).subscribe((res: any) => {
            this.loading = false;
            if (node.status == 'add') {
                let _data = res.json();
                node.UserID = _data.UserID;
                node.ID = _data.ID;
            }
            delete node.title;
            delete node.code;
            delete node.status;
            this.selected = node;
            if (!this.selected.status) {
                this.$communicate.emitFormularSelected(node);
            }
        }, (error: any) => {
            this.loading = false;
            Xmeta.showMsg('save failed');
        });
        evt.stopPropagation();
    }

    delete(evt: any, node: any) {
        //evt.preventDefault();
        if (!node) return;
        if (confirm(Xmeta.getText('confirm_formular_delete'))) {
            this.loading = true;
            this.$formula.delete(node.ID).subscribe((res: any) => {
                this.loading = false;
                //let data = res.json();
                this.models = _.filter(this.models, (item: any) => {
                    return item.ID != node.ID;
                });
                this.models[0] && this.select(evt, this.models[0]);
                Xmeta.showMsg('delete_success');
            }, (error: any) => {
                this.loading = false;
                var msg = error.json();
                if (msg.Message) alert(msg.Message);
                else Xmeta.showMsg("alert_delete_error");
            });
        }
        evt.stopPropagation();
    }

    filter(evt: any, value: any) {
        evt.preventDefault();
        this.key = value;
        evt.stopPropagation();
    }

    download(evt: any) {
        evt.preventDefault();
        this.$formula.download();
    }

    import(evt: any) {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', function (e: any) {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            self.$formula.import(form).subscribe((x: any) => {
                self.models = self.models.concat(x);
                Xmeta.showMsg("import_success");
            },
                (error: any) => {
                    if (error.Message) alert(error.Message.replace(/\|/gi, '\n'));
                    else Xmeta.showMsg('import_error');
                }
            )
                ;
        });
        input.click();
    }

    export(evt: any, doc: any) {
        evt.preventDefault();
        let ids = _.map(_.filter(this.models, { _selected: true }), 'ID');
        this.$formula.export(doc, ids);
        evt.stopPropagation();
    }

    // TODO: Remove this when we're done
    diagnostic() {
        return JSON.stringify(this.models);
    }

}