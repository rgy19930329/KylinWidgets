
function Kgraph(graph){

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

    // ------------------------------- //
	
	// 获取元素的绝对位置
	function getAbsPoint(e) {
		var x = e.offsetLeft;
		var y = e.offsetTop;
		while (e = e.offsetParent) {
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		return {
			'x': x,
			'y': y
		};
	}

	// 从正切值获取角度
	function getAngleFromTan(tan){
		var v = Math.atan(tan);
		var angle = Math.round(v * 180 / Math.PI);
		return angle;
	}

	// 绘制线条（根据两个节点绘制连接二者的线条）
	function drawLine(node1, node2, weightValue){
		var config = {
			'display': 'block',
			'position': 'absolute',
			'height': '2px',
			'background': arcColor,
			'transform-origin': '0 0',
			'z-index': '0'
		};

		var line = document.createElement('span');
		CssUtil.setCss(line, config);
		inner.appendChild(line);

		var arcWeight = document.createElement('span');
		arcWeight.innerHTML = weightValue;
		if(hasArcWeight){
			line.appendChild(arcWeight);
		}
		CssUtil.setCss(arcWeight, {
			'display': 'inline-block',
			'position': 'absolute',
			'font-size': '14px',
			'top': '-8px'
		});

		var point1 = getAbsPoint(node1);
		var point2 = getAbsPoint(node2);

		var innerX = getAbsPoint(inner).x;
		var innerY = getAbsPoint(inner).y;

		var itemDivSize = CssUtil.getCss(divs[0], 'width');
		itemDivSize = parseInt(itemDivSize);
		var itemRadius = itemDivSize / 2;
		
		var tx = point1.x - point2.x;
		var ty = point1.y - point2.y;
		var arcWidth = Math.round(Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2)));
		var tan = Math.abs(ty) / Math.abs(tx);
		var angle = getAngleFromTan(tan);

		CssUtil.setCss(line, {
			'width': arcWidth + 'px',
			'left': (point1.x - innerX + itemRadius) + 'px',
			'top': (point1.y - innerY + itemRadius) + 'px'
		});

		CssUtil.setCss(arcWeight, {
			'left': (arcWidth / 2) - 7 + 'px'
		});

		if(tx <= 0 && ty < 0){// 第一象限
			// console.log("第一象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + angle + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + (-angle) + 'deg)'
			});
		}else if(tx > 0 && ty <= 0){// 第二象限
			// console.log("第二象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + (180 - angle) + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + (angle - 180) + 'deg)'
			});
		}else if(tx >= 0 && ty > 0){// 第三象限
			// console.log("第三象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + (angle - 180) + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + (180 - angle) + 'deg)'
			});
		}else if(tx < 0 && ty >= 0){// 第四象限
			// console.log("第四象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + (-angle) + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + angle + 'deg)'
			});
		}
		
	}

	// 绘制箭头（根据首尾两个节点的位置绘制二者间的箭头）
	function drawArrow(head, tail, weightValue){
		var config = {
			'display': 'block',
			'position': 'absolute',
			'height': '2px',
			'background': arcColor,
			'transform-origin': '0 0',
			'z-index': '0'
		};

		var line = document.createElement('span');
		CssUtil.setCss(line, config);
		inner.appendChild(line);

		var arrowh = document.createElement('span');
		arrowh.innerHTML = '\u25b6';
		line.appendChild(arrowh);
		CssUtil.setCss(arrowh, {
			'display': 'inline-block',
			'position': 'absolute',
			'font-size': '18px',
			'top': '-14px',
			'color': arcColor
		});

		var arcWeight = document.createElement('span');
		arcWeight.innerHTML = weightValue;
		if(hasArcWeight){
			line.appendChild(arcWeight);
		}
		CssUtil.setCss(arcWeight, {
			'display': 'inline-block',
			'position': 'absolute',
			'font-size': '14px',
			'top': '-8px'
		});

		var point1 = getAbsPoint(head);
		var point2 = getAbsPoint(tail);

		var innerX = getAbsPoint(inner).x;
		var innerY = getAbsPoint(inner).y;

		var itemDivSize = CssUtil.getCss(divs[0], 'width');
		itemDivSize = parseInt(itemDivSize);
		var itemRadius = itemDivSize / 2;
		
		var tx = point1.x - point2.x;
		var ty = point1.y - point2.y;
		var arcWidth = Math.round(Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2)));
		var tan = Math.abs(ty) / Math.abs(tx);
		var angle = getAngleFromTan(tan);
		
		CssUtil.setCss(line, {
			'width': arcWidth + 'px',
			'left': (point1.x - innerX + itemRadius) + 'px',
			'top': (point1.y - innerY + itemRadius) + 'px'
		});

		CssUtil.setCss(arrowh, {
			'right': (itemRadius - 2) + 'px'
		});

		CssUtil.setCss(arcWeight, {
			'left': (arcWidth / 2) - 7 + 'px'
		});

		if(tx <= 0 && ty < 0){// 第一象限
			// console.log("第一象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + angle + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + (-angle) + 'deg)'
			});
		}else if(tx > 0 && ty <= 0){// 第二象限
			// console.log("第二象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + (180 - angle) + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + (angle - 180) + 'deg)'
			});
		}else if(tx >= 0 && ty > 0){// 第三象限
			// console.log("第三象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + (angle - 180) + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + (180 - angle) + 'deg)'
			});
		}else if(tx < 0 && ty >= 0){// 第四象限
			// console.log("第四象限")
			CssUtil.setCss(line, {
				'transform': 'rotate(' + (-angle) + 'deg)'
			});
			CssUtil.setCss(arcWeight, {
				'transform': 'rotate(' + angle + 'deg)'
			});
		}
	}

	// 绘制所有的线条
	function drawAllLines(arr){
		var len = arr.length;
		for(var i = 0; i < len; i++){
			for(var j = 0; j < len; j++){
				if(j > i){
					if(arr[i][j] !== 0){
						drawLine(divs[i], divs[j], arr[i][j]);
					}
				}
			}
		}
	}

	// 绘制所有的箭头
	function drawAllArrows(arr){
		var len = arr.length;
		for(var i = 0; i < len; i++){
			for(var j = 0; j < len; j++){
				if(arr[i][j] !== 0){
					drawArrow(divs[i], divs[j], arr[i][j]);
				}
			}
		}
	}

	// 用新的数据源刷新显示的内容
	function fresh(arr){
		inner.innerHTML = '';
		
		if(hasDirected){
			drawAllArrows(arr);
		}else{
			drawAllLines(arr);
		}
	}

	// ------------------ //

	function getAllNodes(){
		return divs;
	}

	// ------------------ //

	var divs = graph.getElementsByTagName('div');
	var inner = null;

	var twidth = null;
	var theight = null;
	var nodeSize = null;
	var nodeBgColor = null;
	var nodeTextColor = null;
	var arcColor = null;
	var hasDirected = null;
	var hasArcWeight = null;
	
	function init(arr, obj){
		var obj = obj || {};

		twidth = obj.width || '600px';
		theight = obj.height || '400px';
		nodeSize = obj.nodeSize || '50px';
		nodeBgColor = obj.nodeBgColor || '#59f';
		nodeTextColor = obj.nodeTextColor || '#fff';
		arcColor = obj.arcColor || '#6EB215';
		hasDirected = obj.hasDirected;
		hasArcWeight = obj.hasArcWeight;
		if(hasDirected == undefined){
			hasDirected = false;
		}
		if(hasArcWeight == undefined){
			hasArcWeight = false;
		}
		// --------------------------- //

		CssUtil.setCss(graph, {
			'position': 'relative',
			'width': twidth,
			'height': theight
		});

		CssUtil.setCss(divs, {
			'display': 'block',
			'width': nodeSize,
			'height': nodeSize,
			'line-height': nodeSize,
			'text-align': 'center',
			'background': nodeBgColor,
			'color': nodeTextColor,
			'position': 'absolute',
			'border-radius': '50%',
			'z-index': 10
		});

		inner = document.createElement('section');
		CssUtil.setCss(inner, {
			'position': 'absolute',
			'width': '100%',
			'height': '100%'
		});
		graph.appendChild(inner);

		// --------------------------- //

		if(hasDirected){
			drawAllArrows(arr);
		}else{
			drawAllLines(arr);
		}

	}

	return {
		init: init,
		fresh: fresh,
		getAllNodes: getAllNodes
	}
}

