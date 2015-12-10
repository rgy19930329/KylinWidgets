function Ktimeaxis(bar){

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

    var DomUtil = {

    	findNextSilblingByTagName: function(source, tag){// 根据标签寻找下一个兄弟节点
            var obj = source;
            while(true){
                obj = obj.nextSibling;
                if(obj.nodeType == 3){
                    continue;
                }
                if(obj.tagName.toLowerCase() == tag){
                    break;
                }
            }
            return obj;
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
        }
    };
	
	function init(obj, data){
		var obj = obj || {};
		var bwidth = obj.width || '800px';
		var color = obj.color || '#59f';
		var yearSize = obj.yearSize || '125%';
		var daySize = obj.daySize || '100%';
		var msgSize = obj.msgSize || '90%';

		CssUtil.setCss(bar, {
			'width': bwidth
		});

		// -------------------- //
		var data = data || [];
		console.log(data);
		for(var i = 0, len = data.length; i < len; i++){
			var _year = data[i].year;
			var _detail = data[i].detail;
			// ------- //
			var section = document.createElement('section');
			bar.appendChild(section);
			var f_title = document.createElement('div');
			section.appendChild(f_title);
			CssUtil.setCss(f_title, {
				'width': '120px',
				'height': '50px',
				'line-height': '50px'
			});
			var year = document.createElement('span');
			var drop = document.createElement('em');
			year.innerHTML = _year;
			drop.innerHTML = '\u25bc';
			f_title.appendChild(year);
			f_title.appendChild(drop);
			CssUtil.setCss(year, {
				'font-size': yearSize,
				'font-weight': 'bold',
				'color': color
			});
			CssUtil.setCss(drop, {
				'font-style': 'normal',
				'color': color,
				'cursor': 'pointer',
				'float': 'right',
				'position': 'relative',
				'right': '2px'
			});
			var myul = document.createElement('ul');
			section.appendChild(myul);
			CssUtil.setCss(myul, {
				'overflow': 'hidden'
			});

			// ---------------- //
			for(var j = 0; j < _detail.length; j++){
				var _day = _detail[j].day;
				var _content = _detail[j].content;
				// ------- //
				var myli = document.createElement('li');
				myul.appendChild(myli);
				var s_title = document.createElement('div');
				var s_content = document.createElement('div');
				myli.appendChild(s_title);
				myli.appendChild(s_content);
				CssUtil.setCss(s_title, {
					'width': '120px',
					'float': 'left',
					'padding-top': '10px'
				});
				CssUtil.setCss(s_content, {
					'overflow': 'hidden',
					'padding-left': '40px',
					'padding-bottom': '10px',
					'padding-top': '10px',
					'border-left': '2px solid ' + color,
					'position': 'relative',
					'right': '11px',
					'font-size': msgSize
				});
				var day = document.createElement('span');
				s_title.appendChild(day);
				day.innerHTML = _day;
				CssUtil.setCss(day, {
					'font-size': daySize
				});
				var circle_b = document.createElement('b');
				var circle_i = document.createElement('i');
				circle_b.appendChild(circle_i);
				s_title.appendChild(circle_b);
				CssUtil.setCss(circle_b, {
					'display': 'block',
					'float': 'right',
					'width': '20px',
					'height': '20px',
					'border': '1px solid ' + color,
					'border-radius': '50%',
					'position': 'relative',
					'box-sizing': 'border-box'
				});
				CssUtil.setCss(circle_i, {
					'display': 'block',
					'width': '12px',
					'height': '12px',
					'background': color,
					'border-radius': '50%',
					'position': 'absolute',
					'left': '50%',
					'top': '50%',
					'margin-left': '-6px',
					'margin-top': '-6px'
				});
				// --- //
				for(var t = 0; t < _content.length; t++){
					var item = _content[t];
					item = '<p>' + item + '</p>';
					_content[t] = item;
				}
				var str_msg = _content.join('');
				s_content.innerHTML = str_msg;
			}
		}

		// --------------获取ul高度，返回数组---------------//
		var heightArr = [];
		var uls = bar.getElementsByTagName('ul');
		for(var i = 0, len = uls.length; i < len; i++){
			var ulHeight = CssUtil.getCss(uls[i], 'height');
			CssUtil.setCss(uls[i], {
				'height': ulHeight
			});
			heightArr.push(ulHeight);
		}

		// --------------下拉按钮---------------//
		var drop_btns = bar.getElementsByTagName('em');
		for(var i = 0, len = drop_btns.length; i < len; i++){
			EventUtil.addEvent(drop_btns[i], 'click', function(k){
				return function(){
					var ppnode = drop_btns[k].parentNode.parentNode;
					if(ppnode.getAttribute('tag') == undefined){
						ppnode.setAttribute('tag', 'opened');
					}
					var myul = ppnode.getElementsByTagName('ul')[0];
					if(ppnode.getAttribute('tag') == 'opened'){
						AnimUtil.animate(myul, {
							'height': '0'
						});
						AnimUtil.animate(drop_btns[k], {
							'transform': 'rotate(-90deg)'
						});
						ppnode.setAttribute('tag', 'closed');
					}else{
						AnimUtil.animate(myul, {
							'height': heightArr[k]
						});
						AnimUtil.animate(drop_btns[k], {
							'transform': 'rotate(0deg)'
						});
						ppnode.setAttribute('tag', 'opened');
					}
				}
			}(i));
		}
		

	}

	return {
		init: init
	}
}

