
// ---------继承-------- //

function extend(Child, Parent) {
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
}

// ---------Event-------- //

var Event = function(){}

Event.prototype = {
    constructor: Event,
    clients: {},
    on: function(key, fn){
        if(!this.clients[key]){
            this.clients[key] = [];
        }
        this.clients[key].push(fn);
    },
    off: function(key, fn){
        var fns = clients[key];
        if(!fns){
            return false;
        }
        if(!fn){
            fns && (fns.length = 0);
        }else{
            var index = fns.indexOf(fn);
            if(index !== -1){
                fns.splice(index, 1);
            }
        }
    },
    emit: function(){
        var key = Array.prototype.shift.call(arguments);
        fns = this.clients[key];
        if(!fns || fns.length === 0){
            return false;
        }
        for(var i = 0, len = fns.length; i < len; i++){
            var fn = fns[i];
            fn.apply(this, arguments);
        }
    }
}

// ---------Dialog-------- //

var Dialog = function(){}
extend(Dialog, Event);
Dialog.prototype.init = function(cfg){
    console.log("init");
    this.param(cfg);
    this.create();
    this.render();
    this.listenBtnCloseEvent();
    this.hide();
}
/*
* 参数处理
**/
Dialog.prototype.param = function(cfg){
    this.cfg = {
        'title': '提示',
        'content': '',
        'type': 'default', // default, error, success, warning
        'useMask': false // 是否使用遮罩
    }
    for(var key in cfg){
        this.cfg[key] = cfg[key];
    }
}
/*
* 创建dialog
**/
Dialog.prototype.create = function(){
    console.log("create");
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
}
/*
* 渲染dialog
**/
Dialog.prototype.render = function(){
    console.log("render");
    // --标题-- //
    var title = document.createElement('h3');
    title.innerHTML = this.cfg.title;
    CssUtil.setCss(title, {
        'box-sizing': 'border-box',
        'padding': '8px 0 8px 15px',
        'font-size': '20px',
        'position': 'relative',
        'color': '#fff',
        'margin': 0
    });
    this.container.appendChild(title);
    // --根据this.cfg.type判断提示内容的类型，并用不同的颜色渲染-- //
    var colorList = {
        'default': ['#d9edf6', '#90b7c9'],
        'error': ['#f2dedf', '#b25654'],
        'success': ['#def0d8', '#558954'],
        'warning': ['#fdf8e4', '#8e713f']
    }
    CssUtil.setCss(title, {
        'background': colorList[this.cfg.type][0],
        'color': colorList[this.cfg.type][1]
    });
    // --关闭图标-- //
    this.btnClose = document.createElement('span');
    this.btnClose.innerHTML = '\u0078';
    CssUtil.setCss(this.btnClose, {
        'diaplay': 'block',
        'text-align': 'center',
        'width': '20px',
        'height': '20px',
        'line-height': '16px',
        'font-weight': 'normal',
        'position': 'absolute',
        'top': '50%',
        'right': '5px',
        'margin-top': '-10px',
        'color': '#ddd',
        'cursor': 'pointer'
    });
    title.appendChild(this.btnClose);
    var btnClose = this.btnClose;
    EventUtil.addEvent(btnClose, 'mouseover', function(){
        CssUtil.setCss(btnClose, {
            'color': '#bbb'
        });
    });
    EventUtil.addEvent(btnClose, 'mouseout', function(){
        CssUtil.setCss(btnClose, {
            'color': '#ddd'
        });
    });
    // --内容-- //
    var content = document.createElement('div');
    content.innerHTML = this.cfg.content;
    CssUtil.setCss(content, {
        'height': '120px',
        'line-height': '120px',
        'text-align': 'center'
    });
    this.container.appendChild(content);
    // --容器渲染-- //
    CssUtil.setCss(this.container, {
        'width': '500px',
        'background': '#fff',
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        '-webkit-transform': 'translate(-50%, -50%)',
        'font-family': 'microsoft yahei',
        'border-radius': '8px',
        'overflow': 'hidden',
        'box-shadow': '0 0 8px #888',
        'z-index': 999
    });
    // --是否使用遮罩-- //
    if(this.cfg.useMask){
        this.mask = document.createElement('div');
        document.body.appendChild(this.mask);
        CssUtil.setCss(this.mask, {
            'position': 'fixed',
            'top': 0,
            'bottom': 0,
            'left': 0,
            'right': 0,
            'background': 'rgba(0, 0, 0, 0.4)',
            'display': 'none',
            'z-index': 100
        });
    }
}
// --添加监听事件[关闭按钮]-- //
Dialog.prototype.listenBtnCloseEvent = function(){
    var _this = this;
    EventUtil.addEvent(this.btnClose, 'click', function(){
        _this.hide();
    });
}
/*
* 展示 dialog
**/
Dialog.prototype.show = function(){
    console.log("show");
    CssUtil.setCss(this.container, {
        'display': 'block'
    });
    // --如果使用了遮罩-- //
    if(this.cfg.useMask){
        CssUtil.setCss(this.mask, {
            'display': 'block'
        });
    }
}
/*
* 隐藏 dialog
**/
Dialog.prototype.hide = function(){
    console.log("hide");
    CssUtil.setCss(this.container, {
        'display': 'none'
    });
    // --如果使用了遮罩-- //
    if(this.cfg.useMask){
        CssUtil.setCss(this.mask, {
            'display': 'none'
        });
    }
}
/*
* 销毁 dialog
**/
Dialog.prototype.distroy = function(){
    console.log("distroy");
    document.body.removeChild(this.container);
}

// ---------Alert-------- //

var Alert = function(){}
extend(Alert, Dialog);
Alert.prototype.init = function(cfg){
    console.log("init");
    this.param(cfg);
    this.create();
    this.render();
    this.renderOperationPanel();
    this.listenBtnCloseEvent();
    this.listenBtnSureEvent();
    this.hide();
}
/*
* 渲染控制面板
**/
Alert.prototype.renderOperationPanel = function(){
    console.log("alert operation panel render");
    this.operationPanel = document.createElement('div');
    CssUtil.setCss(this.operationPanel, {
        'overflow': 'hidden',
        'padding': '15px',
        'border-top': '1px solid #ddd'
    });
    this.container.appendChild(this.operationPanel);
    // --添加确认按钮-- //
    this.btnSure = document.createElement('button');
    this.btnSure.innerHTML = '确定';
    CssUtil.setCss(this.btnSure, {
        'padding': '0 15px',
        'height': '35px',
        'background': '#428bca',
        'border': '1px solid #ccc',
        'float': 'right',
        'color': '#fff',
        'font-size': '16px',
        'border-radius': '8px',
        'cursor': 'pointer',
        'outline': 'none',
        'margin': '0 5px'
    });
    this.operationPanel.appendChild(this.btnSure);
}
/*
* 添加监听事件[确定按钮]
**/
Alert.prototype.listenBtnSureEvent = function(){
    var _this = this;
    EventUtil.addEvent(this.btnSure, 'click', function(){
        _this.hide();
    });
}

// ---------Confirm-------- //

var Confirm = function(){}
extend(Confirm, Alert);
Confirm.prototype.init = function(cfg){
    this.param(cfg)
    this.create();
    this.render();
    this.renderOperationPanel();
    this.renderCancelBtn();
    this.listenBtnCloseEvent();
    this.listenBtnSureEvent();
    this.listenBtnCancelEvent();
    this.hide();
}
/*
* 渲染控制面板中的[取消按钮]
**/
Confirm.prototype.renderCancelBtn = function(){
    console.log("confirm cancel button render");
    // --添加确认按钮-- //
    this.btnCancel = document.createElement('button');
    this.btnCancel.innerHTML = '取消';
    CssUtil.setCss(this.btnCancel, {
        'padding': '0 15px',
        'height': '35px',
        'background': '#fff',
        'border': '1px solid #ccc',
        'float': 'right',
        'color': '#000',
        'font-size': '16px',
        'border-radius': '8px',
        'cursor': 'pointer',
        'outline': 'none',
        'margin': '0 5px'
    });
    this.operationPanel.insertBefore(this.btnCancel, this.btnSure);
}
/*
* 添加监听事件[取消按钮]
**/
Confirm.prototype.listenBtnCancelEvent = function(){
    var _this = this;
    EventUtil.addEvent(this.btnCancel, 'click', function(){
        _this.hide();
        _this.emit('result', false);
    });
}
/*
* 重写覆盖父类[关闭按钮]事件
**/
Confirm.prototype.listenBtnCloseEvent = function(){
    var _this = this;
    EventUtil.addEvent(this.btnClose, 'click', function(){
        _this.hide();
        _this.emit('result', false);
    });
}
/*
* 重写覆盖父类[确认按钮]事件
**/
Confirm.prototype.listenBtnSureEvent = function(){
    var _this = this;
    EventUtil.addEvent(this.btnSure, 'click', function(){
        _this.hide();
        _this.emit('result', true);
    });
}
