/**
 * Created by zero on 7/19/16.
 */
import { Injectable } from '@angular/core';
import { Subject} from "rxjs/Rx";
//import {BehaviorSubject} from "rxjs/BehaviorSubject";
//import { Http } from '@angular/http';
/**
 * Async modal dialog service
 * DialogService makes this app easier to test by faking this service.
 * TODO: better modal implementation that doesn't use window.confirm
 */
@Injectable()
export class CommunicateService {
    material:any;
    formula:any;

    //confirm(message?:string) {
    //    return new Promise<boolean>(resolve => {
    //        return resolve(window.confirm(message || 'Is it OK?'));
    //    });
    //};

    constructor() {
        this.material = {
            onSelected: new  Subject(),
            onChanged: new  Subject()
        };
        this.formula = {
            onSelected: new  Subject(),
            onChanged: new  Subject()
        };
    }

    onFormularSelected() {
        return this.formula.onSelected;
    }


    emitFormularSelected(node: any) {
        return this.formula.onSelected.next(node);
    }


    onFormularChanged() {
        return this.formula.onChanged;
    }

    emitFormularChanged(node: any) {
        this.formula.onChanged.next(node);
    }

    onMaterialSelected() {
        return this.material.onSelected;
    }

    emitMaterialSelected(array: any) {
        this.material.onSelected.next(array);
    }


    onMaterialChanged() {
        return this.material.onChanged;
    }

    emitMaterialChanged(node: any) {
        this.material.onChanged.next(node);
    }
}