function Kpicview(bar){
	// 参数初始化
	var doc = document.documentElement;
	var param = {
		swidth: doc.clientWidth - 200,
		sheight: doc.clientHeight - 200,
		currentIndex: 0,
	};
	/**
	* @desc 初始化 mask
	* @param [rs] [string] [随机字符串]
	*/
	var initMask = function(rs) {
		var tmpl = document.createElement('div');
		tmpl.innerHTML = 
		'<div class="ky-picview-mask ky-' + rs + '">' +
	        '<div class="ky-picview-close"><i>&Chi;</i></div>' +
	        '<div class="ky-picview-prev"><i>&lt;</i></div>' +
	        '<div class="ky-picview-next"><i>&gt;</i></div>' +
	        '<div class="ky-picview-content"><img src=""></div>' +
	        '<div class="ky-loading-wrap"><i class="ky-icon-loading"></i></div>'
	    '</div>';
		document.body.appendChild(tmpl);
	};
	/**
	* @desc 初始化 元素
	* @param [rs] [string] [随机字符串]
	*/
	var initEle = function(rs) {
		param.kimgs = ky.select(bar, 'img');
		param.kmask = ky.select('.ky-' + rs);
		param.ktargetImg = ky.select(param.kmask, '.ky-picview-content img');
		param.kprev = ky.select(param.kmask, '.ky-picview-prev');
		param.knext = ky.select(param.kmask, '.ky-picview-next');
		param.kclose = ky.select(param.kmask, '.ky-picview-close');
		param.kloading = ky.select(param.kmask, '.ky-loading-wrap');
	};
	/**
	* @desc 为imgs初始化索引
	*/
	var initImgIndex = function() {
		var imgs = param.kimgs;
		for(var i = 0; i < imgs.length; i++) {
			imgs[i].setAttribute('data-index', i);
		}
	};
	/**
	* @desc 限制图片的最大宽度和高度
	*/
	var limitImgSize = function() {
		ky.CssUtil.setCss(param.ktargetImg, {
			'max-width': param.swidth + 'px'
		});
		ky.CssUtil.setCss(param.ktargetImg, {
			'max-height': param.sheight + 'px'
		});
	};
	/**
	* @desc 处理控制区按钮的显示与消失
	*/
	var handleControlArea = function(imgs, currentIndex) {
		ky.CssUtil.setCss([param.kprev, param.knext], {
			'display': 'block'
		});
		if(currentIndex == 0) {
			ky.CssUtil.setCss(param.kprev, {
				'display': 'none'
			});
		}
		if(currentIndex == imgs.length - 1) {
			ky.CssUtil.setCss(param.knext, {
				'display': 'none'
			});
		}
	};
	/**
	* @desc 图片代理加载
	* @param [img] [Image] [来源图片]
	*/
	var proxyLoadImg = function(img) {
		param.ktargetImg.src = img.src;
		ky.CssUtil.setCss(param.kloading, {
			'display': 'block'
		});
		param.ktargetImg.onload = function() {
			ky.CssUtil.setCss(param.kloading, {
				'display': 'none'
			});
		}
	};
	/**
	* @desc 初始化事件
	*/
	var initEvent = function() {
		var imgs = param.kimgs;

		ky.EventUtil.addEvent(imgs, 'click', function(){
			ky.CssUtil.addClass(param.kmask, 'ky-picview-mask-show');
			proxyLoadImg(this);
			param.currentIndex = +this.getAttribute('data-index');
			handleControlArea(imgs, param.currentIndex);
		});

		ky.EventUtil.addEvent(param.kprev, 'click', function() {
			param.currentIndex--;
			handleControlArea(imgs, param.currentIndex);
			proxyLoadImg(imgs[param.currentIndex]);
		});

		ky.EventUtil.addEvent(param.knext, 'click', function() {
			param.currentIndex++;
			handleControlArea(imgs, param.currentIndex);
			proxyLoadImg(imgs[param.currentIndex]);
		});

		ky.EventUtil.addEvent(param.kclose, 'click', function() {
			ky.CssUtil.removeClass(param.kmask, 'ky-picview-mask-show');
		});
	};
	/**
	* @desc 项目初始化
	*/
	var init = function() {
		var rs = ky.BaseUtil.randomString(5);
		initMask(rs);
		initEle(rs);
		limitImgSize();
		initImgIndex();
		initEvent();
	};

	return {
		init: init
	}
}
