(function (app) {
	app.models = app.models || {};
	app.models.Recipe = Recipe;

	function Recipe(id, uid, fid, ftitle, mid, mtitle, wieght, deviation, isratio, sort) {
		this.ID = id || 0;
		this.UserID = uid || '';
		this.FormularID = fid || 0;
		this.FormularTitle = ftitle || '';
		this.MaterialID = mid || 0;
		this.MaterialTitle = mtitle || '';
		this.Weight = wieght || 0.0;
		this.Deviation = deviation || 0.0;
		this.IsRatio= !!isratio;
		this.Sort= sort || 1;
	}
})(window.app || (window.app = {}));