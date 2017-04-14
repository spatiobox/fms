'use strict';

(function (app) {
    app.lang = localStorage.language || window.navigator.language || "zh-CN";
    app.showMsg = function (key) {
        var arr = key.split(' ');
        var spliter = app.lang == 'en-US' ? ' ' : '';
        var result = '';
        _.each(arr, function (item) {
            result += spliter + (app.Region[app.lang][item] || app.Messages[app.lang][item] || item || '');
        });
        alert(result);
    }
    app.getText = function (key) {
        return app.Messages[app.lang][key];
    }
    app.Messages =
    {
        'zh-CN': {
            'success': '成功',
            'import_success': '导入成功',
            'import_error': '导入失败',
            'delete_success': '删除成功',
            'delete_error': '删除失败',

            //formular
            'alert_editing_cannot_select': '编辑中, 无法选中其他配方',

            //recipe
            'confirm_leave': '您有未保存的操作, 确定放弃保存?',
            'confirm_delete': '确定删除?',
            'confirm_formular_delete': '删除配方将同时删除相应的配方详细, 确定删除?',

            //material
            'alert_editing_join': '您选中的配料正在编辑, 无法将配料添加到明细一栏, 请先保存配料信息!',
            'alert_nothing_selected': '未选中任何配料',
            'alert_formular_not_selected': '请先选择配方',
            'alert_duplication_code_or_title': '名称或编号重复，无法保存',


            //auth
            'invalid_grant': '用户名或密码错误'
        },
        'zh-TW': {
            'success': '成功',
            'import_success': '導入成功',
            'import_error': '導入失敗',
            'delete_success': '刪除成功',
            'delete_error': '刪除失敗',

            //formular
            'alert_editing_cannot_select': '編輯中, 無法選中其他配方',

            //系统
            'confirm_leave': '您有未保存的操作, 確定放棄保存?',
            'confirm_delete': '確定刪除?',
            'confirm_formular_delete': '刪除配方將同時刪除相應的配方詳細, 確定刪除?',




            //material
            'alert_editing_join': '您選中的配料正在編輯, 無法將配料添加到明細一欄, 請先保存配料信息!',
            'alert_nothing_selected': '未選中任何配料',
            'alert_formular_not_selected': '請先選擇配方',
            'alert_duplication_code_or_title': '名稱或編號重複, 無法保存',


            //auth
            'invalid_grant': '用戶名或密碼錯誤.'
        },
        'en-US': {
            'success': 'Success',
            'import_success': 'Success',
            'import_error': 'Error',
            'delete_success': 'Success',
            'delete_error': 'Delete failed',

            //formular
            'alert_editing_cannot_select': '编辑中, 无法选中其他配方',

            //recipe
            'confirm_leave': 'The recipe has been changed, do you still leave without saving?',
            'confirm_delete': 'make sure that you want to delete it ?',
            'confirm_formular_delete': 'It also will delete the recipes in the meanwhile, are you sure?',


            //material
            'alert_editing_join': 'Please save the material before attach them to recipe!',
            'alert_nothing_selected': 'Nothing selected',
            'alert_formular_not_selected': 'Firstly, choose a formular please',
            'alert_duplication_code_or_title': 'Name or No. already exist.',
            //auth
            'invalid_grant': 'The user name or password is incorrect.'
        }
    };

})(window.app || (window.app = {}));
