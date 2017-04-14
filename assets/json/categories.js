/**
 * Created by zero on 3/21/16.
 */
'use strict';
(function(app) {
    app.Category = {
        formula: 1,
        material: 2,
        recipe: 4,
        record: 8,
        user: 16,
        role: 32,
        permission: 64,
        profile: 128,
        dictionary: 256,
        bucket: 512,
        config: 1024,
        organization: 2048,
        parent: 4096,
        children: 8192
    };
})(window.app || (window.app = {}));