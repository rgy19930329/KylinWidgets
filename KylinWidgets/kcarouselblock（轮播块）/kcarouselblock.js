
function Kcarouselblock(carousel, pilot){

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
	            Object.prototype.toString.call(source) == '[object HTMLCollection]' ||
	            Object.prototype.toString.call(source) == '[object Array]'){
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
	};

	var EventUtil = {
	    //添加事件
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
	};

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

	        EventUtil.addEvent(source, transitionend, callback);
	    },

	    createKeyframes: function(source, obj){
	        var styleDom = document.createElement('style');
	        var process = '';
	        for(var i in obj){
	            process += (i + obj[i]);
	        }
	        var prefix = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
	        var str = '';
	        for(var i = 0; i < prefix.length; i++){
	            str += ('@' + prefix[i] + 'keyframes ' + source + '{' + process + '}');
	        }
	        styleDom.innerHTML = str;
	        document.getElementsByTagName("head")[0].appendChild(styleDom);
	    },

	    createAnimation: function(source, animConfig, keyframesConfig){
	        var animConfig = animConfig || {};
	        var dur = animConfig.dur || 1000;// 每次循环持续时间
	        var easing = animConfig.easing || 'linear';// 缓动函数
	        var times = animConfig.times || 'infinite';// 循环次数

	        var motion_name = 'motion_' + Math.random().toString().slice(2);
	        console.log(motion_name)
	        var param = motion_name + ' ' + dur + ' ' + easing + ' ' + times;
	        CssUtil.setCss(source, {
	            'animation': param,
	            '-webkit-animation': param,
	            '-moz-animation': param,
	            '-o-animation': param,
	            '-ms-animation': param
	        });

	        this.createKeyframes(motion_name, keyframesConfig);
	    }
	};

	// ------------------ //

	var myInnerList = carousel.querySelector('.list-carousel-content');
	var myItems = myInnerList.querySelectorAll('.carousel-content-item');
	var mySquareDots = pilot.querySelectorAll('.dot');
	
	function init(opts, pilot){

		var defaults = {
			"speed": 5000, // 轮播间隔时间
			"dur": 500, // 动画持续时间
			"direction": "left", // 轮播方向
			"index": 0 // 指定当前索引
		};

		for(var key in opts){
			defaults[key] = opts[key];
		}

		if(defaults.dur > defaults.speed){
			alert("kcarouselblock组件参数错误");
		}

		// --------- //
		//设置轮播最外层为溢出隐藏
		CssUtil.setCss(carousel, {
			"overflow": "hidden"
		});
		// 轮播块数量
		var itemNumber = myItems.length;
		// 获取轮播块宽度（类型Number）
		var twidth = parseInt( CssUtil.getCss(carousel, 'width') );

		var dur = defaults.dur;
		var index = defaults.index;
		var leftDist = -index * twidth;
		var isLock = false; // 开始轮播时上锁，轮播结束时解锁

		CssUtil.setCss(myInnerList, {
			"width": twidth * itemNumber + "px",
			"position": "relative",
			"left": leftDist + "px"
		});

		CssUtil.setCss(myItems, {
			"float": "left",
			"width": twidth + "px"
		});

		// 确定轮播的方向（向左还是向右）
		var move = defaults.direction == "right" ? prev : next;

		var clock = setInterval(function(){
			move(1);
		}, defaults.speed);

		function next(step){
			if(isLock){
				return;
			}
			// ---- //
			isLock = true;
			leftDist -= step * twidth;
			index += step;
			if(leftDist < -(itemNumber - 1) * twidth){
				leftDist = 0;
				index = 0;
			}
			AnimUtil.animate(myInnerList, {
				"left": leftDist + "px"
			}, {}, function(){
				isLock = false;
			});
			CssUtil.removeClassAll(mySquareDots, 'dot-active');
			CssUtil.addClass(mySquareDots[index], 'dot-active');
		}

		function prev(step){
			if(isLock){
				return;
			}
			// ---- //
			isLock = true;
			leftDist += step * twidth;
			index -= step;
			if(leftDist > 0){
				leftDist = -(itemNumber - 1) * twidth;
				index = itemNumber - 1;
			}
			AnimUtil.animate(myInnerList, {
				"left": leftDist + "px"
			}, {}, function(){
				isLock = false;
			});
			CssUtil.removeClassAll(mySquareDots, 'dot-active');
			CssUtil.addClass(mySquareDots[index], 'dot-active');
		}
		
		// ---- //

		(function(){
			for(var i = 0, len = mySquareDots.length; i < len; i++){
				EventUtil.addEvent(mySquareDots[i], 'click', (function(k){
					return function(){
						if(isLock){
							return;
						}
						// ---- //
						if(k === index){
							return;
						}else if(k > index){
							next(k - index);
						}else if(k < index){
							prev(index - k);
						}
					}
				})(i));
			}
		})();

	}

	return {
		init: init
	}
}



