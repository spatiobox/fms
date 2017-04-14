/**
 * Created by zero on 7/19/16.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { Xmeta } from '../xmeta.config'
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
 */
@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
    constructor(){
    }
    transform(value: any, args: any): string {
        if (!value) return value;
        if (!Xmeta.Region[Xmeta.lang]) return value;
        var spliter = Xmeta.lang == 'en-US' ? ' ' : '';
        var arr = value.split(' ');
        var result = '';
        arr.forEach(function (item:any) {
            result += spliter + (Xmeta.Region[Xmeta.lang][item] || value);
        });

        return result;
    }
}