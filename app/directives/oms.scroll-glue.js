/**
 * Created by zero on 5/23/16.
 */

(function (app) {
    app.directives = app.directives || {};

    app.directives.ScrollGlue = ng.core
        //.Injectable()
        .Directive({
            selector: '[scroll-glue]',
            host: {
                '(scroll)': 'onScroll()'
            }
        })
        .Class({
            constructor: [ng.core.ElementRef, ng.core.DynamicComponentLoader, function (_elementRef, _loader) {
                console.log('elem', _elementRef);
                console.log('loader', _loader);
                this.el = _elementRef.nativeElement;
                alert(2);

                //croll: function (t) {
                //    console.log('t',t);
                //},
            }],
            onScroll: function (e) {
                //var percent = (this.el.scrollHeight / 100);
                //if (this.el.scrollHeight - this.el.scrollTop > (10 * percent)) {
                //    this.isLocked = true;
                //}
                //else {
                //    this.isLocked = false;
                //}
                console.log(this.el.scrollTop);
                this.el.scrollTop = this.el.scrollHeight;
            },
            activate: [ng.core.ComponentInstruction, function (instruction) {
                console.log('instruction', instruction);
            }]
        })
})(window.app || (window.app = {}));