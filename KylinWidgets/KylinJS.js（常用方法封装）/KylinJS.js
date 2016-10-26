/**
 * @desc KylinJS.js 精简型js基本库
 * @date 2015-8-1
 * @author rgy19930329 in github
 */
(function() {
    // 构造自己的命名空间  
    window.ky = {};
    // KylinJS.js库信息
    window.ky.apiInfo = {
        apiName: 'ky',
        apiVersion: '1.1.0'
    };
    window.ky.ajax = function(opts) {
        var defaults = {
            method: 'GET',
            url: '',
            data: '',
            dataType: 'json',
            async: true,
            success: function() {},
            error: function() {}
        }

        for (var key in opts) {
            defaults[key] = opts[key];
        }

        (function() {
            var str = '';
            for (var key in defaults.data) {
                str += (key + '=' + defaults.data[key] + '&');
            }
            defaults.data = str.slice(0);
        })();

        defaults.method = defaults.method.toUpperCase();
        if (defaults.method === 'GET' && defaults.data) {
            defaults.url += '?' + defaults.data;
        }

        if (defaults.method === 'GET') {
            doGet(defaults.url);
        } else if (defaults.method === 'POST') {
            doPost(defaults.url, defaults.data);
        }

        // -------------------------- //

        function createXmlHttp() {
            var xmlHttp = null;
            if (window.ActiveXObject) { //IE浏览器
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
            return xmlHttp;
        }

        function readyStateChange(xmlHttp) {
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    if (defaults.dataType === 'json') {
                        try {
                            defaults.success.call(xmlHttp, JSON.parse(xmlHttp.responseText));
                        } catch (e) {
                            throw new Error("数据解析错误！");
                        }
                    } else {
                        defaults.success.call(xmlHttp, xmlHttp.responseText);
                    }
                } else {
                    defaults.error.call(xmlHttp, xmlHttp.responseText);
                }
            }
        }

        function doGet(url) {
            var xmlHttp = createXmlHttp();
            xmlHttp.open("GET", url, true); //这里的true表示 异步传输
            xmlHttp.send(null);
            readyStateChange(xmlHttp);
        }

        function doPost(url, data) {
            var xmlHttp = createXmlHttp();
            xmlHttp.open("POST", url, true); //这里的true表示 异步传输
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.send(data);
            readyStateChange(xmlHttp);
        }
    };
    /**
     * base工具
     */
    window.ky.BaseUtil = {
        /**
         * @desc 判断是否是类数组
         * @param [o] [Any]
         * @return [boolean]
         */
        isArrayLike: function(o) {
            if (o && // o is not null, undefined, etc.
                typeof o === 'object' && // o is an object
                isFinite(o.length) && // o.length is a finite number
                o.length >= 0 && // o.length is non-negative
                o.length === Math.floor(o.length) && // o.length is an integer
                o.length < 4294967296) // o.length < 2^32
                return true; // Then o is array-like
            else
                return false;
        },
        /**
         * @desc 将类数组对象转化成数组
         * @param [obj] [Any]
         * @return [array]
         */
        makeArray: function(obj) {
            if (this.isArrayLike) {
                return Array.prototype.slice.call(obj);
            }
        },
        /**
         * @desc 转驼峰命名
         * @param [name] [string]
         * @return [string]
         */
        toCamel: function(name) {
            return name.replace(/-[a-z]{1}/g, function(item) {
                return item.slice(1).toUpperCase();
            });
        },

    };
    /**
     * css工具
     */
    window.ky.CssUtil = {
        /**
         * @desc 设置元素css样式值
         * @param [source, obj] [string | dom | doms, object]
         */
        setCss: function(source, obj) {
            if (Object.prototype.toString.call(source) == '[object String]') {
                var list = document.querySelectorAll(source);
                arguments.callee(list, obj);
            } else if (ky.BaseUtil.isArrayLike(source)) {
                for (var i = 0, len = source.length; i < len; i++) {
                    for (var k in obj) {
                        source[i].style[ky.BaseUtil.toCamel(k)] = obj[k];
                    }
                }
            } else {
                for (var k in obj) {
                    source.style[ky.BaseUtil.toCamel(k)] = obj[k];
                }
            }
        },
        /**
         * @desc 获取元素css样式值
         * @param [source, attr] [dom, string]
         */
        getCss: function(source, attr) {
            if (source.currentStyle) {
                return source.currentStyle[attr];
            } else {
                return getComputedStyle(source, false)[attr];
            }
        },
        /**
         * @desc 元素是否存在某个class
         * @param [source, value] [dom, string]
         * @return [boolean]
         */
        hasClass: function(source, value) {
            return source.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
        },
        /**
         * @desc 为元素添加某个class
         * @param [source, value] [dom, string]
         */
        addClass: function(source, value) {
            if (!this.hasClass(source, value)) {
                source.className += ' ' + value;
            }
        },
        /**
         * @desc 为元素移除某个class
         * @param [source, value] [dom, string]
         */
        removeClass: function(source, value) {
            if (this.hasClass(source, value)) {
                source.className = source.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '')
            }
        },
        /**
         * @desc 为所有元素(arraylike)添加存在某个class
         * @param [source, value] [doms, string]
         */
        addClassAll: function(source, value) {
            for (var i = 0, len = source.length; i < len; i++) {
                this.addClass(source[i], value);
            }
        },
        /**
         * @desc 为所有元素(arraylike)移除存在某个class
         * @param [source, value] [doms, string]
         */
        removeClassAll: function(source, value) {
            for (var i = 0, len = source.length; i < len; i++) {
                this.removeClass(source[i], value);
            }
        }
    };
    /**
     * event工具
     */
    window.ky.EventUtil = {
        /**
         * @desc 添加事件
         * @param [element, eventType, handler] [dom, string, function]
         */
        addEvent: function(element, eventType, handler) {
            if (element.addEventListener) { //标准浏览器
                element.addEventListener(eventType, handler, false);
            } else {
                element.attachEvent('on' + eventType, handler);
            }
        },
        /**
         * @desc 移除事件
         * @param [element, eventType, handler] [dom, string, function]
         */
        removeEvent: function(element, eventType, handler) {
            if (element.removeEventListener) { //标准浏览器
                element.removeEventListener(eventType, handler, false);
            } else {
                element.detachEvent('on' + eventType, handler);
            }
        },
        /**
         * @desc 获取事件
         */
        getEvent: function(event) {
            return event || window.event;
        },
        /**
         * @desc 获取目标元素
         */
        getTarget: function(event) {
            return this.getEvent(event).target || this.getEvent(event).srcElement;
        },
        /**
         * @desc 阻止默认行为
         */
        preventDefault: function(event) {
            var evt = this.getEvent(event);
            if (evt.preventDefault) { //标准浏览器
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        },
        /**
         * @desc 阻止事件冒泡
         */
        stopPropagation: function(event) {
            var evt = this.getEvent(event);
            if (evt.stopPropagation) { //标准浏览器
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        }
    };
    /**
        animation工具
    */
    window.ky.AnimUtil = {
        /**
         * @desc 透明度
         * @param [source, dur] [dom, number]
         */
        opacity: function(source, dur) {
            var per = 0;
            var startTime = Date.now();

            requestAnimationFrame(function f() {
                if (per >= 1) {
                    source.style.opacity = 1; // 动画结束
                } else {
                    per = (Date.now() - startTime) / dur;

                    source.style.opacity = per * 1;
                    requestAnimationFrame(f);
                }
            });
        },
        //左移
        moveLeft: function(source, dist, dur, callback) {
            var per = 0;
            var startTime = Date.now();
            var currentPos = parseInt(CssUtil.getCss(source, 'left'));
            dist = parseInt(dist);

            requestAnimationFrame(function f() {
                if (per >= 1) {
                    source.style.left = (currentPos - dist) + "px";
                    callback && callback();
                } else {
                    per = (Date.now() - startTime) / dur;

                    source.style.left = (currentPos - per * dist) + "px";
                    requestAnimationFrame(f);
                }
            });
        },
        //右移
        moveRight: function(source, dist, dur, callback) {
            var per = 0;
            var startTime = Date.now();
            var currentPos = parseInt(CssUtil.getCss(source, 'left'));
            dist = parseInt(dist);

            requestAnimationFrame(function f() {
                if (per >= 1) {
                    source.style.left = currentPos + dist + "px";
                    callback && callback();
                } else {
                    per = (Date.now() - startTime) / dur;

                    source.style.left = currentPos + per * dist + "px";
                    requestAnimationFrame(f);
                }
            });
        },
        /**
         * @desc 透明度
         * @param [source, obj, opr, callback] [dom, object, object, function]
         */
        animate: function(source, obj, opr, callback) {
            var opr = opr || {};

            var easing = opr.easing || 'ease';
            var dur;
            if (opr.dur == undefined) {
                dur = 1000;
            } else {
                dur = opr.dur;
            }
            var str = easing + " " + dur + "ms";

            ky.CssUtil.setCss(source, {
                'transition': str,
                '-moz-transition': str,
                '-webkit-transition': str,
                '-o-transition': str,
                '-ms-transition': str
            });

            ky.CssUtil.setCss(source, obj);

            /*----------------*/

            function getTransitionEndEvent() {
                var ele = document.createElement('fakeelement');
                var obj = {
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MsTransition': 'msTransitionEnd'
                }
                for (var i in obj) {
                    if (ele.style[i] !== undefined) {
                        return obj[i];
                    }
                }
            }

            var transitionend = getTransitionEndEvent();

            ky.EventUtil.addEvent(source, transitionend, callback);
        },
        /**
         * @desc 创建keyframes
         * @param [source, obj] [dom, object]
         */
        createKeyframes: function(source, obj) {
            var styleDom = document.createElement('style');
            var process = '';
            for (var i in obj) {
                process += (i + obj[i]);
            }
            var prefix = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
            var str = '';
            for (var i = 0; i < prefix.length; i++) {
                str += ('@' + prefix[i] + 'keyframes ' + source + '{' + process + '}');
            }
            styleDom.innerHTML = str;
            document.getElementsByTagName("head")[0].appendChild(styleDom);
        },
        /**
         * @desc 创建动画
         * @param [source, animConfig, keyframesConfig] [dom, object, object]
         */
        createAnimation: function(source, animConfig, keyframesConfig) {
            var animConfig = animConfig || {};
            var dur = animConfig.dur || 1000; // 每次循环持续时间
            var easing = animConfig.easing || 'linear'; // 缓动函数
            var times = animConfig.times || 'infinite'; // 循环次数

            var motion_name = 'motion_' + Math.random().toString().slice(2);
            console.log(motion_name)
            var param = motion_name + ' ' + dur + ' ' + easing + ' ' + times;
            ky.CssUtil.setCss(source, {
                'animation': param,
                '-webkit-animation': param,
                '-moz-animation': param,
                '-o-animation': param,
                '-ms-animation': param
            });

            this.createKeyframes(motion_name, keyframesConfig);
        }
    };
    /**
     * dom工具
     */
    window.ky.DomUtil = {
        /**
         * @desc 在元素之前插入
         * @param [source, newNode, existNode] [dom, object, object] [父级dom, 新的dom, 已经存在的dom]
         */
        insertBefore: function(source, newNode, existNode) {
            source.insertBefore(newNode, existNode);
        },
        /**
         * @desc 在元素之后插入
         * @param [source, newNode, existNode] [dom, object, object] [父级dom, 新的dom, 已经存在的dom]
         */
        insertAfter: function(source, newNode, existNode) {
            source.insertBefore(newNode, existNode.nextSibling);
        },
        /**
         * @desc 获取所有兄弟节点
         * @param [source, selector] [dom, string] [父级dom, 选择器]
         * @return [array]
         */
        siblings: function(source, selector) { // 返回数组
            var parent = source.parentNode;
            var list = parent.querySelectorAll(selector);
            var res = [];
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i] !== source) {
                    res.push(list[i]);
                }
            }
            return res;
        },
        /**
         * @desc 根据标签获取当前节点之后所有兄弟节点
         * @param [source, tag] [dom, string] [dom, 标签名]
         * @return [array]
         */
        findNextSilblingByTagName: function(source, tag) {
            var obj = source;
            while (true) {
                obj = obj.nextSibling;
                if (obj.nodeType == 3) {
                    continue;
                }
                if (obj.tagName.toLowerCase() == tag) {
                    break;
                }
            }
            return obj;
        },
        /**
         * @desc 根据标签获取当前节点之前所有兄弟节点
         * @param [source, tag] [dom, string] [dom, 标签名]
         * @return [array]
         */
        findPrevSilblingByTagName: function(source, tag) {
            var obj = source;
            while (true) {
                obj = obj.previousSibling;
                if (obj.nodeType == 3) {
                    continue;
                }
                if (obj.tagName.toLowerCase() == tag) {
                    break;
                }
            }
            return obj;
        },
        /**
         * @desc 获取所有子节点
         * @param [source, selector] [dom, string] [父级dom, 选择器]
         * @return [array]
         */
        children: function(source, selector) {
            var list = source.querySelectorAll(selector);
            return list;
        },
        /**
         * @desc 获取子元素在父容器中的索引
         * @param [parent, child] [dom, dom] [父dom, 子dom]
         * @return [number]
         */
        getIndex: function(parent, child) {
            var list = parent.childNodes;
            list = this.makeArray(list);
            for (var i = 0; i < list.length; i++) {
                if (list[i].nodeType == 3) {
                    list.splice(i, 1);
                }
            }
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i] == child) {
                    return i;
                }
            }
        }
    };

})();
