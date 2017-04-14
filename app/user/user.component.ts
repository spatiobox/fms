/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, DynamicComponentLoader, OnInit, OnDestroy, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { Xmeta } from '../xmeta.config';
import { ProfileService } from "../auth/services/profile.service";
import { UserService } from "./user.service";
import { GrepPipe } from "../pipes/grep.pipe";
import { FilterPipe } from "../pipes/filter.pipe";
import { I18nPipe } from "../pipes/i18n.pipe";
import { HasPipe } from "../pipes/has.pipe";
import { NavbarComponent } from "../components/navbar.component";
import { NavheaderComponent } from "../components/navheader.component";


declare var _: any;
declare var $: any;

@Component({
    selector: 'my-users',
    templateUrl: 'app/user/user.component.html',
    pipes: [GrepPipe, FilterPipe, TranslatePipe, HasPipe, I18nPipe],
    providers: [UserService],
    directives: [NavbarComponent, NavheaderComponent]
})
export class UserComponent {
    key: any;
    models: Array<any>;
    loading: boolean;
    selected: any;
    el: any;
    formula: any;
    bean: any;
    users: Array<any>;

    @Input()
    password: string;

    @Input()
    confirmPassword: string;

    constructor(private $user: UserService, private $router: Router, private $loader: DynamicComponentLoader) {
        this.models = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true;
        this.$user.all().subscribe((res: any) => {
            this.loading = false;
            let _data = res.json();
            this.models = _data.list;
        }, (error: any) => {
            this.loading = false;
            if (error.status == 401) this.$router.navigate(['/login']);
        });


    }

    select(evt: any, node: any) {
        if (node.selected) {
            node.selected = null;
            delete node.selected;
        } else {
            node.selected = true;
        }
    }

    toggle(evt: any, isChecked: any, category: string) {

        _.each(_.filter(this.models, (x: any) => { return x.Status == category; }), function (item: any) {
            if (isChecked) item.selected = true;
            else delete item.selected;
        });
    }

    delete(evt: any, node: any) {
        evt.preventDefault();
        let arr: Array<any> = [];
        arr.push(node.Id);

        if (confirm(Xmeta.getText('confirm_delete'))) {
            this.$user.deletes(arr).subscribe((res: any) => {
                this.models = _.filter(this.models, function (item: any) {
                    return item.Id != node.Id;
                });
                Xmeta.showMsg("delete_success");
            }, (error: any) => {
                var msg = error.json();
                if(msg.Message){
                    Xmeta.showMsg(msg.Message);
                }else
                Xmeta.showMsg("delete_error");
            });
        }
    }

    deletes(evt: any) {
        evt.preventDefault();
        let arr: Array<any> = [];
        _.each(this.models, function (item: any) {
            if (item.selected) arr.push(item.Id);
        });
        if (!arr.length) return;

        if (confirm(Xmeta.getText('confirm_delete'))) {
            this.$user.deletes(arr).subscribe((res: any) => {
                this.models = _.filter(this.models, function (item: any) {
                    return !item.selected;
                });
                Xmeta.showMsg("delete_success");
            }, (error: any) => {
                var msg = error.json();
                if(msg.Message){
                    Xmeta.showMsg(msg.Message);
                }else
                Xmeta.showMsg("delete_error");
            });
        }
    }

    search(evt: any, value: any) {
        evt.preventDefault();
        this.key = value;
    }

    process(evt: any, node: any, isAudit: any) {
        evt.preventDefault();
        this.loading = true;
        this.$user.unlock(node, isAudit ? 1 : -1).subscribe((res: any) => {
            this.loading = false;
            Xmeta.showMsg("success");
            node.Status = isAudit ? 1 : -1;
        }, (error: any) => {
            this.loading = false;
            Xmeta.showMsg("error");
        });
    }

    filter(evt: any, value: any) {
        evt.preventDefault();
        this.loading = true;
        if (value) {
            this.$user.getBy('formular', value).subscribe((res: any) => {
                this.loading = false;
                let _data = res.json();
                this.models = _data;
            }, (error: any) => {
                this.loading = false;
                if (error.status == 401) this.$router.navigate(['/login']);
            });
        } else {
            this.$user.all().subscribe((res: any) => {
                this.loading = false;
                let _data = res.json();
                this.models = _data.list;
            }, (error: any) => {
                this.loading = false;
                if (error.status == 401) this.$router.navigate(['/login']);
            });
        }
        evt.stopPropagation();
    }

    copy(evt: any, source: string, target: string) {
        evt.preventDefault();
        this.loading = true;
        var data: any = {};
        data.SourceID = source;
        data.TargetID = target;
        console.info(data);
        this.$user.copy(data).subscribe((res: any) => {
            this.loading = false;
            Xmeta.showMsg("success");
        }, (error: any) => {
            this.loading = false;
            Xmeta.showMsg("error");
        });
    }

    edit(evt: any, node: any) {
        evt.preventDefault();
        this.selected = node;
        this.selected.position = node.Position;
        this.selected.fullname = node.FullName;
        this.selected.department = node.Department;
        this.selected.company = node.Company;
        $('#emodal').modal('show');
        evt.stopPropagation();
    }

    save(evt: any, node: any) {
        evt.preventDefault();
        console.log('current selected', node);
        this.$user.patch(node.Id, { Department: node.Department, Position: node.Position, FullName: node.FullName, Company: node.Company }).subscribe((res: any) => {
            Xmeta.showMsg("save success");
            delete node.position;
            delete node.department;
            delete node.fullname;
            delete node.company;
            $('#emodal').modal('hide');
            return;
        }, (err: any) => {
            Xmeta.showMsg("save failed");
            return;
        });
        evt.stopPropagation();
    }

    cancel(evt: any, node: any) {
        evt.preventDefault();
        console.log('current selected', node);
        node.Department = node.department;
        node.FullName = node.fullname;
        node.Position = node.position;
        node.Company = node.company;
        delete node.position;
        delete node.department;
        delete node.fullname;
        delete node.company;
        $('#emodal').modal('hide');
        evt.stopPropagation();

    }

    download(evt: any) {
        evt.preventDefault();
        this.$user.download();
    }

}
