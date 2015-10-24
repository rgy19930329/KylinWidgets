
function Kpopupbox(box){

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

    // ------------------------------------------- //

    var mask = document.createElement('div');
    var body = document.getElementsByTagName('body')[0];
	
	function emit(){
		body.appendChild(mask);
		AnimUtil.animate(box, {
			'transform': 'scale(1)'
		}, {
			'dur': 500
		});
	}

	function close(){
		body.removeChild(mask);
		AnimUtil.animate(box, {
			'transform': 'scale(0)'
		}, {
			'dur': 500
		});
	}
	
	function init(obj){
		var obj = obj || {};
		var bwidth = obj.width || '400px';

		CssUtil.setCss(box, {
			'width': bwidth,
			'height': '200px',
			'background': '#eee',
			'position': 'fixed',
			'top': '50%',
			'left': '50%',
			'margin-top': '-100px',
			'margin-left': -Math.floor( parseInt(bwidth)/2 ) + 'px',
			'z-index': '999',
			'transform': 'scale(0)'
		});

		// ---------------------------- //

		var title = box.getElementsByTagName('p')[0];
		var titleHeight = CssUtil.getCss(title, 'height');
		var closeIcon = document.createElement('span');
		closeIcon.innerHTML = '\u00D7';
		title.appendChild(closeIcon);
		CssUtil.setCss(closeIcon, {
			'float': 'right',
			'display': 'inline-block',
			'cursor': 'pointer',
			'width': titleHeight,
			'height': titleHeight,
			'line-height': titleHeight,
			'text-align': 'center',
			'font-weight': 'bold'
		});
		EventUtil.addEvent(closeIcon, 'click', function(){
			close();
		});

		// ---------------------------- //

		var divs = box.getElementsByTagName('div');
		CssUtil.setCss(divs[1], {
			'text-align': 'center',
			'position': 'absolute',
			'bottom': '0',
			'width': '100%',
		});

		// ---------------------------- //

		CssUtil.setCss(mask, {
			'position': 'absolute',
			'top': '0',
			'left': '0',
			'bottom': '0',
			'right': '0',
			'background': 'rgba(0, 0, 0, 0.4)'
		});
	}

	return {
		init: init,
		emit: emit,
		close: close
	}
}

