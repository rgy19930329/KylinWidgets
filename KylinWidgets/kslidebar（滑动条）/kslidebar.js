function Kslidebar(bar){

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
        }
    }

	/**
		animation工具
	*/
	var AnimUtil = {
		//动画
        animate: function(source, obj, opr, callback){
            var opr = opr || {};

            var easing = opr.easing || 'ease';
            var dur = opr.dur || 500;
            var str = easing + " " + dur + "ms";

            CssUtil.setCss(source, {
                'transition': str,
                '-moz-transition': str,
                '-webkit-transition': str,
                '-o-transition': str
            });

           	CssUtil.setCss(source, obj);

            /*----------------*/

            function getTransitionEndEvent(){
                var ele = document.createElement('fakeelement');
                var obj = {
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd'
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

	/**
		计算元素的绝对位置
	*/
	function getAbsPoint(ele) {
		var x = ele.offsetLeft;
		var y = ele.offsetTop;
		while (ele = ele.offsetParent) {
			x += ele.offsetLeft;
			y += ele.offsetTop;
		}
		return {
			'x': x,
			'y': y
		};
	};

	/*-----------------------------*/

	var isShowProgress = false;// 是否显示进度条

	var currentValue = null;
	var maxValue = null;
	var minValue = null;
	var barWidth = null;

	var inner = document.createElement('div');
	bar.appendChild(inner);
	var showDiv = document.createElement('div');
	bar.appendChild(showDiv);
	var ctrlBtn = document.createElement('div');
	bar.appendChild(ctrlBtn);


	function getMaxValue(){
		return maxValue;
	}

	function getMinValue(){
		return minValue;
	}

	function getProcess(){
		var process = Math.round( (currentValue - minValue) * 100 / (maxValue - minValue) );
		return process + '%';
	}

	function setProgress(p){
		var process = parseInt(p.slice(0, -1));
		var allValue = maxValue - minValue;
		var value = Math.round( minValue + (process / 100) * allValue );
		setValue(value);
	}

	function getValue(){
		return currentValue;
	}

	function setValue(value){
		if(value <= maxValue && value >= minValue){
			currentValue = value;

			var childValue = currentValue - minValue;
			var allValue = maxValue - minValue;

			var innerWidth = ( childValue / allValue ) * barWidth + 'px';
			AnimUtil.animate(inner, {
				'width': innerWidth
			});
			showDiv.innerHTML = isShowProgress ? getProcess() : '';
		}
	}

	function init(obj, data){
		var obj = obj || {};
		var data = data || {};

		var bwidth = obj.width || '600px';
		var bheight = obj.height || '15px';
		var cwidth = obj.cwidth || '20px';
		var cColor = obj.ccolor || '#ddd';
		var cradius = obj.cIsArc ? '50%' : '0';
		var radius = obj.isFillet ? parseInt(bheight) / 2 + 'px' : '0';
		var proColor = obj.proColor || 'orange';
		var bgColor = obj.bgColor || '#eee';
		var textColor = obj.textColor || '#fff';
		isShowProgress = obj.isShowProgress;

		currentValue = data.value || 50;
		maxValue = data.maxValue || 100;
		minValue = data.minValue || 0;
		barWidth = parseInt(bwidth);

		var childValue = currentValue - minValue;
		var allValue = maxValue - minValue;
		var innerWidth = ( childValue / allValue ) * parseInt(bwidth) + 'px';

		CssUtil.setCss(bar, {
			'width': bwidth,
			'height': bheight,
			'background': bgColor,
			'border-radius': radius,
			'position': 'relative'
		});

		CssUtil.setCss(inner, {
			'width': innerWidth,
			'height': '100%',
			'background': proColor,
			'border-radius': radius
		});

		CssUtil.setCss(showDiv, {
			'width': bwidth,
			'height': bheight,
			'position': 'absolute',
			'top': '0',
			'text-align': 'center',
			'font-size': bheight,
			'line-height': bheight,
			'color': textColor
		});
		showDiv.innerHTML = isShowProgress ? getProcess() : '';

		var realLeft = (childValue / allValue) * barWidth - parseInt(cwidth)/2 + 'px';
		CssUtil.setCss(ctrlBtn, {
			'width': cwidth,
			'height': parseInt(bheight) + 10 + 'px',
			'background': cColor,
			'border-radius': radius,
			'position': 'absolute',
			'top': '-5px',
			'left': realLeft,
			'cursor': 'pointer',
			'border-radius': cradius
		});

		/**
			控制块滑动事件
		*/
		ctrlBtn.onmousedown = function(e) {
	        var e = e || window.event;
	        x = e.offsetX;
	        document.onmousemove = function(e) {
	            var evt = e || window.event;
	            var parentX = getAbsPoint(bar).x;
	            var leftDist = evt.clientX - parentX - x;
	            var realX = leftDist + 10;

	            if(leftDist > -10 && leftDist < barWidth - 10){
	            	CssUtil.setCss(ctrlBtn, {
		            	'left': leftDist + "px"
		            });

		            var p = Math.round(realX * 100 / barWidth);
		            setProgress(p + '%');
	            }
	        };
	        document.onmouseup = function() {
	            document.onmousemove = null;
	            document.onmouseup = null;
	        };
	    };

	    bar.onclick = function(e){
	    	var evt = e || window.event;

	    	if(evt.target !== showDiv){
	    		return;
	    	}
	    	var leftDist = evt.offsetX;
	    	var realX = leftDist;

			if (leftDist >= 0 && leftDist <= barWidth) {
				CssUtil.setCss(ctrlBtn, {
					'left': leftDist - 10 + "px"
				});
				// AnimUtil.animate(ctrlBtn, {
				// 	'left': leftDist - 10 + "px"
				// });
				var p = Math.round(realX * 100 / barWidth);
				setProgress(p + '%');
			}
	    }
	}

	return {
		init: init,
		getValue: getValue,
		setValue: setValue,
		getMaxValue: getMaxValue,
		getMinValue: getMinValue,
		getProcess: getProcess
	}

}