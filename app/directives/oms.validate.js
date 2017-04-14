/**
 * Created by zero on 6/18/16.
 */
/**
 * Created by zero on 5/23/16.
 */

(function (app) {
    app.directives = app.directives || {};

    app.directives.NumberDirective = ng.core
        //.Injectable()
        .Directive({
            selector: '[decimal]',
            host: {
                '(change)': 'change()'
            }
        })
        .Class({
            constructor: [ng.core.ElementRef, ng.core.DynamicComponentLoader, function (_elementRef, _loader) {
                this.el = _elementRef.nativeElement;
                this.loader = _loader;
                this.ref = _elementRef;
            }],
            change: function (e) {
                //var percent = (this.el.scrollHeight / 100);
                //if (this.el.scrollHeight - this.el.scrollTop > (10 * percent)) {
                //    this.isLocked = true;
                //}
                //else {
                //    this.isLocked = false;
                //}
//                console.log(this.el.scrollTop);
                if (!isNaN(Number(this.el.value))) {
                    this.el.value = parseFloat(Number(this.el.value).toFixed(4));
                }

            },
            validate: function(key) {
                console.log(key);
                return {"custom": true};
            },
            activate: [ng.core.ComponentInstruction, function (instruction) {
                console.log('instruction', instruction);
            }]
        })
})(window.app || (window.app = {}));