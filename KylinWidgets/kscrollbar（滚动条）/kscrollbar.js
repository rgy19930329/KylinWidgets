
function Kscrollbar(box, content){

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
	}
	
	function init(obj){
		var obj = obj || {};

		var width = obj.width || '20px';
		var color = obj.color || '#59f';
		var hoverColor = obj.hoverColor || '#3D84E1';
		var bgColor = obj.bgColor || '#eee';
		var isArc = obj.isArc || false;
		var radius = isArc ? parseInt(width) / 2 + 'px' : 0;
		var step = obj.step || '80px';
		step = parseInt(step);

		// --------------- //

		CssUtil.setCss(box, {
			'position': 'relative',
			'overflow': 'hidden'
		});

		CssUtil.setCss(content, {
			'position': 'absolute',
			'top': '0'
		});

		var cheight = CssUtil.getCss(content, 'height');
		var bheight = CssUtil.getCss(box, 'height');

		// 内容大于父容器高度，则创建滚动条
		if(parseInt(cheight) > parseInt(bheight)){

			var scrollbar = document.createElement('div');
			var thumb = document.createElement('div');
			scrollbar.appendChild(thumb);
			box.appendChild(scrollbar);

			CssUtil.setCss(scrollbar, {
				'position': 'absolute',
				'width': width,
				'height': '100%',
				'background': '#eee',
				'right': '0'
			});

			CssUtil.setCss(thumb, {
				'position': 'absolute',
				'top': '0',
				'width': width,
				'height': '40px',
				'background': color,
				'cursor': 'default',
				'border-radius': radius
			});

			thumb.onmouseover = function(){
				CssUtil.setCss(thumb, {
					'background': hoverColor
				});
			}

			thumb.onmouseout = function(){
				CssUtil.setCss(thumb, {
					'background': color
				});
			}

			var cwidth = CssUtil.getCss(content, 'width');
			CssUtil.setCss(content, {
				'width': parseInt(cwidth) - parseInt(width) + 'px'
			});

			// 创建滚动条会挤压content宽度，高度也会相应增加，因此需要重新获取
			cheight = CssUtil.getCss(content, 'height');

			// 获取滚动条高度
			var theight = Math.round( parseInt(bheight) * parseInt(bheight) / parseInt(cheight) );
			// 滚动条自身可滚动高度
			var scrollHeight = parseInt(bheight) - theight;

			CssUtil.setCss(thumb, {
				'height': theight + 'px'
			});

			/**
				控制块滑动事件
			*/
			thumb.onmousedown = function(e) {
		        var y = e.offsetY;

		        document.onmousemove = function(event) {
		            
		            var py = getAbsPoint(scrollbar).y;
		            var topDist = event.clientY - py - y;

		            if(topDist < 0){
		            	topDist = 0;
		            }
		            if(topDist > scrollHeight){
		            	topDist = scrollHeight;
		            }

		            CssUtil.setCss(thumb, {
		            	'top': topDist + "px"
		            });

		            // -------------- //

		            scrollConent(topDist);
		        };
		        document.onmouseup = function() {
		            document.onmousemove = null;
		            document.onmouseup = null;
		        };
		    };

		    /**
				scrollbar点击事件
			*/
			scrollbar.onclick = function(event){
				// 如果点击到了thumb，不触发该事件
				if(event.target == thumb){
		        	return;
		        }

				var py = getAbsPoint(scrollbar).y;
		        var clickDist = event.clientY - py;
		        var ttop = CssUtil.getCss(thumb, 'top');
		        
		        var tstep = null;
		        if(clickDist > parseInt(ttop)){
		        	tstep = theight;
		        }else{
		        	tstep = -theight;
		        }

		        var topDist = parseInt(ttop) + tstep;
		        if(topDist < 0){
	            	topDist = 0;
	            }
	            if(topDist > scrollHeight){
	            	topDist = scrollHeight;
	            }

		        CssUtil.setCss(thumb, {
		        	'top': topDist + 'px'
		        });

		        // ------------- //

		        scrollConent(topDist);
			}

			// 通过滚动条调节content的位置
			function scrollConent(topDist){
				var ratio = topDist / scrollHeight;

		        var sheight = parseInt(cheight) - parseInt(bheight);// 滚动高度
		        var ctop = Math.round( sheight * ratio);

		        CssUtil.setCss(content, {
		        	'top': -ctop + 'px'
		        });
			}

			// 滚轮滚动时调节thumb的位置
			function scrollThumb(ctopValue){
				
				var sheight = parseInt(cheight) - parseInt(bheight);// 滚动高度
				var ratio = Math.abs(ctopValue) / sheight;
				var ttop = Math.round(ratio * scrollHeight);
				if(ttop > scrollHeight){
					ttop = scrollHeight;
				}
				
				CssUtil.setCss(thumb, {
					'top': ttop + 'px'
				});
			}

			/**
			 	滚动事件监听
			*/
			box.onmousewheel = function(event){

				var dist = event.wheelDelta;
				
				var ctop = CssUtil.getCss(content, 'top');
				var cheight = CssUtil.getCss(content, 'height');
				var bheight = CssUtil.getCss(box, 'height');

				// 防止content主体向上滚出
				var mintop = parseInt(bheight) - parseInt(cheight);
				if(parseInt(ctop) < mintop){
					CssUtil.setCss(content, {
						'top': mintop + 'px'
					});
					return;
				}
				// 防止content主体向下滚出
				if(parseInt(ctop) > 0){
					CssUtil.setCss(content, {
						'top': '0'
					});
					return;
				}

				// 防止顶部抖动
				if(parseInt(ctop) == 0 && dist > 0){
					scrollThumb(0);
					return;
				}
				// 防止底部抖动
				if(parseInt(ctop) == mintop && dist < 0){
					return;
				}

				// 控制一次滚动距离step
				if(dist > 0){
					dist = step;
				}else{
					dist = -step;
				}

				var ctopValue = parseInt(ctop) + dist;
				CssUtil.setCss(content, {
					'top': ctopValue + 'px'
				});
				
				scrollThumb(ctopValue);
			}
		}// end if

	}

	return {
		init: init
	}
}

