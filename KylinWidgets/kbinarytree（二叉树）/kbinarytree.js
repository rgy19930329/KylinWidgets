
function Kbinarytree(myTree){

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

	// 绘制线条（根据根节点绘制指向两个子节点的线条）
	function drawLine(divs, i){
		var config = {
			'display': 'block',
			'position': 'absolute',
			'height': lineSize,
			'background': lineColor,
			'transform-origin': '0 0',
			'z-index': '0'
		};

		var line1 = document.createElement('span');
		CssUtil.setCss(line1, config);
		myTree.appendChild(line1);

		var line2 = document.createElement('span');
		CssUtil.setCss(line2, config);
		myTree.appendChild(line2);

		var pnode = divs[i];
		var pleft = divs[2*i+1];
		var pright = divs[2*i+2];

		var point1 = getAbsPoint(pnode);
		var point2 = getAbsPoint(pleft);
		var point3 = getAbsPoint(pright);

		var myTreeX = getAbsPoint(myTree).x;
		var myTreeY = getAbsPoint(myTree).y;
		var itemDivSize = CssUtil.getCss(divs[0], 'width');
		itemDivSize = parseInt(itemDivSize);
		var itemRadius = itemDivSize / 2;
		
		var tx = Math.abs(point1.x - point2.x);
		var ty = Math.abs(point1.y - point2.y);
		var lineWidth = Math.round(Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2)));
		var tan = ty / tx;
		var angle = getAngleFromTan(tan);
		
		CssUtil.setCss(line1, {
			'width': lineWidth + 'px',
			'left': (point1.x - myTreeX + itemRadius) + 'px',
			'top': (point1.y - myTreeY + itemRadius) + 'px',
			'transform': 'rotate(' + angle + 'deg)'
		});

		CssUtil.setCss(line2, {
			'width': lineWidth + 'px',
			'left': (point1.x - myTreeX + itemRadius) + 'px',
			'top': (point1.y - myTreeY + itemRadius) + 'px',
			'transform': 'rotate(' + (180 - angle) + 'deg)'
		});

		if(pleft.innerHTML === ''){
			CssUtil.setCss(line2, {
				'background': 'transparent'
			});
		}

		if(pright.innerHTML === ''){
			CssUtil.setCss(line1, {
				'background': 'transparent'
			});
		}
	}

	// 绘制枝干
	function drawBranch(){
		divs = myTree.getElementsByTagName('div');
		for(var i = 0; i < Math.floor(divs.length / 2); i++){
			drawLine(divs, i);
		}
	}

	// 通过arr获取应该创建的行数
	function getRows(arr){
		var len = arr.length;
		var rows = 0;
		while(len > 0){
			len = Math.floor(len / 2);
			rows++;
		}
		return rows;
	}

	// 创建二叉树节点
	function createTree(arr){
		var sarr = arr.concat();

		var table = document.createElement('table');
		CssUtil.setCss(table, {
			'border-collapse': 'collapse',
			'position': 'relative',
			'z-index': '10',
			'width': twidth
		});
		myTree.appendChild(table);

		var allRows = getRows(sarr);
		for(var row = 0; row < allRows; row++){
			var tr = document.createElement('tr');
			for(var col = 0; col < Math.pow(2, row); col++){
				var td = document.createElement('td');
				CssUtil.setCss(td, {
					'text-align': 'center'
				});
				td.setAttribute('colspan', Math.pow(2, allRows - row - 1));
				tr.appendChild(td);

				var itemdiv = document.createElement('div');
				CssUtil.setCss(itemdiv, {
					'display': 'inline-block',
					'width': nodeSize,
					'height': nodeSize,
					'line-height': nodeSize,
					'background': nodeBgColor,
					'color': nodeTextColor,
					'border-radius': radius,
					'margin': nodeSpan
				});
				var num = sarr.shift();
				if(num !== undefined){
					itemdiv.innerHTML = num;
				}else{
					itemdiv.innerHTML = '';
					CssUtil.setCss(itemdiv, {
						'background': 'transparent'
					});
				}
				
				td.appendChild(itemdiv);
			}
			table.appendChild(tr);
		}
	}

	// ------------------ //

	function getNodes(){
		return divs;
	}

	// ------------------ //

	var divs = null;

	var twidth = null;
	var nodeSize = null;
	var nodeBgColor = null;
	var nodeTextColor = null;
	var nodeSpan = null;
	var radius = null;
	var lineSize = null;
	var lineColor = null;
	
	function init(arr, obj){
		var obj = obj || {};

		twidth = obj.width || 'auto';
		nodeSize = obj.nodeSize || '50px';
		nodeBgColor = obj.nodeBgColor || '#59f';
		nodeTextColor = obj.nodeTextColor || '#fff';
		nodeSpan = obj.nodeSpan || '10px';
		if(obj.nodeIsCircle == undefined || obj.nodeIsCircle == true){
			radius = '50%';
		}else{
			radius = '0';
		}
		lineSize = obj.lineSize || '1px';
		lineColor = obj.lineColor || '#6EB215';

		// --------------------------- //

		CssUtil.setCss(myTree, {
			'position': 'relative'
		});

		// --------------------------- //

		createTree(arr);
		drawBranch();
	}

	return {
		init: init,
		getNodes: getNodes
	}
}

