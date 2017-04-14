/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { FilterPipe } from '../pipes/filter.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';
import { HasPipe } from '../pipes/has.pipe';
import { MaterialService } from '../services/material.service';
import { CommunicateService } from '../services/communicate.service';
import { Xmeta } from '../xmeta.config';



declare var _: any;


@Component({
    selector: '.material-form',
    templateUrl: 'app/views/formula/material.component.html',
    pipes: [FilterPipe, TranslatePipe, HasPipe],
    providers: [MaterialService]
})
export class MaterialComponent implements OnDestroy {
    key: any;
    models: Array<any>;
    loading: boolean;
    selected: any;
    el: any;

    constructor(private $communicate: CommunicateService, private $material: MaterialService, private elemRef: ElementRef) {
        this.el = elemRef.nativeElement;
        this.models = [];
        this.loading = true;
        this.$material.all().subscribe((res: any) => {
            let _data = res.json();
            this.loading = false;
            this.models = _data.list;
        },
            (error: any) => {
                this.loading = false;
                if (error.status == 401) location.href = '/login';
            });
    }

    select(evt: any, node: any) {
        if (node.selected) {
            delete node.selected;
        } else {
            node.selected = true;
        }
    }

    add(evt: any) {
        evt.preventDefault();
        var node = { status: 'add', title: '', code: '', Title: '', ID: Xmeta.CreateGuid(), Code: '' };
        this.models.splice(0, 0, node);
        evt.stopPropagation();
    }


    edit(evt: any, node: any) {
        evt.preventDefault();
        node.code = node.Code;
        node.title = node.Title;
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
            delete node.code;
            delete node.title;
            delete node.status;
        }
        evt.stopPropagation();
    }

    save(evt: any, node: any) {
        if (!node) return;
        if (!node.status) return;

        var arr = _.filter(this.models, function (item: any) {
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
        this.$material[_invoke](node).subscribe((res: any) => {
            this.loading = false;
            if (node.status == 'add') {
                let _data = res.json();
                node.UserID = _data.UserID;
                node.ID = _data.ID;
            }
            delete node.title;
            delete node.code;
            delete node.status;
        }, (error: any) => {
            this.loading = false;
            Xmeta.showMsg('save failed');
        });
        this.$communicate.emitMaterialChanged(node);
    }

    delete(evt: any, node: any) {
        evt.preventDefault();
        if (!node) return;
        if (confirm(Xmeta.getText('confirm_delete'))) {
            this.loading = true;
            this.$material.delete(node.ID).subscribe((res: any) => {
                this.loading = false;
                //let _data = res.json();
                this.models = _.filter(this.models, function (item: any) {
                    return item.ID != node.ID;
                });
                Xmeta.showMsg('delete_success');
            }, (error) => {
                this.loading = false;
                var msg = error.json();
                if (msg.Message) alert(msg.Message);
                else Xmeta.showMsg("alert_delete_error");
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
        this.$material.deletes(arr).subscribe((res: any) => {
            this.models = _.filter(this.models, function (item: any) {
                return !item.selected;
            });
            Xmeta.showMsg("delete_success");
        }, (error: any) => {
            let info = error.json();

            if (info.Message && info.Message.indexOf(':') >= 0) {
                let alarm = '';
                var msgs = info.Message.split('|');
                _.forEach(msgs, (str: any) => {
                    let srr = str.split(':');
                    alarm += Xmeta.getText('delete_materials_already_used').replace('{0}', srr[0]).replace('{1}', srr[1]) + '\n';
                })
                alarm = Xmeta.getText('delete_error') + ':\n' + alarm;
                alert(alarm);
            }
            else
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
        this.$material.download();
    }

    import(evt: any) {
        let input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', (e: any) => {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            this.$material.import(form).subscribe((res: any) => {
                // let _data = res.json();
                this.models = this.models.concat(res);
                Xmeta.showMsg("import_success");
            }, (err: any) => {
                if (err.Message) alert(err.Message.replace(/\|/gi, '\n'));
                else Xmeta.showMsg('import_error');
            });
        });
        input.click();
    }

    export(evt: any, doc: any) {
        evt.preventDefault();
        this.$material.export(doc);

        //evt.stopPropagation();
    }

    join(evt: Event) {
        evt.preventDefault();
        let hasEditingNode = false;
        let _arr = _.filter(this.models, function (item: any) {
            if (item.selected && item.status) {
                hasEditingNode = true;
                return;
            }
            return item.selected;
        });

        if (hasEditingNode) {
            Xmeta.showMsg('alert_editing_join');
            return;
        }

        if (!_arr || !_arr.length) {
            Xmeta.showMsg('alert_nothing_selected');
            return;
        }

        this.$communicate.emitMaterialSelected(_arr);

        evt.stopPropagation();

    }

    ngOnDestroy() {

    }

}