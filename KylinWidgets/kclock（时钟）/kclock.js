
function Kclock(bar){

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
	
	function init(obj){
		var obj = obj || {};
		var color = obj.color || '#59f';
		var size = obj.size || 'middle';
		var showScale = obj.showScale;
		if(showScale == undefined){
			showScale = true;
		}
		// -------------------------- //

		var point = document.createElement('div');
		var hour = document.createElement('div');
		var minute = document.createElement('div');
		var second = document.createElement('div');
		var wrap = document.createElement('div');
		var t_12 = document.createElement('div');
		t_12.innerHTML = '12';
		var t_3 = document.createElement('div');
		t_3.innerHTML = '3';
		var t_6 = document.createElement('div');
		t_6.innerHTML = '6';
		var t_9 = document.createElement('div');
		t_9.innerHTML = '9';

		var s_wrap = document.createElement('div');
		var t_1 = document.createElement('div');
		var t_2 = t_1.cloneNode();
		var t_4 = t_1.cloneNode();
		var t_5 = t_1.cloneNode();
		var t_7 = t_1.cloneNode();
		var t_8 = t_1.cloneNode();
		var t_10 = t_1.cloneNode();
		var t_11 = t_1.cloneNode();

		bar.appendChild(point);
		bar.appendChild(hour);
		bar.appendChild(minute);
		bar.appendChild(second);
		bar.appendChild(wrap);
		bar.appendChild(s_wrap);
		wrap.appendChild(t_12);
		wrap.appendChild(t_3);
		wrap.appendChild(t_6);
		wrap.appendChild(t_9);
		s_wrap.appendChild(t_1);
		s_wrap.appendChild(t_2);
		s_wrap.appendChild(t_4);
		s_wrap.appendChild(t_5);
		s_wrap.appendChild(t_7);
		s_wrap.appendChild(t_8);
		s_wrap.appendChild(t_10);
		s_wrap.appendChild(t_11);


		CssUtil.setCss(bar, {
			'width': '300px',
			'height': '300px',
			'border': '5px solid ' + color,
			'border-radius': '50%',
			'box-sizing': 'border-box',
			'position': 'relative'
		});

		CssUtil.setCss(point, {
			'position': 'absolute',
			'width': '20px',
			'height': '20px',
			'border-radius': '50%',
			'background': color,
			'left': '50%',
			'top': '50%',
			'margin-left': '-10px',
			'margin-top': '-10px'
		});

		CssUtil.setCss(hour, {
			'position': 'absolute',
			'width': '80px',
			'height': '4px',
			'background': color,
			'border-radius': '0 50% 50% 0',
			'top': '50%',
			'left': '50%',
			'margin-top': '-2px',
			'transform-origin': '0 2px'
		});

		CssUtil.setCss(minute, {
			'position': 'absolute',
			'width': '100px',
			'height': '3px',
			'background': color,
			'border-radius': '0 50% 50% 0',
			'top': '50%',
			'left': '50%',
			'margin-top': '-1.5px',
			'transform-origin': '0 1.5px'
		});

		CssUtil.setCss(second, {
			'position': 'absolute',
			'width': '140px',
			'height': '2px',
			'background': color,
			'border-radius': '0 50% 50% 0',
			'top': '50%',
			'left': '50%',
			'margin-top': '-1px',
			'transform-origin': '0 1px'
		});

		var divs = wrap.getElementsByTagName('div');
		CssUtil.setCss(divs, {
			'position': 'absolute',
			'font-family': "Microsoft Yahei",
			'font-size': '14px',
			'background': color,
			'width': '20px',
			'height': '20px',
			'color': '#fff',
			'border-radius': '50%',
			'text-align': 'center'
		});

		CssUtil.setCss(t_12, {
			'left': '50%',
			'margin-left': '-10px',
			'margin-top': '-10px'
		});

		CssUtil.setCss(t_3, {
			'left': '100%',
			'top': '50%',
			'margin-top': '-10px',
			'margin-left': '-10px'
		});

		CssUtil.setCss(t_6, {
			'left': '50%',
			'top': '100%',
			'margin-top': '-10px',
			'margin-left': '-10px'
		});

		CssUtil.setCss(t_9, {
			'top': '50%',
			'margin-top': '-10px',
			'margin-left': '-10px'
		});

		// --------- //
		var r_divs = s_wrap.getElementsByTagName('div');
		CssUtil.setCss(r_divs, {
			'width': '2px',
			'height': '8px',
			'border-left': '1px solid ' + color,
			'position': 'absolute',
			'left': '50%',
			'margin-left': '-1px',
			'transform-origin': '1px 145px',
		});

		CssUtil.setCss(t_1, {
			'transform': 'rotate(30deg)'
		});

		CssUtil.setCss(t_2, {
			'transform': 'rotate(60deg)'
		});

		CssUtil.setCss(t_4, {
			'transform': 'rotate(120deg)'
		});

		CssUtil.setCss(t_5, {
			'transform': 'rotate(150deg)'
		});

		CssUtil.setCss(t_7, {
			'transform': 'rotate(210deg)'
		});

		CssUtil.setCss(t_8, {
			'transform': 'rotate(240deg)'
		});

		CssUtil.setCss(t_10, {
			'transform': 'rotate(300deg)'
		});

		CssUtil.setCss(t_11, {
			'transform': 'rotate(330deg)'
		});

		// -------------------------- //

		if(size == 'small'){
			CssUtil.setCss(bar, {
				'width': '100px',
				'height': '100px'
			});
			CssUtil.setCss(point, {
				'width': '10px',
				'height': '10px',
				'margin-left': '-5px',
				'margin-top': '-5px'
			});
			CssUtil.setCss(r_divs, {
				'height': '5px',
				'transform-origin': '1px 45px'
			});
			CssUtil.setCss(hour, {
				'width': '25px'
			});
			CssUtil.setCss(minute, {
				'width': '30px'
			});
			CssUtil.setCss(second, {
				'width': '40px'
			});
		}else if(size == 'large'){
			CssUtil.setCss(bar, {
				'width': '600px',
				'height': '600px'
			});
			CssUtil.setCss(r_divs, {
				'height': '10px',
				'transform-origin': '1px 295px'
			});
			CssUtil.setCss(hour, {
				'width': '150px'
			});
			CssUtil.setCss(minute, {
				'width': '200px'
			});
			CssUtil.setCss(second, {
				'width': '280px'
			});
		}

		if(showScale == false){
			CssUtil.setCss(s_wrap, {
				'display': 'none'
			});
		}

		// -------------------------- //
		var myDate = new Date();
		var _hour = myDate.getHours();
		var _minute = myDate.getMinutes();
		var _second = myDate.getSeconds();
		console.log(_hour + ':' + _minute + ':' + _second);

		// ------根据当前时间初始化指针角度------- //
		var ang_s = -90 + (_second/60) * 360;
		var ang_m = -90 + ((_minute * 60 + _second)/3600) * 360;
		var _hour = _hour % 12;
		var ang_h = -90 + ((_hour * 3600 + _minute * 60 + _second)/43200) * 360;

		// -----秒针旋转------ //
		var animConfig_s = {
			'dur': '60s'
		}
		var keyframesConfig_s = {
	        '0%': '{transform: rotate(' + ang_s + 'deg);}',
	        '100%': '{transform: rotate(' + (ang_s + 360) + 'deg);}'
	    };
	    AnimUtil.createAnimation(second, animConfig_s, keyframesConfig_s);

	    // -----分针旋转------ //
	    var animConfig_m = {
			'dur': '3600s'
		}
		var keyframesConfig_m = {
	        '0%': '{transform: rotate(' + ang_m + 'deg);}',
	        '100%': '{transform: rotate(' + (ang_m + 360) + 'deg);}'
	    };
	    AnimUtil.createAnimation(minute, animConfig_m, keyframesConfig_m);

	    // -----时针旋转------ //
	    var animConfig_h = {
			'dur': '43200s'
		}
		var keyframesConfig_h = {
	        '0%': '{transform: rotate(' + ang_h + 'deg);}',
	        '100%': '{transform: rotate(' + (ang_h + 360) + 'deg);}'
	    };
	    AnimUtil.createAnimation(hour, animConfig_h, keyframesConfig_h);
	}

	return {
		init: init
	}
}
