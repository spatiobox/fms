/**
 * Created by zero on 7/19/16.
 */
/**
 * Created by zero on 7/19/16.
 */
import { Component, ElementRef, OnInit, OnDestroy, Input }          from '@angular/core';
import { FilterPipe } from '../pipes/filter.pipe';
import { GrepPipe } from '../pipes/grep.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';
import { I18nPipe } from '../pipes/i18n.pipe';
import { HasPipe } from '../pipes/has.pipe';
import { FormulaService } from '../services/formula.service';
import { OrganizationService } from '../organization/organization.service';
import { RecordService } from '../services/record.service';
import { ProfileService } from '../auth/services/profile.service';
import { NavbarComponent} from '../components/navbar.component';
import { NavheaderComponent} from '../components/navheader.component';

import { Xmeta } from '../xmeta.config';

declare var _: any;
declare var $: any;

@Component({
    selector: 'my-records',
    templateUrl: 'app/views/formula/record.component.html',
    pipes: [FilterPipe, TranslatePipe, HasPipe, I18nPipe, GrepPipe],
    providers: [RecordService, FormulaService, ProfileService, OrganizationService],
    directives: [NavbarComponent, NavheaderComponent]
})
export class RecordComponent {
    key: any;
    models: Array<any>;
    orgs: Array<any>;
    loading: boolean;
    selected: any;
    el: any;
    bean: any;
    formula: any;
    organization: any;
    formulas: Array<any>;
    isAdmin: boolean;
    group: any;
    @Input()
    startdate: Date;
    @Input()
    enddate: Date;

    constructor(private $record: RecordService, private $formula: FormulaService, private $profile: ProfileService, private $org: OrganizationService) {
        // this.$formula = $formula;
        // this.$record = $record;
        this.models = [];
        this.orgs = [];
        this.bean = { date: null };
        this.formulas = [];
        this.loading = true;
        this.isAdmin = this.$profile.isAdmin();
        this.$record.getFormulas().subscribe((res: any) => {
            let _data = res.json();
            this.formulas = _data.list;
            this.group = _.groupBy(this.formulas, 'Title');
            // console.log(this.group);
            // _.forEach(this.group, (g: any, k: any) => {
            //     // console.log(k, g);
            //     if (g.length > 1) { this.isAdmin = true; return false; }
            // });
            if (this.isAdmin) this.formulas = _.sortBy(this.formulas, ['UserID', 'Title']);
        }, (error: any) => {

        });
        this.$record.all().subscribe((res: any) => {
            let _data = res.json();
            this.loading = false;
            this.models = _data.list;
        }, (error: any) => {
            this.loading = false;
            // if (error.status == 401) location.href = '/login';
        });
        this.$org.all().subscribe((res: any) => {
            let _data = res.json();
            this.loading = false;
            this.orgs = _data.list;
        }, (error: any) => {
            this.loading = false;
            // if (error.status == 401) location.href = '/login';
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

    toggle(evt: any, isChecked: any) {
        var self = this;
        _.each(self.models, function (item: any) {
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
        this.$record.delete(arr).subscribe((res: any) => {
            let _data = res.json();
            this.models = _.filter(this.models, function (item: any) {
                return !item.selected;
            });
            Xmeta.showMsg("delete_success");
        }, (error: any) => {
            Xmeta.showMsg("delete_error");
        });
    }

    search(evt: any, formula: any, startdate: any, enddate: any, key: any) {
        evt.preventDefault();
        this.loading = true;
        let grep: any = {};
        if (formula) grep.FormularID = formula;
        // if (org) grep.OrgID = org;
        if (startdate || this.enddate) grep.RecordDate = {};
        if (startdate) grep.RecordDate["$gte"] = startdate;
        if (enddate) grep.RecordDate["$lt"] = enddate;
        if (this.key) grep["$regex"] = [
            // { "OrgTitle": this.key },
            { "FormularTitle": this.key },
            { "MaterialTitle": this.key },
            { "User.Position": this.key },
            { "User.Department": this.key },
            { "User.FullName": this.key },
        { "User.UserName": this.key }];
            // { "Viscosity": this.key },
            // { "BatchNo": this.key }];

        let json: any = {};
        if (Object.getOwnPropertyNames(grep).length) json.grep = grep;

        json.sort = "{RecordDate:'desc'}";
        this.$record.search(json).subscribe((res: any) => {
            let _data = res.json();
            this.loading = false;
            this.models = _data.list;
        }, (error: any) => {
            this.loading = false;
        });
        evt.stopPropagation();
    }

    filter(evt: any, value: any) {
        evt.preventDefault();
        this.loading = true;
        if (value) {
            this.$record.getBy('formula', value).subscribe((res: any) => {
                let _data = res.json();
                this.loading = false;
                this.models = _data;
            }, (error: any) => {
                this.loading = false;
                if (error.status == 401) location.href = '/login.html';
            });
        } else {
            this.$record.all().subscribe((res: any) => {
                let _data = res.json();
                this.loading = false;
                this.models = _data.list;
            }, (error: any) => {
                this.loading = false;
                if (error.status == 401) location.href = '/login.html';
            });
        }
        evt.stopPropagation();
    }

    download(evt: any) {
        evt.preventDefault();
        this.$record.download();
    }

    import(evt: any) {
        var self = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', (e: any) => {
            var file = e.target.files[0];
            var form = new FormData();
            form.append('uploads[]', file, file.name);
            this.$record.import(form).subscribe((res: any) => {
                Xmeta.showMsg("import_success");
            }, (error: any) => {
                if (error.Message) alert(error.Message.replace(/\|/gi, '\n'));
                else Xmeta.showMsg('import_error');
            });
        });
        input.click();
    }

    export(evt: any, doc: any) {
        evt.preventDefault();
        var form = new FormData();

        let arr: Array<any> = [];
        _.each(this.models, function (item: any) {
            if (item.selected) arr.push(item.ID);
        });

        let grep: any = {};
        if (this.formula) grep.FormularID = this.formula;
        if (this.organization) grep.OrgID = this.organization;
        if (this.startdate || this.enddate) grep.RecordDate = {};
        if (this.startdate) grep.RecordDate["$gte"] = this.startdate;
        if (this.enddate) grep.RecordDate["$lt"] = this.enddate;
        if (this.key) grep["$regex"] = [
            // { "OrgTitle": this.key },
            { "FormularTitle": this.key },
            { "MaterialTitle": this.key },
            { "User.Position": this.key },
            { "User.UserName": this.key },
            { "User.Department": this.key },
            { "User.FullName": this.key },
            { "User.UserName": this.key }];
            // { "Viscosity": this.key },
            // { "BatchNo": this.key }];
        if (arr.length) grep.ID = arr;

        let json: any = {};
        if (Object.getOwnPropertyNames(grep).length) json.grep = grep;
        json.sort = "{RecordDate:'desc'}";
        form.append('filter', JSON.stringify(json));
        this.$record.export(JSON.stringify(json), doc);
    }


}