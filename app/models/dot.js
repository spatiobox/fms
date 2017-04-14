"use strict";

(function (app) {
    app.models = app.models || {};
    app.models.Dot = Dot;

    function Dot(id, title, controller, action, url, equ) {
        this.ID = id;
        this.Title = title;
        this.equ = equ;
    }
})(window.app || (window.app = {}));