(function (app) {
    app.models = app.models || {};
    app.models.Formular = Formular;
    // body...
    function Formular(id, title, code, user) {
        // body...
        this.ID = id;
        this.Title = title;
        this.Code = code;
        this.UserID = user;
    }
})(window.app || (window.app = {}))