
function Kpages(bar){


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

        hasClass: function(source, value){
            return source.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
        },

        addClass: function(source, value){
            if(!this.hasClass(source, value)){
                source.className += ' ' + value;
            }
        },

        removeClass: function(source, value){
            if(this.hasClass(source, value)){
                source.className = source.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '')
            }
        },

        addClassAll: function(source, value){
            for(var i = 0, len = source.length; i < len; i++){
                this.addClass(source[i], value);
            }
        },

        removeClassAll: function(source, value){
            for(var i = 0, len = source.length; i < len; i++){
                this.removeClass(source[i], value);
            }
        }
    }


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

        insertBefore: function(source, newNode, existNode){
            source.insertBefore(newNode, existNode);
        },

        insertAfter: function(source, newNode, existNode){
            source.insertBefore(newNode, existNode.nextSibling);
        }
    }


    var currentPage = null;
    var minPage = 1;
    var maxPage = null;

    var myUl = bar.getElementsByTagName('ul')[0];
    myUl.innerHTML = '';

    function getPage(){
    	return currentPage;
    }

    // currentPage改变时触发
    function emit(currentPage){
    	
    	var list = myUl.getElementsByTagName('li');
        var spanList = myUl.getElementsByTagName('span');

    	CssUtil.setCss(list, {
			'display': 'inline-block'
		});
    	
    	CssUtil.removeClassAll(list, 'page-selected');
    	CssUtil.addClass(list[currentPage - 1], 'page-selected');


    	if(currentPage - minPage > 3 && currentPage - maxPage < -3){// 中
    		CssUtil.setCss(spanList, {
                'display': 'inline'
            });
            for(var i = 1; i < currentPage - 3; i++){
                CssUtil.setCss(list[i], {
                    'display': 'none'
                });
            }
            for(var i = currentPage + 2; i < maxPage - 1; i++){
                CssUtil.setCss(list[i], {
                    'display': 'none'
                });
            }
    	}

    	if(currentPage - minPage <= 3){// 前
    		CssUtil.setCss(spanList[0], {
                'display': 'none'
            });
    		for(var i = 6; i < maxPage - 1; i++){
    			CssUtil.setCss(list[i], {
    				'display': 'none'
    			});
    		}
    	}

    	if(currentPage - maxPage >= -3){// 后
    		CssUtil.setCss(spanList[1], {
                'display': 'none'
            });
    		for(var i = 1; i < maxPage - (2 * 2 + 2); i++){
    			CssUtil.setCss(list[i], {
    				'display': 'none'
    			});
    		}
    	}

        console.log(currentPage);
    }
	
	function init(data){
		var data = data || {};

		maxPage = data.maxPage;
		currentPage = data.currentPage;

		var divList = bar.getElementsByTagName('div');
		CssUtil.setCss(divList, {
			'display': 'inline-block'
		});

		for(var i = 1; i <= maxPage; i++){
			var li = document.createElement('li');
			li.innerHTML = i;
			myUl.appendChild(li);
		}

		var list = myUl.getElementsByTagName('li');
		CssUtil.setCss(list, {
			'display': 'inline-block',
			'cursor': 'pointer'
		});


        var newNode1 = document.createElement('span');
        newNode1.innerHTML = '…';
        var newNode2 = document.createElement('span');
        newNode2.innerHTML = '…';

        DomUtil.insertAfter(myUl, newNode1, list[0]);
        DomUtil.insertBefore(myUl, newNode2, list[list.length - 1]);

		emit(currentPage);


		EventUtil.addEvent(pageSub, 'click', function(){
			currentPage--;
			if(currentPage < 1){
				currentPage = 1;
				return;
			}
			var list = myUl.getElementsByTagName('li');
			CssUtil.removeClassAll(list, 'page-selected');
			CssUtil.addClass(list[currentPage - 1], 'page-selected');
			//
			emit(currentPage);
		});

		EventUtil.addEvent(pageAdd, 'click', function(){
			currentPage++;
			if(currentPage > maxPage){
				currentPage = maxPage;
				return;
			}
			var list = myUl.getElementsByTagName('li');
			CssUtil.removeClassAll(list, 'page-selected');
			CssUtil.addClass(list[currentPage - 1], 'page-selected');
			//
			emit(currentPage);
		});

		EventUtil.addEvent(myUl, 'click', function(){
			var target = EventUtil.getTarget();

			if(target.tagName.toLowerCase() == 'li'){
				currentPage = parseInt(target.innerHTML);

				var list = myUl.getElementsByTagName('li');
				CssUtil.removeClassAll(list, 'page-selected');
				CssUtil.addClass(list[currentPage - 1], 'page-selected');
				//
				emit(currentPage);
			}
		});

	}

	return {
		init: init,
		getPage: getPage
	}
}

