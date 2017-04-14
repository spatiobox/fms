(function (app) {
	app.models = app.models || {};
	app.models.Material = Material;

	function Material(id, title, code, user) {
		this.ID = id;
		this.Title = title;
		this.Code = code;
		this.UserID = user;
	}
})(window.app || (window.app = {}));