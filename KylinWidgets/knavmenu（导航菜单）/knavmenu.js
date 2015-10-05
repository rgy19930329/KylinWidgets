
function Knavmenu(nav){

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
        }
	}

	var EventUtil = {

        addEvent: function(element, eventType, handler){
            if(element.addEventListener){//标准浏览器
                element.addEventListener(eventType, handler, false);
            }else{
                element.attachEvent('on' + eventType, handler);
            }
        },

        //获取事件
        getEvent: function(event){
            return event || window.event;
        },
        //获取目标元素
        getTarget: function(event){
            return this.getEvent(event).target || this.getEvent(event).srcElement;
        }
    }

    var DomUtil = {

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

    var AnimUtil = {
    	//动画
        animate: function(source, obj, opr, callback){
            var opr = opr || {};

            var easing = opr.easing || 'ease';
            var dur = opr.dur || 1000;
            var str = easing + " " + dur + "ms";

            CssUtil.setCss(source, {
                'transition': str,
                '-moz-transition': str,
                '-webkit-transition': str,
                '-o-transition': str
            });

            CssUtil.setCss(source, obj);
        }
    }

	
	function init(){

		CssUtil.setCss(nav, {
			'overflow': 'hidden'
		});

		var itemList = nav.getElementsByClassName('item');
		CssUtil.setCss(itemList, {
			'display': 'none',
			'position': 'absolute'
		});

		var content = nav.querySelectorAll('menu');
		CssUtil.setCss(content, {
			'cursor': 'pointer',
			'transition': 'all 300ms ease'
		});

		var mylist = nav.getElementsByTagName('li');
		CssUtil.setCss(mylist, {
			'float': 'left'
		});

		for(var i = 0, len = mylist.length; i < len; i++){
			EventUtil.addEvent(mylist[i], 'mouseover', function(k){
				return function(){
					var div = DomUtil.children(mylist[k], 'div');
					CssUtil.setCss(div[0], {
						'display': 'block'
					});
				}
			}(i));

			EventUtil.addEvent(mylist[i], 'mouseout', function(k){
				return function(){
					var div = DomUtil.children(mylist[k], 'div');
					CssUtil.setCss(div[0], {
						'display': 'none'
					});
				}
			}(i));
		}

	}

	return {
		init: init
	}
}

