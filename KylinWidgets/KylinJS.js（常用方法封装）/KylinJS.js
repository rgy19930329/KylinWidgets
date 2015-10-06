
(function() {
    //构造自己的命名空间。  
    window.ky = {};

    window.ky.apiInfo = {
        apiName : 'ky',
        apiVersion : '1.0.0'
    };

    /**
        css工具
    */
    window.ky.CssUtil = {

        toCamel: function(name){
            return name.replace(/-[a-z]{1}/g, function(item){
                return item.slice(1).toUpperCase();
            });
        },

        setCss: function(source, obj){
            if(Object.prototype.toString.call(source) == '[object String]'){
                var list = document.querySelectorAll(source);
                arguments.callee(list, obj);
            }else if(Object.prototype.toString.call(source) == '[object NodeList]' || 
                Object.prototype.toString.call(source) == '[object HTMLCollection]'){
                for(var i = 0, len = source.length; i < len; i++){
                    for(var k in obj){
                        source[i].style[this.toCamel(k)] = obj[k];
                    }
                }
            }else{
                for(var k in obj){
                    source.style[this.toCamel(k)] = obj[k];
                }
            }
        },

        getCss: function(source, attr) {
            if (source.currentStyle) {
                return source.currentStyle[attr];
            } else {
                return getComputedStyle(source, false)[attr];
            }
        },

        hasClass: function(source, value){
            return source.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
        },

        addClass: function(source, value){
            if(!this.hasClass(source, value)){
                source.className += ' ' + value;
            }
        },

        removeClass: function(source, value){
            if(this.hasClass(source, value)){
                source.className = source.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '')
            }
        },

        addClassAll: function(source, value){
            for(var i = 0, len = source.length; i < len; i++){
                this.addClass(source[i], value);
            }
        },

        removeClassAll: function(source, value){
            for(var i = 0, len = source.length; i < len; i++){
                this.removeClass(source[i], value);
            }
        }
    }

    /**
        event工具
    */
    window.ky.EventUtil = {
        //添加事件
        addEvent: function(element, eventType, handler){
            if(element.addEventListener){//标准浏览器
                element.addEventListener(eventType, handler, false);
            }else{
                element.attachEvent('on' + eventType, handler);
            }
        },
        //移除事件
        removeEvent: function(element, eventType, handler){
            if(element.removeEventListener){//标准浏览器
                element.removeEventListener(eventType, handler, false);
            }else{
                element.detachEvent('on' + eventType, handler);
            }
        },
        //获取事件
        getEvent: function(event){
            return event || window.event;
        },
        //获取目标元素
        getTarget: function(event){
            return this.getEvent(event).target || this.getEvent(event).srcElement;
        },
        //阻止默认行为
        preventDefault: function(event){
            var evt = this.getEvent(event);
            if(evt.preventDefault){//标准浏览器
                evt.preventDefault();
            }else{
                evt.returnValue = false;
            }
        },
        //阻止事件冒泡
        stopPropagation: function(event){
            var evt = this.getEvent(event);
            if(evt.stopPropagation){//标准浏览器
                evt.stopPropagation();
            }else{
                evt.cancelBubble = true;
            }
        }
    };

    /**
        animation工具
    */
    window.ky.AnimUtil = {
        //透明度
        opacity: function(source, dur){
            var per = 0;
            var startTime = Date.now();

            requestAnimationFrame(function f() {
               if (per >= 1) {
                   source.style.opacity = 1;// 动画结束
               } else {
                   per = (Date.now() - startTime) / dur;

                   source.style.opacity = per * 1;
                   requestAnimationFrame(f);
               }
            });
        },
        //左移
        moveLeft: function(source, dist, dur, callback){
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
        moveRight: function(source, dist, dur, callback){
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

        //动画
        animate: function(source, obj, opr, callback){
            var opr = opr || {};

            var easing = opr.easing || 'ease';
            var dur = opr.dur || 1000;
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

            function getTransitionEndEvent(){
                var ele = document.createElement('fakeelement');
                var obj = {
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MsTransition': 'msTransitionEnd'
                }
                for(var i in obj){
                    if(ele.style[i] !== undefined){
                        return obj[i];
                    }
                }
            }

            var transitionend = getTransitionEndEvent();

            ky.EventUtil.addEvent(source, transitionend, callback);
        }
    }

    /**
        dom工具
    */
    window.ky.DomUtil = {

        insertBefore: function(source, newNode, existNode){
            source.insertBefore(newNode, existNode);
        },

        insertAfter: function(source, newNode, existNode){
            source.insertBefore(newNode, existNode.nextSibling);
        },

        siblings: function(source, selector){
            var parent = source.parentNode;
            var list = parent.querySelectorAll(selector);
            return list;
        },

        children: function(source, selector){
            var list = source.querySelectorAll(selector);
            return list;
        }
    }

})();
