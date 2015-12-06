
function Knoticelist(bar){

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
        }
    };
	
	// 获取被删除的索引，以数组形式返回
    function getDeletedIndexes(){
    	return deletedIndexes;
    }

    var deletedIndexes = []; 

	function init(){

		var myul = bar.getElementsByTagName('ul')[0];
		var contentDivs = myul.getElementsByTagName('div');
		CssUtil.setCss(contentDivs, {
			'text-indent': '2em',
			'font-size': '80%',
			'display': 'none'
		});
		var titles = myul.getElementsByTagName('span');
		CssUtil.setCss(titles, {
			'font-weight': 'bold',
			'cursor': 'pointer'
		});

		// -------------暂无内容------------ //
		var seconddiv = bar.getElementsByTagName('div')[1];
		var innerp = seconddiv.getElementsByTagName('p')[0];
		CssUtil.setCss(innerp, {
			'text-align': 'center',
			'height': '80px',
			'line-height': '80px'
		});
		CssUtil.setCss(seconddiv, {
			'display': 'none'
		});

		// -------------内容显示与隐藏------------ //
		EventUtil.addEvent(myul, 'click', function(){
			var target = EventUtil.getTarget();
			if(target.tagName.toLowerCase() == 'span'){
				var pnode = target.parentNode;
				var ppnode = pnode.parentNode;
				var content = DomUtil.findNextSilblingByTagName(pnode, 'div');
				if(ppnode.getAttribute('tag') == undefined){
					ppnode.setAttribute('tag', 'closed');
				}

				if(ppnode.getAttribute('tag') == 'closed'){
					CssUtil.setCss(content, {
						'display': 'block'
					});
					ppnode.setAttribute('tag', 'opened');
				}else{
					CssUtil.setCss(content, {
						'display': 'none'
					});
					ppnode.setAttribute('tag', 'closed');
				}
			}
		});

		// -------------全选------------ //
		var checkboxes = myul.getElementsByTagName('input');
		var firstdiv = bar.getElementsByTagName('div')[0];
		var firstcheckbox = firstdiv.getElementsByTagName('input')[0];
		EventUtil.addEvent(firstcheckbox, 'click', function(){
			if(firstcheckbox.checked == true){
				for(var i = 0; i < checkboxes.length; i++){
					checkboxes[i].checked = true;
				}
			}else{
				for(var i = 0; i < checkboxes.length; i++){
					checkboxes[i].checked = false;
				}
			}
		});

		// -------------删除所选------------ //
		var btn_del = firstdiv.getElementsByTagName('button')[0];
		EventUtil.addEvent(btn_del, 'click', function(){
			var checkboxes = myul.getElementsByTagName('input');
			// 统计选中项
			var selectedItems = [];
			deletedIndexes = [];
			for(var i = 0; i < checkboxes.length; i++){
				if(checkboxes[i].checked == true){
					var ppnode = checkboxes[i].parentNode.parentNode;
					selectedItems.push(ppnode);
					deletedIndexes.push(i);
				}
			}
			// 开始删除
			for(var i = 0; i < selectedItems.length; i++){
				myul.removeChild(selectedItems[i]);
			}

			checkboxes = myul.getElementsByTagName('input');
			if(checkboxes.length == 0){
				CssUtil.setCss(firstdiv, {
					'display': 'none'
				});
				CssUtil.setCss(seconddiv, {
					'display': 'block'
				});
			}
		});
	}

	return {
		init: init,
		getDeletedIndexes: getDeletedIndexes
	}
}

