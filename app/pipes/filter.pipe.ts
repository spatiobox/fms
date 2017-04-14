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

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
    transform(value: any, args: any) {
        if (!value) return [];
        if (!value.length) return value;
        if (!args) return value;
        if (!args.length) return value;
        if (args[0] == "" || !args[0]) return value;
        //console.log(value);
        //console.log(args)
        var _arr = _.filter(value, function (item:any) {
            return (item.Title && item.Title.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.Code && item.Code.toLowerCase().indexOf(args[0].toLowerCase()) >= 0 ) ||
                (item.MaterialTitle && item.MaterialTitle.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.MaterialID && item.MaterialID.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.FormularTitle && item.FormularTitle.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.FormularID && item.FormularID.toLowerCase().indexOf(args[0].toLowerCase()) >= 0) ||
                (item.RecordDate && item.RecordDate.indexOf(args[0]) >= 0);
        })
        return _arr;
    }
}