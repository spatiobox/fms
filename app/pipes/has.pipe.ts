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


@Pipe({name: 'has'})
export class HasPipe implements PipeTransform {
    transform(value: any, args: any) {
        if(!args.length) return false;

        var list = _.filter(value, function (item:any) {
            return item.ID == args[0].ID;
        });
        
        return list.length > 0;
    }
}