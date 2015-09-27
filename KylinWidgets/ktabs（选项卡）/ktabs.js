function Ktabs(tabs){

	function toCamel(name){
		return name.replace(/-[a-z]{1}/g, function(item){
			return item.slice(1).toUpperCase();
		});
	}

	function setCss(source, obj){
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
				source.style[toCamel(k)] = obj[k];
			}
		}
	}

	function hasClass(source, value){
		return source.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
	}

	function addClass(source, value){
		if(!hasClass(source, value)){
			source.className += ' ' + value;
		}
	}

	function removeClass(source, value){
		if(hasClass(source, value)){
			source.className = source.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '')
		}
	}

	function addClassAll(source, value){
		for(var i = 0, len = source.length; i < len; i++){
			addClass(source[i], value);
		}
	}

	function removeClassAll(source, value){
		for(var i = 0, len = source.length; i < len; i++){
			removeClass(source[i], value);
		}
	}

	function preventDefault(event) {
		event = event || window.event;
		if (event.preventDefault) { //标准浏览器
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}

	function opacity(source, dur){
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

	function createTabs(dur) {
		dur = dur || 0;
		var source = tabs.querySelectorAll('.tabs-nav a');
		var content = tabs.querySelectorAll('.tabs-content div');

		var fresh = function() {
			setCss(
				content, {
					"display": "none"
				}
			);

			setCss(
				'.tabs-content .content-show', {
					"display": "block"
				}
			);
		}

		fresh();

		for (var i = 0, len = source.length; i < len; i++) {
			source[i].addEventListener('click', function(k) {
				return function() {
					preventDefault(event);
					removeClassAll(source, 'nav-selected');
					addClass(source[k], 'nav-selected');
					removeClassAll(content, 'content-show');
					addClass(content[k], 'content-show');
					fresh();
					opacity(content[k], dur);
				}
			}(i), false);
		}
	}

	return {
		createTabs: createTabs
	}
}
