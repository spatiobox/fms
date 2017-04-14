/**
 * Created by zero on 4/12/16.
 */
(function (app) {
    app.directives = app.directives || {};

    app.directives.OmsRouterOutlet = ng.core
        //.Injectable()
        .Directive({
            //selector: 'router-outlet'
            //selector: 'page-content'
            selector: 'my-content'
            //extends: ng.router.RouterOutlet
        })
        .Class({
            extends: ng.router.RouterOutlet,
            constructor:[ng.core.ElementRef, ng.core.DynamicComponentLoader, ng.router.Router,[ new ng.core.Attribute('name'), String ], ng.core.Location,
                function (_elementRef, _loader, _parentRouter, nameAttr, location) {
                this.location = location;
                    window.t = _parentRouter;

                ng.router.RouterOutlet.call(this, _elementRef, _loader, _parentRouter, nameAttr);

                this.parentRouter = _parentRouter;

                // The Boolean following each route below denotes whether the route requires authentication to view
                this.publicRoutes = {
                    //'signin': true,
                    //'signup': true
                };
            }],
            activate:[ng.core.ComponentInstruction, function (instruction) {

                var url = instruction.urlPath;
                if (!this.publicRoutes[url] && !sessionStorage.getItem('id_token')) {
                    // todo: redirect to Login, may be there a better way?
                    //console.log('here')
                    //console.log(this.parentRouter);
                    location.href='/login.html';
                    //this.parentRouter.navigateByUrl('/signin');
                    //this.parentRouter.navigate(['Formular']);
                }
                return ng.router.RouterOutlet.prototype.activate.call(this, instruction);
            }]
        });
})(window.app || (window.app = {}));