function Kcarousel(carousel){

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

   	/**
		css工具
   	*/
	var CssUtil = {
		toCamel: function(name){
			return name.replace(/-[a-z]{1}/g, function(item){
				return item.slice(1).toUpperCase();
			});
		},

		getCss: function(source, attr) {
			if (source.style[attr]) {
				return source.style[attr];
			} else if (source.currentStyle) {
				return source.currentStyle[attr];
			} else {
				return getComputedStyle(source, false)[attr];
			}
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
		},

		moveLeft: function(source, dist, dur, callback){
			var per = 0;
			var startTime = Date.now();
			var currentPos = parseInt(CssUtil.getCss(source, 'left'));
			dist = parseInt(dist);

			requestAnimationFrame(function f() {
	           if (per >= 1) {
	               source.style.left = (currentPos - dist) + "px";
	               callback && callback();
	           } else {
	               per = (Date.now() - startTime) / dur;

	               source.style.left = (currentPos - per * dist) + "px";
	               requestAnimationFrame(f);
	           }
	        });
		},

		moveRight: function(source, dist, dur, callback){
			var per = 0;
			var startTime = Date.now();
			var currentPos = parseInt(CssUtil.getCss(source, 'left'));
			dist = parseInt(dist);

			requestAnimationFrame(function f() {
	           if (per >= 1) {
	               source.style.left = currentPos + dist + "px";
	               callback && callback();
	           } else {
	               per = (Date.now() - startTime) / dur;

	               source.style.left = currentPos + per * dist + "px";
	               requestAnimationFrame(f);
	           }
	        });
		}
	}

	var currentIndex = null;

	function getIndex(){
		return currentIndex;
	}

	
	function init(obj, opr) {
		var obj = obj || {
			"width": '600px', 
			"height": '400px', 
			"dur": 1000, //切换时间
			"delay": 5000, //等待切换时间
			"needOpacity": false
		};
		var opr = opr || {};
		if(obj.dur > obj.delay){
			alert("dur的值不能大于delay!");
			return;
		}
		var dur = obj.dur;
		var needOpacity = obj.needOpacity;

		var moveBox = carousel.querySelector('.carousel-content');
		var list = moveBox.getElementsByTagName('a');
		var temp1 = list[0].cloneNode(true);
		var temp2 = list[list.length - 1].cloneNode(true);
		moveBox.appendChild(temp1);
		moveBox.insertBefore(temp2, moveBox.firstChild);

		var images = moveBox.getElementsByTagName('img');
		var imgNum = images.length - 2;
		currentIndex = 0;

		CssUtil.setCss(carousel, {
			"width": obj.width,
			"height": obj.height,
			"overflow": 'hidden',
			"position": 'relative'
		});

		CssUtil.setCss(moveBox, {
			"width": parseInt(obj.width) * images.length + 'px',
			"position" : 'absolute',
			"left" : '0',
		});

		CssUtil.setCss(images, {
			"width": obj.width,
			"height": obj.height,
			"float": 'left'
		});

		CssUtil.setCss(moveBox, {'left': -parseInt(obj.width) + 'px'});

		// 2 - images.length 是为了计算moveBox左侧距离父容器左侧的距离（为负）
		var leftDist = parseInt(obj.width) * (2 - images.length) + 'px';
		// 动画过程中按钮锁死，否则会产生错误效果
		var isLock = false;

		/**
			往右走step步
	   	*/
		function goRight(step){
			if(isLock){
				return;
			}
			isLock = true;

			if(CssUtil.getCss(moveBox, 'left') == '0px'){
				CssUtil.setCss(moveBox, {"left": leftDist});
			}
			AnimUtil.moveRight(moveBox, parseInt(obj.width) * step + 'px', dur, function(){
				isLock = false;
			});

			if(needOpacity){
				AnimUtil.opacity(moveBox, dur);
			}

			currentIndex = currentIndex - step;
			if(currentIndex == -1){
				currentIndex = imgNum - 1;
			}
		}

		/**
			往左走step步
	   	*/
		function goLeft(step){
			if(isLock){
				return;
			}
			isLock = true;

			if(CssUtil.getCss(moveBox, 'left') == leftDist){
				CssUtil.setCss(moveBox, {"left": '0'});
			}
			AnimUtil.moveLeft(moveBox, parseInt(obj.width) * step + 'px', dur, function(){
				isLock = false;
			});

			if(needOpacity){
				AnimUtil.opacity(moveBox, dur);
			}

			currentIndex = currentIndex + step;
			if(currentIndex == imgNum){
				currentIndex = 0;
			}
		}

		/**
			footer变换
	   	*/
		function footOpr(){
			if (opr.footer) {
				var flist = opr.footer.getElementsByTagName('li');
				for (var i = 0, len = flist.length; i < len; i++) {
					flist[i].className = '';
				}
				flist[currentIndex].className = 'selected';
			}
		}

		if (opr.rightBtn) {
			rightBtn.addEventListener('click', function() {
				goLeft(1);
				footOpr();
			}, false);
		}

		if(opr.leftBtn){
			leftBtn.addEventListener('click', function(){
				goRight(1);
				footOpr();
			}, false);
		}

		if(opr.footer){
			var flist = opr.footer.getElementsByTagName('li');
			opr.footer.addEventListener('mouseover', function(event){
				event = event || window.event;
				var target = event.target || event.srcElement;
				if(isLock){
					return;
				}
				for(var i = 0, len = flist.length; i < len; i++){
					flist[i].className = '';
					//
					if(target == flist[i]){
						if(currentIndex > i){
							goRight(currentIndex - i);
						}else if(currentIndex < i){
							goLeft(i - currentIndex);
						}
					}
				}
				target.className = 'selected';

			}, false);
		}

		setInterval(function(){
			goLeft(1);
			footOpr();
		}, obj.delay);
		
	}

	return {
		init: init,
		getIndex: getIndex
	}

}