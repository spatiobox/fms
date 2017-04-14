/**
 * Created by zero on 7/23/16.
 */
import { Directive, ElementRef, } from '@angular/core';

@Directive({
    selector: '[decimal]',
    host: {
        '(change)': 'change()'
    }
})
export class DecimalDirective {
    el: any;

    constructor(private _elementRef:ElementRef){
        this.el = _elementRef.nativeElement;
    }

    change() {
        if (!isNaN(Number(this.el.value))) {
            this.el.value = parseFloat(Number(this.el.value).toFixed(4));
        }
    }
}
