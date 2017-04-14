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

declare var _: any;

@Pipe({ name: 'grep', pure: false })
export class GrepPipe implements PipeTransform {
    transform(list: any, field: string, value: any, isNullValueReturnAll: any = false) {

        if (!list) return [];
        //if (args.length != 2) return list;
        //if (args[0] == "" || !args[0]) return list;
        //console.log(value);
        //console.log(args)
        if (isNullValueReturnAll && (value === null || value === undefined)) return list;

        var _arr = _.filter(list, function (item: any) {
            return item[field] === value;
        });

        return _arr;
    }
}