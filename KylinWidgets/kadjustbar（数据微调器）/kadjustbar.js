
function Kadjustbar(bar){

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

	var EventUtil = {
       	
        addEvent: function(element, eventType, handler){
            if(element.addEventListener){//标准浏览器
                element.addEventListener(eventType, handler, false);
            }else{
                element.attachEvent('on' + eventType, handler);
            }
        }
    }


	var list = null;
	var currentIndex = null;

	function getIndex(){
		return currentIndex;
	}

	function getValue(){
		return list[currentIndex];
	}
	
	function init(data, opr){
		var data = data || {};
		var opr = opr || {};

		list = data.dataList || [1, 2, 3];
		currentIndex = data.currentIndex || 0;

		var addBtn = opr.addBtn;
		var subBtn = opr.subBtn;

		CssUtil.setCss(bar, {
			'display': 'inline-block'
		});

		if(CssUtil.getCss(bar, 'border-width') == '0px'){
			CssUtil.setCss(bar, {
				'border': '1px solid #59f'
			});
		}

		var input = bar.getElementsByTagName('input')[0];
		CssUtil.setCss(input, {
			'float': 'left',
			'border': 'none'
		});

		var div = bar.getElementsByTagName('div')[0];
		CssUtil.setCss(div, {
			'float': 'left'
		});

		var buttons = bar.getElementsByTagName('button');
		CssUtil.setCss(buttons, {
			'display': 'block'
		});

		/*------------------------------------*/

		input.value = list[currentIndex];

		EventUtil.addEvent(addBtn, 'click', function(){
			currentIndex++;
			if(currentIndex >= list.length){
				currentIndex = list.length - 1;
			}
			input.value = list[currentIndex];
		});

		EventUtil.addEvent(subBtn, 'click', function(){
			currentIndex--;
			if(currentIndex <= 0){
				currentIndex = 0;
			}
			input.value = list[currentIndex];
		});

	}

	return {
		init: init,
		getIndex: getIndex,
		getValue: getValue
	}
}

