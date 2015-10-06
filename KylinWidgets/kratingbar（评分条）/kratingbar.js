
function Kratingbar(bar){

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
	

	var isLock = false;
	var list = null;
	var result = null;
	
	function getValue(){
		return result;
	}
	
	function init(obj, data){
		var obj = obj || {};
		var data = data || {};

		var starSize = obj.starSize || '25px';
		var color = obj.color || '#CD641D';

		list = data.list || ['很差', '较差', '还行', '推荐', '力荐'];

		// ---------------------- //

		CssUtil.setCss(bar, {
			'display': 'inline-block',
			'cursor': 'pointer',
			'font-size': starSize,
			'color': '#eee',
			'text-shadow': '1px 1px 1px #888'
		});

		// ---------------------- //

		var span = document.createElement('span');
		span.innerHTML = '\u2605';
		bar.appendChild(span);
		for(var i = 1; i < 5; i++){
			var temp = span.cloneNode(true);
			bar.appendChild(temp);
		}

		var label = document.createElement('label');
		bar.appendChild(label);
		CssUtil.setCss(label, {
			'font-size': parseInt(starSize) / 2 + 'px',
			'color': '#888',
			'text-shadow': 'none',
			'padding-left': '10px'
		});

		var spanList = bar.getElementsByTagName('span');
		for(var i = 0, len = spanList.length; i < len; i++){
			EventUtil.addEvent(spanList[i], 'mouseover', function(k){
				return function(){
					if(isLock){
						return;
					}
					for(var j = k; j >=0; j--){
						CssUtil.setCss(spanList[j], {
							'color': color
						});
					}
					CssUtil.setCss(label, {
						'display': 'inline'
					});
					label.innerHTML = list[k];
				}
			}(i));

			EventUtil.addEvent(spanList[i], 'mouseout', function(k){
				return function(){
					if(isLock){
						return;
					}
					for(var j = k; j >=0; j--){
						CssUtil.setCss(spanList[j], {
							'color': '#eee'
						});
					}
					CssUtil.setCss(label, {
						'display': 'none'
					});
				}
			}(i));

			EventUtil.addEvent(spanList[i], 'click', function(k){
				return function(){
					if(isLock){
						return;
					}
					for(var j = k; j >=0; j--){
						CssUtil.setCss(spanList[j], {
							'color': color
						});
					}
					isLock = true;
					result = label.innerHTML;
				}
			}(i));

		}

	}

	return {
		init: init,
		getValue: getValue
	}
}

