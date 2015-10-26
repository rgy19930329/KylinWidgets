
function Ktoast(toast){

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
                '-o-transition': str,
                '-ms-transition': str
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
    }

    // -------------------------------------------------- //

    function emit(msg){
    	toast.innerHTML = msg;
    	AnimUtil.animate(toast, {
    		'transform': 'scale(1)'
    	},{
    		'dur': 200,
    		'easing': 'linear'	
    	});
    	setTimeout(function(){
    		AnimUtil.animate(toast, {
	    		'transform': 'scale(0)'
	    	},{
	    		'dur': 200,
	    		'easing': 'linear'	
	    	});
    	}, time + 200);
    }

    var time = null;
	
	function init(obj){
		var obj = obj || {};
		var twidth = obj.width || '250px';
		time = obj.time || 2000;
		
		CssUtil.setCss(toast, {
			'width': twidth,
			'min-height': '50px',
			'background': 'rgba(0, 0, 0, 0.8)',
			'background': '-moz-linear-gradient(top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))',
			'background': '-o-linear-gradient(top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))',
			'background': '-webkit-linear-gradient(top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))',
			'border-radius': '10px',
			'position': 'fixed',
			'top': '50%',
			'left': '50%',
			'margin-top': '-50px',
			'margin-left': -Math.floor(parseInt(twidth) / 2) + 'px',
			'color': '#fff',
			'padding': '5px',
			'box-sizing': 'border-box',
			'box-shadow': '0 5px 5px #888',
			'transform': 'scale(0)',
            'text-align': 'center'
		});
	}

	return {
		init: init,
		emit: emit
	}
}

