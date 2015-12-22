
function Kmarquee(bar){

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
	
	// ---------------------------------------------------- //

	function init(obj){
		var obj = obj || {};
		var cellWidth = obj.cellWidth || '200px';
		var cellHeight = obj.cellHeight || '300px';
		var direction = obj.direction || 'left';
		var speed = obj.speed || 3;
		var sleep = 20;
		switch(speed){
			case 1: sleep = 100; break;
			case 2: sleep = 50; break;
			case 3: sleep = 20; break;
			case 4: sleep = 10; break;
			case 5: sleep = 5; break;
			default: sleep = 20;
		}
		// ---------------- //

		var bwidth = parseInt(cellWidth) * 3;
		CssUtil.setCss(bar, {
			'width': bwidth + 'px',
			'overflow': 'hidden'
		});

		var innerBox = bar.getElementsByClassName('innerBox')[0];
		CssUtil.setCss(innerBox, {
			'width': bwidth * 2 + 'px',
			'overflow': 'hidden',
			'position': 'relative',
			'left': 0
		});

		var innerDivs = innerBox.getElementsByTagName('div');
		CssUtil.setCss(innerDivs, {
			'height': '90%'
		});

		var innerParas = innerBox.getElementsByTagName('p');
		CssUtil.setCss(innerParas, {
			'text-align': 'center',
			'height': '10%',
			'box-sizing': 'border-box',
			'padding-top': '5px'
		});

		var cells = bar.getElementsByTagName('section');
		CssUtil.setCss(cells, {
			'width': cellWidth,
			'height': cellHeight,
			'float': 'left',
			'padding': '0 5px',
			'box-sizing': 'border-box'
		});
		for(var i = 0, len = cells.length; i < len; i++){
			var new_cell = cells[i].cloneNode(true);
			innerBox.appendChild(new_cell);
		}

		var imgs = bar.getElementsByTagName('img');
		CssUtil.setCss(imgs, {
			'display': 'block',
			'width': '100%',
			'height': '100%'
		});

		// ----------------------------------- //

		var clock = setInterval(function(){
			move(direction);
		}, sleep);

		EventUtil.addEvent(bar, 'mouseover', function(){
			clearInterval(clock);
		});

		EventUtil.addEvent(bar, 'mouseout', function(){
			clock = setInterval(function(){
				move(direction);
			}, sleep);
		});

		// -------------------------- //

		function move(direction){
			var cur_pos = parseInt(CssUtil.getCss(innerBox, 'left'));
			if(direction == 'left'){
				cur_pos--;
				if(cur_pos < -bwidth){
					cur_pos = 0;
				}
			}else if(direction == 'right'){
				cur_pos++;
				if(cur_pos > 0){
					cur_pos = -bwidth;
				}
			}

			CssUtil.setCss(innerBox, {
				'left': cur_pos + 'px'
			});
		}
	}

	return {
		init: init
	}
}
