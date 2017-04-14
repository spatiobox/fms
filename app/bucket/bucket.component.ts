/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, DynamicComponentLoader, OnInit, OnDestroy, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { Xmeta } from '../xmeta.config';
import { ProfileService } from "../auth/services/profile.service";
import { BucketService } from "./bucket.service";
import { FormulaService } from "../services/formula.service";
import { GrepPipe } from "../pipes/grep.pipe";
import { FilterPipe } from "../pipes/filter.pipe";
import { I18nPipe } from "../pipes/i18n.pipe";
import { HasPipe } from "../pipes/has.pipe";
import { NavbarComponent } from "../components/navbar.component";
import { NavheaderComponent } from "../components/navheader.component";
import { FormulaComponent } from "../components/formula.component";
import { CommunicateService } from '../services/communicate.service';


declare var _: any;
declare var $: any;

@Component({
    selector: 'my-bucket',
    templateUrl: 'app/bucket/bucket.component.html',
    pipes: [GrepPipe, FilterPipe, TranslatePipe, HasPipe, I18nPipe],
    providers: [BucketService, FormulaService],
    directives: [NavbarComponent, NavheaderComponent, FormulaComponent]
})
export class BucketComponent {
    key: any;
    formulas: Array<any>;
    orgs: Array<any>;
    loading: boolean;
    selected: any;
    el: any;
    formula: any;
    bean: any;
    users: Array<any>;
    cipher: any;


    @Input()
    password: string;

    @Input()
    confirmPassword: string;

    constructor(private $bucket: BucketService, private $communicate: CommunicateService, private $router: Router, private $loader: DynamicComponentLoader) {
        this.orgs = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true;
        this.cipher = {};
        this.$bucket.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.orgs = _data.list;
        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        });
        this.$bucket.cipher().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.cipher = _data;
        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        })


    }

    select(evt: any, node: any) {
        evt.preventDefault();
        if (node.selected) {
            delete node.selected;
        } else {
            node.selected = true;
        }
    }

    add(evt: any) {
        evt.preventDefault();
        var guid = Xmeta.CreateGuid();
        var node = { ID: guid, status: 'add', title: '', Title: '', scale: '', Scale: '', url: '', Url: '' };
        this.selected = node;
        this.orgs.splice(0, 0, this.selected);
        evt.stopPropagation();
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
            this.orgs = _.filter(this.orgs, (item: any) => {
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

    save(evt: any, node: any) {
        evt.preventDefault();
        if (!node || !node.status) return;
        // console.log(node);

        var arr = _.filter(this.orgs, (item: any) => {
            return item.ID != node.ID && (item.ID == node.id || item.Title.toLowerCase() == node.title.toLowerCase());
        });
        if (arr.length >= 1) {
            Xmeta.showMsg('alert_duplication_code_or_title');
            return;
        }

        node.Title = node.title;
        // node.Scale = node.scale;
        // node.Url = node.url;
        // node.ID = node.id;
        var _invoke = node.status == 'add' ? 'post' : 'put';
        this.loading = true;
        let bean: any = {};
        bean.ID = node.ID;
        bean.Scale = node.scale;
        bean.Url = node.url;
        bean.Title = node.title;
        // let bean = Object.assign({}, node);
        // bean.Scale = bean.scale;
        // bean.Url = bean.url;
        // bean.Title = bean.title;
        // delete bean.title;
        // delete bean.scale;
        // delete bean.url;
        this.$bucket[_invoke](bean).subscribe((res: any) => {
            this.loading = false;
            if (node.status == 'add') {
                let _data = res.json();
                node.ID = _data.ID;
                node.Scale = _data.Scale;
                node.Url = _data.Url;
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

    saveCipher(evt: any, node: any) {
        this.$bucket.postCipher(node).subscribe((res: any) => {
            this.loading = false;
            Xmeta.showMsg('save success');
            // }
        }, (error: any) => {
            this.loading = false;
            Xmeta.showMsg('save failed');
        });
    }

    delete(evt: any, node: any) {
        //evt.preventDefault();
        if (!node) return;
        if (confirm(Xmeta.getText('confirm_delete'))) {
            this.loading = true;
            this.$bucket.delete(node.ID).subscribe((res: any) => {
                this.loading = false;
                //let data = res.json();
                this.orgs = _.filter(this.orgs, (item: any) => {
                    return item.ID != node.ID;
                });
                this.orgs[0] && this.select(evt, this.orgs[0]);
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

    deletes(evt: any) {
        evt.preventDefault();
        let arr: Array<any> = [];
        _.each(this.orgs, function (item: any) {
            if (item.selected) arr.push(item.ID);
        });
        if (!arr.length) return;
        if (!confirm(Xmeta.getText('confirm_delete'))) return;
        this.$bucket.deletes(arr).subscribe((res: any) => {
            this.orgs = _.filter(this.orgs, function (item: any) {
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
        this.$bucket.download();
    }

    export(evt: any, doc: any) {
        evt.preventDefault();
        this.$bucket.export(doc);
        evt.stopPropagation();
    }

    // TODO: Remove this when we're done
    diagnostic() {
        return JSON.stringify(this.orgs);
    }

}
