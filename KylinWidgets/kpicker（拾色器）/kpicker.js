
function Kpicker(bar){

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
        },

        findPrevSilblingByTagName: function(source, tag){// 根据标签寻找上一个兄弟节点
            var obj = source;
            while(true){
                obj = obj.previousSibling;
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

    function rgbToHex(rgb) {
		rgb = rgb.substring(rgb.indexOf("(") + 1, rgb.indexOf(")") ).split(",");
		var s = "#";
		for (var i = 0; i < 3; i++) {
			var hex = Math.round(rgb[i]).toString(16);
			if (hex.length === 1) {
				hex = '0' + hex;
			}
			s += hex;
		}
		return s;
	}

	String.prototype.trim = function(){
		return this.replace(/(^\s+)|(\s+$)/, '');
	};

	function setColor(source, color){
		source.style.backgroundColor = color;
	}

	function setLayerSize(source){
		source.style.height = '1px';
	}

	// ------------------------------------- //

	var cur_color = 'rgb(' + 255 + ',' + 110 + ',' + 0 + ')';

	// ---返回颜色值--- //
	function getColor(flag){
		if(flag == undefined || flag == 'hex'){
			return rgbToHex(cur_color);
		}else{
			return cur_color;
		}
	}
	
	function init(obj){
		var obj = obj || {};
		var color = obj.color || '#59f';
		// ------------ //

		CssUtil.setCss(bar, {
			'border': '5px solid ' + color,
			'box-shadow': '5px 5px 5px #ccc',
			'width': '280px',
			'overflow': 'hidden',
			'padding': '20px',
			'font-family': "Microsoft Yahei",
			'-webkit-user-select':'none',
		    '-moz-user-select':'none',
		    '-ms-user-select':'none',
		    'user-select':'none'
		});

		var leftbox = document.createElement('div');
		bar.appendChild(leftbox);
		CssUtil.setCss(leftbox, {
			'width': '50px',
			'height': '306px',
			'float': 'left'
		});

		// ------------- //

		var rightbox = document.createElement('div');
		bar.appendChild(rightbox);
		var selected_color = document.createElement('div');
		var handler_color = document.createElement('div');
		rightbox.appendChild(selected_color);
		rightbox.appendChild(handler_color);

		CssUtil.setCss(rightbox, {
			'width': '200px',
			'height': '306px',
			'border': '2px solid ' + color,
			'float': 'right',
			'padding': '10px',
			'box-sizing': 'border-box',
			'box-shadow': '0 0 8px #aaa'
		});

		CssUtil.setCss(selected_color, {
			'height': '50px',
			'border': '1px solid #ccc',
			'margin-bottom': '5px'
		});

		var rgb_show = document.createElement('div');
		handler_color.appendChild(rgb_show);
		for(var i = 0; i < 3; i++){
			var div_p = document.createElement('div');
			var tip;
			if(i == 0){
				tip = 'R:';
			}else if(i == 1){
				tip = 'G:';
			}else if(i == 2){
				tip = 'B:';
			}
			
			div_p.innerHTML = 
				'<span>' + tip + '</span>' +
				'<input type="text" class="rgb_entry">' +
				'<div class="ctrl_p">' +
					'<div class="add_btn">▲</div>' +
					'<div class="cut_btn">▼</div>' +
				'</div>';
			CssUtil.setCss(div_p, {
				'display': 'inline-block',
				'padding': '5px 0'
			});
			rgb_show.appendChild(div_p);
		}
		var rgb_show_spans = rgb_show.getElementsByTagName('span');
		CssUtil.setCss(rgb_show_spans, {
			'display': 'inline-block',
			'width': '2em'
		});
		var rgb_entry = bar.getElementsByClassName('rgb_entry');
		CssUtil.setCss(rgb_entry, {
			'width': '100px',
			'height': '30px',
			'font-size': '120%',
			'font-family': "SimHei"
		});

		var ctrl_p = bar.getElementsByClassName('ctrl_p');
		CssUtil.setCss(ctrl_p, {
			'float': 'right',
			'margin-left': '3px'
		});

		var add_btn = bar.getElementsByClassName('add_btn');
		CssUtil.setCss(add_btn, {
			'margin-bottom': '2px'
		});

		var btns = bar.querySelectorAll('.ctrl_p div');
		CssUtil.setCss(btns, {
			'width': '30px',
			'height': '16px',
			'line-height': '16px',
			'text-align': 'center',
			'cursor': 'pointer',
			'background': '#ccc',
			'color': color,
			'-webkit-user-select':'none',
		    '-moz-user-select':'none',
		    '-ms-user-select':'none',
		    'user-select':'none'
		});

		for(var i = 0; i < btns.length; i++){
			EventUtil.addEvent(btns[i], 'mouseover', (function(k){
				return function(){
					CssUtil.setCss(btns[k], {
						'background': '#bbb'
					});
				}
			})(i));
			EventUtil.addEvent(btns[i], 'mouseout', (function(k){
				return function(){
					CssUtil.setCss(btns[k], {
						'background': '#ccc'
					});
				}
			})(i));
		}
		

		// ----- //
		var hex_show = document.createElement('div');
		handler_color.appendChild(hex_show);
		hex_show.innerHTML = 
			'<span>hex:</span>' + 
			'<input type="text" id="hex_entry">';
		CssUtil.setCss(hex_show, {
			'padding-top': '5px'
		});
		CssUtil.setCss(hex_entry, {
			'width': '135px',
			'height': '30px',
			'font-size': '120%',
			'font-family': "SimHei"
		});

		var ensure_p = document.createElement('div');
		handler_color.appendChild(ensure_p);
		var ensure_btn = document.createElement('button');
		ensure_p.appendChild(ensure_btn);
		ensure_btn.innerHTML = "确 定";
		CssUtil.setCss(ensure_btn, {
			'display': 'block',
			'width': '100%',
			'padding': '10px',
			'border': 'none',
			'background': color,
			'font-family': "Microsoft Yahei",
			'font-size': '110%',
			'color': '#fff',
			'margin-top': '10px'
		});
		
		EventUtil.addEvent(ensure_btn, 'mouseover', function(){
			CssUtil.setCss(ensure_btn, {
				'box-shadow': '3px 3px 3px #ccc'
			});
		});

		EventUtil.addEvent(ensure_btn, 'mouseout', function(){
			CssUtil.setCss(ensure_btn, {
				'box-shadow': 'none'
			});
		});


		// ---------------- leftbox ------------------ //
		var layer = document.createElement('div');
		setLayerSize(layer);
		// ------ 红到紫 ------ //
		(function(){
			var r = 255, g = 0, b = 0;
			for(var i = 0; i < 51; i++){
				var cur_layer = layer.cloneNode(true);
				leftbox.appendChild(cur_layer);
				b = b + 5;
				var color = 'rgb(' + r + ',' + g + ',' + b +')';
				setColor(cur_layer, color);
			}
		})();

		// ------ 紫到蓝 ------ //
		(function(){
			var r = 255, g = 0, b = 255;
			for(var i = 0; i < 51; i++){
				var cur_layer = layer.cloneNode(true);
				leftbox.appendChild(cur_layer);
				r = r - 5;
				var color = 'rgb(' + r + ',' + g + ',' + b +')';
				setColor(cur_layer, color);
			}
		})();

		// ------ 蓝到青 ------ //
		(function(){
			var r = 0, g = 0, b = 255;
			for(var i = 0; i < 51; i++){
				var cur_layer = layer.cloneNode(true);
				leftbox.appendChild(cur_layer);
				g = g + 5;
				var color = 'rgb(' + r + ',' + g + ',' + b +')';
				setColor(cur_layer, color);
			}
		})();

		// ------ 青到绿 ------ //
		(function(){
			var r = 0, g = 255, b = 255;
			for(var i = 0; i < 51; i++){
				var cur_layer = layer.cloneNode(true);
				leftbox.appendChild(cur_layer);
				b = b - 5;
				var color = 'rgb(' + r + ',' + g + ',' + b +')';
				setColor(cur_layer, color);
			}
		})();

		// ------ 绿到黄 ------ //
		(function(){
			var r = 0, g = 255, b = 0;
			for(var i = 0; i < 51; i++){
				var cur_layer = layer.cloneNode(true);
				leftbox.appendChild(cur_layer);
				r = r + 5;
				var color = 'rgb(' + r + ',' + g + ',' + b +')';
				setColor(cur_layer, color);
			}
		})();

		// ------ 黄到红 ------ //
		(function(){
			var r = 255, g = 255, b = 0;
			for(var i = 0; i < 51; i++){
				var cur_layer = layer.cloneNode(true);
				leftbox.appendChild(cur_layer);
				g = g - 5;
				var color = 'rgb(' + r + ',' + g + ',' + b +')';
				setColor(cur_layer, color);
			}
		})();

		// ------------------------------------------------ //

		// ------------初始化颜色数据----------- //
		(function(){
			var r = 255, g = 110, b = 0;
			var rgb_entry = bar.getElementsByClassName('rgb_entry');
			rgb_entry[0].value = r;
			rgb_entry[1].value = g;
			rgb_entry[2].value = b;
			var str_color = 'rgb(' + r + ',' + g + ',' + b + ')';
			var hex_color = rgbToHex(str_color);
			hex_entry.value = hex_color;
			// ---- //
			selected_color.style.backgroundColor = str_color;
		})();

		// ------------添加事件----------- //

		// ---------点击leftbox生成新的颜色---------//
		var rgb_entry = bar.getElementsByClassName('rgb_entry');
		EventUtil.addEvent(leftbox, 'mousedown', function(){
			var target = EventUtil.getTarget();
			if(target.tagName.toLowerCase() == 'div'){
				var color = target.style.backgroundColor;
				selected_color.style.backgroundColor = color;
				var hex_color = rgbToHex(color);
				hex_entry.value = hex_color;
				arr_color = color.substring(color.indexOf("(") + 1, color.indexOf(")") ).split(",");
				r = arr_color[0].trim();
				g = arr_color[1].trim();
				b = arr_color[2].trim();
				rgb_entry[0].value = r;
				rgb_entry[1].value = g;
				rgb_entry[2].value = b;
				// ------- //
				cur_color = 'rgb(' + r + ',' + g + ',' + b + ')';
			}
		});

		//----------add_btn, cut_btn长点击事件----------//
		EventUtil.addEvent(rgb_show, 'mousedown', function(){
			var target = EventUtil.getTarget();
			if(target.className == 'add_btn'){
				var input_rgb = DomUtil.findPrevSilblingByTagName(target.parentNode, 'input');
				var val = parseInt(input_rgb.value);
				timer = setInterval(function(){
					val = val + 1;
					if(val > 255){
						val = 255;
					}
					input_rgb.value = val;
					// ----更新数据---- //
					freshData();
				}, 50);

				EventUtil.addEvent(target, 'mouseup', function(){
					clearInterval(timer);
				});

				EventUtil.addEvent(target, 'mouseout', function(){
					clearInterval(timer);
				});

			}else if(target.className == 'cut_btn'){
				var input_rgb = DomUtil.findPrevSilblingByTagName(target.parentNode, 'input');
				var val = parseInt(input_rgb.value);
				timer = setInterval(function(){
					val = val - 1;
					if(val < 0){
						val = 0;
					}
					input_rgb.value = val;
					// ----更新数据---- //
					freshData();
				}, 50);

				EventUtil.addEvent(target, 'mouseup', function(){
					clearInterval(timer);
				});

				EventUtil.addEvent(target, 'mouseout', function(){
					clearInterval(timer);
				});
			}
		});

		// -----------键盘事件------------ //
		EventUtil.addEvent(rgb_entry[0], 'keydown', function(){
			var evt = EventUtil.getEvent();
			if(evt.keyCode == 38){// 上
				var val = parseInt(rgb_entry[0].value) + 1;
				if(val > 255){
					val = 255;
				}
				rgb_entry[0].value = val;
			}else if(evt.keyCode == 40){
				var val = parseInt(rgb_entry[0].value) - 1;
				if(val < 0){
					val = 0;
				}
				rgb_entry[0].value = val;
			}
			// ----更新数据---- //
			freshData();
		});

		EventUtil.addEvent(rgb_entry[1], 'keydown', function(){
			var evt = EventUtil.getEvent();
			if(evt.keyCode == 38){// 上
				var val = parseInt(rgb_entry[1].value) + 1;
				if(val > 255){
					val = 255;
				}
				rgb_entry[1].value = val;
			}else if(evt.keyCode == 40){
				var val = parseInt(rgb_entry[1].value) - 1;
				if(val < 0){
					val = 0;
				}
				rgb_entry[1].value = val;
			}
			// ----更新数据---- //
			freshData();
		});

		EventUtil.addEvent(rgb_entry[2], 'keydown', function(){
			var evt = EventUtil.getEvent();
			if(evt.keyCode == 38){// 上
				var val = parseInt(rgb_entry[2].value) + 1;
				if(val > 255){
					val = 255;
				}
				rgb_entry[2].value = val;
			}else if(evt.keyCode == 40){
				var val = parseInt(rgb_entry[2].value) - 1;
				if(val < 0){
					val = 0;
				}
				rgb_entry[2].value = val;
			}
			// ----更新数据---- //
			freshData();
		});

		// -----------确定 ensure_btn 点击事件---------- //
		EventUtil.addEvent(ensure_btn, 'click', function(){

		});


		// ----- 刷新数据 ------//
		function freshData(){
			// -------- //
			var r = rgb_entry[0].value;
			var g = rgb_entry[1].value;
			var b = rgb_entry[2].value;
			var str_color = 'rgb(' + r + ',' + g + ',' + b  + ')';
			hex_entry.value = rgbToHex(str_color);
			// -------- //
			selected_color.style.backgroundColor = str_color;
			// -------- //
			cur_color = str_color;
		}

	}

	return {
		init: init,
		getColor: getColor
	}
}

