/**
 * Created by zero on 7/19/16.
 */
import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
 */


declare var _:any;


@Pipe({name: 'sum'})
export class SumPipe implements PipeTransform {
    transform(value: any, args: any) {
        //if (!value) return [];
        //if (!value.length) return value;
        //if (!args) return value;
        //if (!args.length) return value;
        //if (args[0] == "" || !args[0]) return value;
        var total = 0;
        _.each(value, function (item:any) {
            total += Number(item.Weight || 0);
        });
        return parseFloat(total.toFixed(4));
    }
}