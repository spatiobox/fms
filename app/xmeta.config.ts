/**
 * Created by zero on 7/19/16.
 */

declare var localStorage:any;

export const Xmeta = {
    location: "http://svc.xmeta.life",
    CreateGuid: (function (uuidRegEx:any, uuidReplacer:any) {
        return function () {
            return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    })(/[xy]/g, function (c:any) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 3 | 8);
        return v.toString(16);
    }),
    lang: localStorage.language || window.navigator.language || "zh-CN",
    showMsg: function (key:any) {
        var arr = key.split(' ');
        var spliter = Xmeta.lang == 'en-US' ? ' ' : '';
        var result = '';
        arr.forEach(function (item:any) {
            result += spliter + (Xmeta.Region[Xmeta.lang][item] || Xmeta.Messages[Xmeta.lang][item] || item || '');
        });
        alert(result);
    },
    getText: function (key:any) {
        var arr = key.split(' ');
        var spliter = Xmeta.lang == 'en-US' ? ' ' : '';
        var result = '';
        arr.forEach(function (item:any) {
            result += spliter + (Xmeta.Region[Xmeta.lang][item] || Xmeta.Messages[Xmeta.lang][item] || item || '');
        });
        return result;
    },
    Category: {
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
        children: 8192,
        /// <summary>
        /// 16384: 台秤
        /// </summary>
        // [Display(Name = "台秤")]
        scale: 0x04000,

        /// <summary>
        /// 32768: 任务
        /// </summary>
        // [Display(Name = "任务")]
        mission: 0x08000,

        /// <summary>
        /// 65536: 任务明细
        /// </summary>
        // [Display(Name = "任务明细")]
        missiondetail: 0x10000, 
          
        /// <summary>
        /// 2048: 签名
        /// </summary>
        // [Display(Name = "签名")]
        signature: 0x20000,

        /// <summary>
        /// 1024: 全部
        /// </summary>
        // [Display(Name = "全部")]
        All: 0xFFFFF
    },
    Messages: {

        'zh-CN': {
            'success': '成功',
            'import_success': '导入成功',
            'import_error': '导入失败',
            'delete_success': '删除成功',
            'delete_error': '删除失败',
            'password_confirm_failed': '两次密码输入不一致.',
            'email_is_unusable': '邮箱不可用, 请重新输入',
            'delete_materials_already_used': '配料{0}已在配方{1}中使用',

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
            'invalid_grant': '用户名或密码错误',
            'invalid_permission': '权限不足',
            'register_exist_username': '用户名已被注册使用',
            'register_exist_email': '邮箱已被注册使用',
            'register_exist_phone': '手机号已被注册使用',
            'login_failed_please_retry': '登录出错，请重试',


            //dispatch
            'over_allocate': '物料 [ ${title} ] 超出允许派工的数量'
        },
        'zh-TW': {
            'success': '成功',
            'import_success': '導入成功',
            'import_error': '導入失敗',
            'delete_success': '刪除成功',
            'delete_error': '刪除失敗',
            'password_confirm_failed': '兩次密碼輸入不一致.',
            'email_is_unusable': '郵箱不可用, 請重新輸入',
            'delete_materials_already_used': '配料{0}已在配方{1}中使用',


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
            'invalid_grant': '用戶名或密碼錯誤.',
            'invalid_permission': '權限不足',
            'register_exist_username': '用戶名已被註冊使用',
            'register_exist_email': '郵箱已被註冊使用',
            'register_exist_phone': '手機號已被註冊使用',
            'login_failed_please_retry': '登錄出錯，請重試',


            //dispatch
            'over_allocate': '物料 [ ${title} ] 超出允許派工的數量'
        },
        'en-US': {
            'success': 'Success',
            'import_success': 'Success',
            'import_error': 'Error',
            'delete_success': 'Success',
            'delete_error': 'Delete failed',
            'password_confirm_failed': 'The passwords you entered must be the same.',
            'email_is_unusable': 'The email is unusable.',
            'delete_materials_already_used': 'Material {0} already used in formulas: {1}',


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
            'invalid_grant': 'The user name or password is incorrect.',
            'invalid_permission': 'Don\'t have enough permission',
            'register_exist_username': 'User name has been registered',
            'register_exist_email': 'Email has been registered',
            'register_exist_phone': 'Phone number has been registered',
            'login_failed_please_retry': 'Login failed, please retry',


            //dispatch
            'over_allocate': 'Material [ ${title} ] is over allocated'
        }

    },
    Region: {
        "zh-CN": {
            //系统
            "omniteaching": "来学通",
            "profile": "个人信息",
            "info": "信息",
            "settings": "配置",
            "login": "登录",
            "please": "请",
            "sign": "登",
            "in": "录",
            "remember": "记住",
            "me": "我",
            "logout": "退出",
            "item": "序号",
            "name": "名称",
            "title": "标题",
            "no.": "编号",
            "code": "编号",
            "simplified_chinese": "简体中文",
            "traditional_chinese": "繁體中文",
            "english": "English",
            "cn": "简体",
            "tw": "繁体",
            "en": "英文",
            "languages": "语言",
            "template": "模板",
            "time": "时间",
            "date": "日期",
            "username": "用户名",
            "user": "用户",
            "password": "密码",
            "input": "输入",
            "reinput": "再次输入",
            "dont_have_a_iD?_please": "没有帐号?请",
            "register": "注册",
            "forgot": "忘记",
            "have": "已有",
            "account": "账户",
            "company": "公司",
            "phonenumber": "手机号码",
            "email": "邮箱",
            "mail": "邮件",
            "department": "部门",
            "position": "班别",
            "fullname": "姓名",
            "confirmpassword": "再次输入密码",
            "confirm": "确认",
            "your": "您的",
            "pending_approval": "待审批",
            "user_list": "用户列表",
            "entry": "入库",
            "yes": "是",
            "no": "否",
            "selected": "选中",
            "select": "选择",
            "remark": "备注",
            "keyword": "关键字",
            "batch": "批号",
            "viscosity": "粘度",
            "dictionary": "字典",

            //模块
            "formula": "配方",
            "formular": "配方",
            "formulars": "配方",
            "material": "配料",
            "materials": "配料",
            "recipe": "配方明细",
            "recipes": "配方明细",
            "management": "管理",
            "sum": "合计",
            "std": "标准",
            "value": "值",
            "weight": "重量",
            "ratio": "配比",
            "percentage": "百分比",
            "deviation": "误差",
            "isratio": "比率否",
            "ispercentage": "是否百分比",
            "history": "历史",
            "copies": "份数",
            "directory": "目录",
            "organization": "组织",
            "bucket": "云盘",
            "mission": "派工",
            "dispatch": "派工",
            "max_range": "最大量程",
            "range": "量程",
            "capacity": "量程",

            //error
            "invalid_grant": "用户名或密码错误",

            //操作
            "add": "新增",
            "edit": "编辑",
            "delete": "删除",
            "cancel": "取消",
            "save": "保存",
            "close": "关闭",
            "filter": "过滤",
            "search": "检索",
            "copy": "复制",
            "join": "加入配方",
            "export": "导出",
            "download": "下载",
            "import": "导入",
            "reset": "重置",
            "choosen": "所选",
            "return": "返回",
            "send": "发送",
            "success": "成功",
            "failed": "失败",
            "error": "错误",
            "retry": "重试",
            "from": "从",
            "to": "到",
            "new": "新",
            "sort": "排序",
            "resort": "重排序",
            "unassigned": "未派工",
            "working": "进行中",
            "accomplished": "完成",
            "weighing": "称重中",
            "ready": "未开始",
            "idle": "空闲",
            "offline": "离线",
            "pause": "暂停",
            "status": "状态",
            "scale": "台秤",
            "continue": "继续",
            "operation": "操作",
            "all": "全部",
            "precision": "精度",
            "refresh": "刷新",
            "current": "当前",
            "task": "任务",
            "device": "设备",
            "heartbeat": "心跳",
            "package": "包",
            "markas": "置为",
            'no_mission_available':'当前无分配任务'
        },
        "zh-TW": {
            //系统
            "omniteaching": "來學通",
            "profile": "個人信息",
            "info": "信息",
            "settings": "配置",
            "login": "登錄",
            "please": "請",
            "sign": "登",
            "in": "錄",
            "remember": "記住",
            "me": "我",
            "logout": "登出",
            "item": "序號",
            "name": "名稱",
            "title": "標題",
            "no.": "編號",
            "code": "編號",
            "simplified_chinese": "简体中文",
            "traditional_chinese": "繁體中文",
            "english": "English",
            "cn": "簡體",
            "tw": "繁體",
            "en": "英文",
            "languages": "語言",
            "template": "模板",
            "time": "時間",
            "date": "日期",
            "username": "用戶名",
            "user": "用戶",
            "password": "密碼",
            "input": "輸入",
            "reinput": "再次輸入",
            "dont_have_a_iD?_please": "沒有帳號?請",
            "register": "註冊",
            "forgot": "忘記",
            "have": "已有",
            "account": "帳戶",
            "company": "公司",
            "phonenumber": "手機號碼",
            "email": "郵箱",
            "mail": "郵件",
            "department": "部門",
            "position": "班別",
            "fullname": "姓名",
            "confirmpassword": "再次輸入密碼",
            "confirm": "確認",
            "your": "您的",
            "pending_approval": "待審批",
            "user_list": "用戶列表",
            "entry": "入庫",
            "yes": "是",
            "no": "否",
            "selected": "選中",
            "select": "選擇",
            "remark": "備註",
            "keyword": "關鍵字",
            "batch": "批號",
            "viscosity": "黏度",
            "dictionary": "字典",



            //模块
            "formula": "配方",
            "formular": "配方",
            "formulars": "配方",
            "material": "配料",
            "materials": "配料",
            "recipe": "配方明細",
            "recipes": "配方明細",
            "management": "管理",
            "sum": "合計",
            "std": "標準",
            "value": "值",
            "weight": "重量",
            "ratio": "配比",
            "percentage": "百分比",
            "deviation": "誤差",
            "isratio": "比率否",
            "ispercentage": "是否百分比",
            "history": '歷史',
            "copies": "份數",
            "directory": "目錄",
            "organization": "組織",
            "bucket": "雲盤",
            "mission": "派工",
            "dispatch": "派工",
            "max_range": "最大量程",
            "range": "量程",
            "capacity": "量程",


            //error
            "invalid_grant": "用戶名或密碼錯誤",

            //操作
            "add": "新增",
            "edit": "修改",
            "delete": "刪除",
            "cancel": "取消",
            "save": "保存",
            "close": "關閉",
            "filter": "過濾",
            "search": "檢索",
            "copy": "複製",
            "join": "添加",
            "export": "導出",
            "download": "下載",
            "import": "導入",
            "reset": "重置",
            "choosen": "所選",
            "return": "返回",
            "send": "發送",
            "success": "成功",
            "failed": "失敗",
            "error": "錯誤",
            "retry": "重試",
            "from": "從",
            "to": "到",
            "new": "新",
            "sort": "排序",
            "resort": "重排序",
            "unassigned": "未派工",
            "working": "進行中",
            "accomplished": "完成",
            "weighing": "稱重中",
            "ready": "未開始",
            "idle": "空閒",
            "offline": "離線",
            "pause": "暫停",
            "status": "狀態",
            "scale": "臺稱",
            "continue": "繼續",
            "operation": "操作",
            "all": "全部",
            "precision": "精度",
            "refresh": "刷新",
            "current": "當前",
            "task": "任務",
            "device": "設備",
            "heartbeat": "心跳",
            "package": "包",
            "markas": "置為",
            'no_mission_available':'當前無分配任務'
        },
        "en-US": {
            "omniteaching": "Omniteaching",
            "profile": "User Profile",
            "info": "Info.",
            "settings": "Settings",
            "login": "Login",
            "please": "Please",
            "sign": "Sign",
            "in": "In",
            "remember": "Remember",
            "me": "Me",
            "logout": "Logout",
            "item": "Item",
            "name": "Name",
            "title": "Title",
            "no.": "NO.",
            "code": "NO.",
            "simplified_chinese": "简体中文",
            "traditional_chinese": "繁體中文",
            "english": "English",
            "cn": "zh-CN",
            "tw": "zh-TW",
            "en": "en-US",
            "languages": "LANGUAGES",
            "template": "Template",
            "time": "Time",
            "date": "Date",
            "username": "User Name",
            "user": "User",
            "password": "Password",
            "input": "Enter",
            "reinput": "Reenter",
            "dont_have_a_iD?_please": "Don't have a iD? Please ",
            "register": "register",
            "forgot": "Forgot",
            "have": "Have",
            "account": "Account",
            "company": "Company",
            "phonenumber": "Phone Number",
            "email": "Email",
            "mail": "Email",
            "department": "Department",
            "position": "Class",
            "fullname": "Name",
            "confirmpassword": "Confirm Password",
            "confirm": "Confirm",
            "your": "your",
            "pending_approval": "Pending approval",
            "user_list": "User list",
            "entry": "Entry",
            "yes": "Yes",
            "no": "No",
            "selected": "Selected",
            "select": "Select",
            "remark": "Remark",
            "keyword": "Keyword",
            "batch": "Batch",
            "viscosity": "Viscosity",
            "dictionary": "Dictionary",


            //module
            "formula": "Formula",
            "formular": "Formula",
            "formulars": "Formulas",
            "material": "Material",
            "materials": "Materials",
            "recipe": "Recipe",
            "recipes": "Recipes",
            "management": "Management",
            "sum": "Sum",
            "std": "Standard",
            "value": "Value",
            "weight": "Weight",
            "ratio": "ratio",
            "percentage": "Percentage",
            "deviation": "Deviation",
            "isratio": "Is Ratio",
            "ispercentage": "Is Percentage",
            "history": "History",
            "copies": "Copies",
            "directory": "Directory",
            "organization": "Organization",
            "bucket": "Bucket",
            "mission": "Task",
            "dispatch": "Dispatch",
            "max_range": "Max Range",
            "range": "Range",
            "capacity": "Capacity",


            //error
            "invalid_grant": "The user name or password is incorrect.",

            //operation
            "add": "Add",
            "edit": "Edit",
            "delete": "Delete",
            "cancel": "Cancel",
            "save": "Save",
            "close": "Close",
            "filter": "Filter",
            "search": "Search",
            "copy": "Copy",
            "join": "Join",
            "export": "Export",
            "download": "Download",
            "import": "Import",
            "reset": "Reset",
            "choosen": "Choosen",
            "return": "Go to ",
            "send": "Send",
            "success": "Success",
            "failed": "Failed",
            "error": "Error",
            "retry": "retry",
            "from": "From",
            "to": "To",
            "new": "New",
            "sort": "Sort",
            "resort": "Resort",
            "unassigned": "Unassigned",
            "working": "Working",
            "accomplished": "Accomplished",
            "weighing": "Weighing",
            "ready": "Ready",
            "idle": "Idle",
            "offline": "Offline",
            "pause": "Pause",
            "status": "Status",
            "scale": "Scale",
            "continue": "Continue",
            "operation": "Operation",
            "all": "All",
            "precision": "Resolution",
            "refresh": "Refresh",
            "current": "Current",
            "task": "Task",
            "device": "Device",
            "heartbeat": "Heartbeat",
            "package": "Package",
            "markas": "Mark as",
            'no_mission_available':'No mission available'
        }
    }
}