function Kfoldboard(board){

	/**
		css工具
	*/
	var CssUtil = {

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
            if (source.style[attr]) {
                return source.style[attr];
            } else if (source.currentStyle) {
                return source.currentStyle[attr];
            } else {
                return getComputedStyle(source, false)[attr];
            }
        },

        addClass: function(source, value){
            if(!this.hasClass(source, value)){
                source.className += ' ' + value;
            }
        },

        hasClass: function(source, value){
            return source.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
        },

        removeClass: function(source, value){
            if(this.hasClass(source, value)){
                source.className = source.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '')
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
    var EventUtil = {
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

	// ------------------------------------------- //

	function init(obj){
		var obj = obj || {};
		var dur = obj.dur || 0;

		var easing = 'linear';
        var str = easing + " " + dur + "ms";

		var cList = board.querySelectorAll('.item-content');
        CssUtil.setCss(cList, {
            'transition': str,
            '-moz-transition': str,
            '-webkit-transition': str,
            '-o-transition': str
        });

        // 切换效果
        var list = board.querySelectorAll('li');
		var cList = board.querySelectorAll('.item-title');
		for(var i = 0, len = cList.length; i < len; i++){
			EventUtil.addEvent(cList[i], 'click', function(k){
				return function(){
					var ele = cList[k].parentNode.querySelector('.item-content');
					CssUtil.removeClassAll(list, 'item-selected');
					CssUtil.addClass(ele.parentNode, 'item-selected');
				}
			}(i));
		}
		
	}

	return {
		init: init
	}

}