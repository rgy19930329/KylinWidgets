
function Kfullpage(bar, content){

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
            if (source.currentStyle) {
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
        }
    }

	var AnimUtil = {

		animate: function(source, obj, opr, callback){
            var opr = opr || {};

            var easing = opr.easing || 'ease';
            var dur = opr.dur || 1000;
            var str = easing + " " + dur + "ms";

            CssUtil.setCss(source, {
                'transition': str,
                '-moz-transition': str,
                '-webkit-transition': str,
                '-o-transition': str,
                '-ms-transition': str
            });

            CssUtil.setCss(source, obj);

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

            EventUtil.addEvent(source, transitionend, callback);
        }
	}

	// -------------------- //

	var doce = document.documentElement;
	var swidth = doce.clientWidth;
	var sheight = doce.clientHeight;
	var isLock = false;

	var divList = content.getElementsByClassName('section');

	var index = 0;// 当前section的索引

	function getIndex(){
		return index;
	}

	function fresh(){
		swidth = doce.clientWidth;
		sheight = doce.clientHeight;

		CssUtil.setCss(bar, {
			'height': sheight + 'px'
		});

		CssUtil.setCss(divList, {
			'height': sheight + 'px'
		});

		// window.resize的时候用来调节当前块到正确位置
		var ctop = CssUtil.getCss(content, 'top');
		ctop = Math.abs( parseInt(ctop) );

		var num = Math.round(ctop / sheight) + 1;
		if(num > divList.length){
			num = divList.length;
		}
		
		var dist = (num - 1) * sheight;
		CssUtil.setCss(content, {
			'top': -dist + 'px'
		});
	}
	
	function init(obj){
		var obj = obj || {};
		var dur = obj.dur || 500;
		var easing = obj.easing || 'ease-out';

		// ------- //

		CssUtil.setCss(bar, {
			'position': 'relative',
			'overflow': 'hidden'
		});

		CssUtil.setCss(content, {
			'position': 'absolute',
			'width': '100%',
			'top': '0'
		});

		CssUtil.setCss(divList, {
			'width': '100%',
			'box-sizing': 'border-box'
		});

		// ------- //

		fresh();

		// ------- //

		window.onresize = fresh;

		// ------- //

		bar.onmousewheel = function(event){

			var dist = event.wheelDelta;

			if(dist > 0){
				dist = sheight;
			}else{
				dist = -sheight;
			}

			var ctop = CssUtil.getCss(content, 'top');

			var topDist = parseInt(ctop) + dist;
			var cheight = CssUtil.getCss(content, 'height');

			if(parseInt(cheight) == -topDist || topDist > 0){
				return;
			}

			if(isLock){
				return;
			}
			isLock = true;

			index = Math.floor( Math.abs(topDist) / sheight );

			AnimUtil.animate(content, {
				'top': topDist + 'px'
			}, {
				'dur': dur,
				'easing': easing
			}, function(){
				isLock = false;
			});
		}

		// ----------- //

		var mydist = 0;
		var pos1, pos2;
		EventUtil.addEvent(bar, 'touchstart', function(e){
			var touch = e.touches[0];
			pos1 = touch.pageY;
			console.log(pos1);
		});

		EventUtil.addEvent(bar, 'touchend', function(e){
			var touch = e.changedTouches[0];
			pos2 = touch.pageY;
			console.log(pos2)
			// 移动10个像素以上
			if (pos1 - pos2 > 10) {
				mydist = sheight;
			}

			if(pos2 - pos1 > 10){
				mydist = -sheight;
			}

			var ctop = CssUtil.getCss(content, 'top');

			var topDist = parseInt(ctop) + mydist;
			var cheight = CssUtil.getCss(content, 'height');

			if(parseInt(cheight) == -topDist || topDist > 0){
				return;
			}

			if(isLock){
				return;
			}
			isLock = true;

			index = Math.floor( Math.abs(topDist) / sheight );

			AnimUtil.animate(content, {
				'top': topDist + 'px'
			}, {
				'dur': dur,
				'easing': easing
			}, function(){
				isLock = false;
			});
		});

		

	}

	return {
		init: init,
		getIndex: getIndex
	}
}
