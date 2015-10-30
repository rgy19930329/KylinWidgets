
function Kadjacencylist(alist){

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

	// 绘制所有邻接表
	function createAllList(arr){
		var config = {
			'display': 'inline-block',
			'width': cellSize,
			'height': cellSize,
			'text-align': 'center',
			'line-height': cellSize,
			'border': '1px solid ' + color,
			'box-sizing': 'border-box'
		};

		var len = arr.length;

		for(var i = 0; i < len; i++){
			var section = document.createElement('section');
			inner.appendChild(section);
			var hnode = document.createElement('div');
			CssUtil.setCss(hnode, {
				'display': 'inline-block'
			});
			var nodeIndex = document.createElement('span');
			nodeIndex.innerHTML = i;
			CssUtil.setCss(nodeIndex, {
				'padding': '5px'
			});
			section.appendChild(nodeIndex);

			var node = document.createElement('span');
			node.innerHTML = nodes[i].innerHTML;
			CssUtil.setCss(node, config);
			hnode.appendChild(node);

			var space = document.createElement('span');
			space.innerHTML = '&nbsp;';
			CssUtil.setCss(space, config);
			CssUtil.setCss(space, {
				'border-left': 'none'
			});
			hnode.appendChild(space);
			section.appendChild(hnode);

			for(var j = len - 1; j >= 0; j--){
				if(arr[i][j] !== 0){
					var fnode = document.createElement('div');
					CssUtil.setCss(fnode, {
						'display': 'inline-block',
						'margin-left': cellSize
					});
					section.appendChild(fnode);

					var node = document.createElement('span');
					node.innerHTML = j;
					CssUtil.setCss(node, config);
					fnode.appendChild(node);

					var space = document.createElement('span');
					space.innerHTML = '&nbsp;';
					CssUtil.setCss(space, config);
					CssUtil.setCss(space, {
						'border-left': 'none'
					});
					fnode.appendChild(space);
				}
			}

			var spans = section.getElementsByTagName('span');
			var lastone = spans[spans.length - 1];
			lastone.innerHTML = "\u2227";
		}
	}

	// 绘制箭头（根据首尾两个节点的位置绘制二者间的箭头）
	function drawArrow(head, tail){
		var config = {
			'display': 'block',
			'position': 'absolute',
			'height': '2px',
			'background': color
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
			'right': '-2px',
			'color': color
		});

		var point1 = getAbsPoint(head);
		var point2 = getAbsPoint(tail);

		var innerX = getAbsPoint(inner).x;
		var innerY = getAbsPoint(inner).y;

		var itemRadius = parseInt(cellSize) / 2;

		CssUtil.setCss(line, {
			'width': itemRadius * 3 + 'px',
			'left': (point1.x - innerX + itemRadius * 3) + 'px',
			'top': (point1.y - innerY + itemRadius) + 'px'
		});
	}

	// 绘制所有的箭头
	function drawAllArrows(){
		var list = inner.getElementsByTagName('section');

		for(var i = 0; i < list.length; i++){
			var rowNodes = list[i].getElementsByTagName('div');
			for(var j = 0; j < rowNodes.length - 1; j++){
				drawArrow(rowNodes[j], rowNodes[j + 1]);
			}
		}
	}

	// 使用新的数据源刷新所有展示内容
	function fresh(arr){
		inner.innerHTML = '';
		createAllList(arr);
		drawAllArrows();
	}
	// ------------------ //
	var data_nodes = alist.getElementsByTagName('div')[0];
	var nodes = data_nodes.getElementsByTagName('span');
	var inner = null;

	var twidth = null;
	var theight = null;
	var cellSize = null;
	var color = null;

	function init(arr, obj){
		var obj = obj || {};

		twidth = obj.width || '600px';
		theight = obj.height || '400px';
		cellSize = obj.cellSize || '30px';
		color = obj.color || '#000';
		// --------------------------- //

		CssUtil.setCss(alist, {
			'position': 'relative',
			'width': twidth,
			'height': theight
		});

		CssUtil.setCss(data_nodes, {
			'display': 'none'
		});

		inner = document.createElement('div');
		CssUtil.setCss(inner, {
			'position': 'absolute',
			'width': '100%',
			'height': '100%'
		});
		alist.appendChild(inner);

		// --------------------------- //

		createAllList(arr);
		drawAllArrows();
	}

	return {
		init: init,
		fresh: fresh
	}
}

