function Ktabs(tabs){

	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	function toCamel(name){
		return name.replace(/-[a-z]{1}/g, function(item){
			return item.slice(1).toUpperCase();
		});
	}

	/**
		css工具
	*/
	var CssUtil = {
		
		setCss: function(source, obj){
			if(Object.prototype.toString.call(source) == '[object String]'){
				var list = document.querySelectorAll(source);
				arguments.callee(list, obj);
			}else if(Object.prototype.toString.call(source) == '[object NodeList]' || 
				Object.prototype.toString.call(source) == '[object HTMLCollection]'){
				for(var i = 0, len = source.length; i < len; i++){
					for(var k in obj){
						source[i].style[toCamel(k)] = obj[k];
					}
				}
			}else{
				for(var k in obj){
					source.style[toCamelF(k)] = obj[k];
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

	/**
		event工具
	*/
	var EventUtil = {
		preventDefault: function(event) {
			event = event || window.event;
			if (event.preventDefault) { //标准浏览器
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		}
	}

	/**
		animation工具
	*/
	var AnimUtil = {
		opacity: function(source, dur){
			var per = 0;
			var startTime = Date.now();

			requestAnimationFrame(function f() {
	           if (per >= 1) {
	               source.style.opacity = 1;// 动画结束
	           } else {
	               per = (Date.now() - startTime) / dur;

	               source.style.opacity = per * 1;
	               requestAnimationFrame(f);
	           }
	        });
		}
	}
	

	function init(obj) {
		var obj = obj || {};
		var dur = obj.dur || 0;
		var source = tabs.querySelectorAll('.tabs-nav a');
		var content = tabs.querySelectorAll('.tabs-content > div');

		var fresh = function() {
			CssUtil.setCss(
				content, {
					"display": "none"
				}
			);

			CssUtil.setCss(
				'.tabs-content .content-show', {
					"display": "block"
				}
			);
		}

		fresh();

		for (var i = 0, len = source.length; i < len; i++) {
			source[i].addEventListener('click', function(k) {
				return function() {
					EventUtil.preventDefault(event);
					//
					CssUtil.removeClassAll(source, 'nav-selected');
					CssUtil.addClass(source[k], 'nav-selected');
					CssUtil.removeClassAll(content, 'content-show');
					CssUtil.addClass(content[k], 'content-show');
					fresh();
					//
					AnimUtil.opacity(content[k], dur);
				}
			}(i), false);
		}
	}

	return {
		init: init
	}
}
