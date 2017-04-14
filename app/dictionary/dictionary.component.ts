/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, DynamicComponentLoader, OnInit, OnDestroy, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { Xmeta } from '../xmeta.config';
import { ProfileService } from "../auth/services/profile.service";
import { DictionaryService } from "./dictionary.service";
import { GrepPipe } from "../pipes/grep.pipe";
import { FilterPipe } from "../pipes/filter.pipe";
import { HasPipe } from "../pipes/has.pipe";
import { NavbarComponent } from "../components/navbar.component";
import { NavheaderComponent } from "../components/navheader.component";


declare var _: any;
declare var $: any;

@Component({
    selector: 'my-dictionary',
    templateUrl: 'app/dictionary/dictionary.component.html',
    pipes: [GrepPipe, FilterPipe, TranslatePipe, HasPipe],
    providers: [DictionaryService],
    directives: [NavbarComponent, NavheaderComponent]
})
export class DictionaryComponent {
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

    constructor(private $dic: DictionaryService, private $router: Router, private $loader: DynamicComponentLoader) {
        this.models = [];
        this.bean = { date: null };
        this.users = [];
        this.selected = {};
        this.loading = true; 


        this.$dic.search({ code: "region" }).subscribe((res: any) => {
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
    change(evt:any, node:any, category:string){
        // evt.preventDefault();
        // console.log(evt);
        let value = evt.target.value; 
        let origin = node["Title"+ category.toUpperCase()];
        node[category + "Updating"] = true;
        var param = {};
        param["Title"+ category.toUpperCase()] = value; 
        this.$dic.patch(node.ID, param).subscribe((res:any)=>{
            node["Title"+ category.toUpperCase()] = value;
            node[category + "Updating"] = false;
        }, error =>{
            // node["Title"+ category.toUpperCase()] = value;
            // node["Title"+ category.toUpperCase()] = origin;
            evt.target.value = origin;
            node[category + "Updating"] = false;
            Xmeta.showMsg("save failed");
        })
    }

    toggle(evt: any, isChecked: any, category: string) {

        _.each(_.filter(this.models, (x: any) => { return x.Status == category; }), function (item: any) {
            if (isChecked) item.selected = true;
            else delete item.selected;
        });
    }

    delete(evt: any) {
        evt.preventDefault();
        let arr: Array<any> = [];
        _.each(this.models, function (item: any) {
            if (item.selected) arr.push(item.ID);
        });
        if (!arr.length) return;
        this.$dic.delete(arr).subscribe((res: any) => {
            this.models = _.filter(this.models, function (item: any) {
                return !item.selected;
            });
            Xmeta.showMsg("delete_success");
        }, (error: any) => {
            Xmeta.showMsg("delete_error");
        });
    }

    search(evt: any, value: any) {
        evt.preventDefault();
        this.key = value;
    }

    process(evt: any, node: any, isAudit: any) {
        evt.preventDefault();
        this.loading = true;
        this.$dic.unlock(node, isAudit ? 1 : -1).subscribe((res: any) => {
            this.loading = false;
            Xmeta.showMsg("success");
            node.Status = isAudit ? 1 : -1;
        }, (error: any) => {
            this.loading = false;
            Xmeta.showMsg("error");
        });
    }
    export(evt: any) {
        evt.preventDefault();
        // let dic: any = {};
        // let index = 100000;
        // let list: Array<any> = [];
        // _.forEach(Xmeta.Region["zh-CN"], (value: any, key: any) => {
        //     let node: any = {};
        //     node.ID = index++;
        //     node.Name = key;
        //     node.Code = "Region";
        //     node.Title = value;
        //     node.TitleCN = value;
        //     node.TitleTW = Xmeta.Region["zh-TW"][key];
        //     node.TitleEN = Xmeta.Region["en-US"][key];
        //     node.Description = "";
        //     list.push(node);
        //     this.$dic.post(node).subscribe(function(res:any){}, function(error){
        //         console.error(error);
        //     });
        //     console.log(node);
        // });

        // evt.stopPropagation();
    }

    filter(evt: any, value: any) {
        evt.preventDefault();
        this.loading = true;
        if (value) {
            this.$dic.getBy('formular', value).subscribe((res: any) => {
                this.loading = false;
                let _data = res.json();
                this.models = _data;
            }, (error: any) => {
                this.loading = false;
                if (error.status == 401) this.$router.navigate(['/login']);
            });
        } else {
            this.$dic.all().subscribe((res: any) => {
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
        this.$dic.copy(data).subscribe((res: any) => {
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
        $('#emodal').modal('show');
        evt.stopPropagation();
    }

    save(evt: any, node: any) {
        evt.preventDefault();
        console.log('current selected', node);
        this.$dic.patch(node.Id, { Department: node.Department, Position: node.Position, FullName: node.FullName }).subscribe((res: any) => {
            Xmeta.showMsg("save success");
            delete node.position;
            delete node.department;
            delete node.fullname;
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
        delete node.position;
        delete node.department;
        delete node.fullname;
        $('#emodal').modal('hide');
        evt.stopPropagation();

    }

    download(evt: any) {
        evt.preventDefault();
        this.$dic.download();
    }

}
