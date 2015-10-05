
function Ksidebox(bar){

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
	};


	var EventUtil = {

		addEvent: function(element, eventType, handler){
			if(element.addEventListener){
				element.addEventListener(eventType, handler, false);
			}else{
				element.attachEvent('on' + eventType, handler)
			}
		}
	}


	var AnimUtil = {

		animate: function(source, obj, opr, callback){
            var opr = opr || {};

            var easing = opr.easing || 'ease';
            var dur = opr.dur || 1000;
            var str = easing + " " + dur + "ms";

            CssUtil.setCss(source, {
                'transition': str,
                '-moz-transition': str,
                '-webkit-transition': str,
                '-o-transition': str
            });

            CssUtil.setCss(source, obj);

            /*----------------*/

            function getTransitionEndEvent(){
                var ele = document.createElement('fakeelement');
                var obj = {
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MsTransition': 'msTransitionEnd'
                }
                for(var i in obj){
                    if(ele.style[i] !== undefined){
                        return obj[i];
                    }
                }
            }

            var transitionend = getTransitionEndEvent();

            EventUtil.addEvent(source, transitionend, callback);
        }
	};

	var isOpen = null;

	function init(obj, opr){
		var obj = obj || {};

		var bdirection = obj.direction || 'left';
		var bwidth = obj.width || '200px';
		var bheight = obj.height || '350px';
		var btop = obj.top || '150px';
		var dur = obj.dur || 1000;
		isOpen = obj.isOpen;

		var ctrlBtn = opr.ctrlBtn;
		CssUtil.setCss(ctrlBtn, {
			'position': 'absolute',
			'cursor': 'pointer'
		});

		CssUtil.setCss(bar, {
			'position': 'fixed',
			'width': bwidth,
			'height': bheight,
			'top': '120px'
		});

		var cobj1, cobj2;
		if(bdirection == 'left'){
			cobj1 = {
				'left': '0'
			},
			cobj2 = {
				'left': -parseInt(bwidth) + 'px'
			}
		}else{
			cobj1 = {
				'right': '0'
			},
			cobj2 = {
				'right': -parseInt(bwidth) + 'px'
			}
		}

		if(isOpen){
			CssUtil.setCss(bar, cobj1);
			ctrlBtn.innerHTML = '关闭';
		}else{
			CssUtil.setCss(bar, cobj2);
			ctrlBtn.innerHTML = '打开';
		}

		
		EventUtil.addEvent(ctrlBtn, 'click', function(){
			if(isOpen){
				isOpen = false;
				AnimUtil.animate(bar, cobj2, {
					'easing': 'ease-out',
					'dur': dur
				}, function(){
					ctrlBtn.innerHTML = '打开';
				});
			}else{
				isOpen = true;
				AnimUtil.animate(bar, cobj1, {
					'easing': 'ease-out',
					'dur': dur
				}, function(){
					ctrlBtn.innerHTML = '关闭';
				});
			}
			
		});

	}

	return {
		init: init
	}

}


