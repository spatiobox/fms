/**
 * Created by zero on 2/26/16.
 */
(function (app) {
    "use strict";

    app.services = app.services || {};
    //var adapter = new ng.upgrade.UpgradeAdapter();
    //adapter.addProvider(ng.http.HTTP_PROVIDERS);
    app.services.MultilingualService = ng.core.
        Injectable()
        .Class({
            constructor: [ng.http.Http, function (http) {
                this.http = http;
            }],
            get: function () {
            },
            post: function () {

            },
            patch: function () {

            },
            delete: function () {

            },
            import: function () {

            }
        });
})(window.app || (window.app = {}));