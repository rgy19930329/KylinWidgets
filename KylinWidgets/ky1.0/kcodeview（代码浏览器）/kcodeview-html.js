function KcodeviewHtml(bar){

	var param = {};
	/**
	* @desc 初始化元素
	*/
	var initEle = function() {
		param.code = ky.select(bar, 'code');
	};
	/**
	* @desc 初始化参数配置
	*/
	var initConfig = function(obj) {
		ky.CssUtil.setCss(param.code, {
			'font-family': 'consolas' // 默认字体
		});
		ky.CssUtil.setCss(param.code, obj);
	};
	/**
	* @desc 添加行数标志
	*/
	var addRowTag = function(res) {
		var num = 0;
		res = res.replace(/\r|\n/g, function(tar) {
			num++;
			return tar + '<span class="color10 ky-tab-span">' + num + '</span>';
		});
		param.code.innerHTML = res;

		// 重置行标的宽度
		var span_width = parseInt(num / 10);
		ky.CssUtil.setCss(ky.select('.ky-tab-span'), {
			'width': span_width + 'em',
		});
	};
	/**
	* @desc 编码转换
	* @param [str] [string]
	* @return [string]
	*/
	var convert = function(str) {
		return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	};
	/**
	* @desc 开始着色
	*/
	var bepaint = function() {
		var res = param.code.innerHTML;

		res = res.replace(/<\/*[^>]+>/g, function(tar) {
			// 匹配注释标签
			if(tar.match(/<!--(\n|.)*?-->/)) {
				tar = convert(tar);
				return '<span class="color0">' + tar + '</span>';
			}
			// 匹配其它标签
			var tmp = tar.match(/(<\/*)([^>]+)>/);
			var arr1 = tmp[2].split(/\s+/);
			var tag = arr1.shift();
			var attrs = '';
			var attr = '';
			while(attr = arr1.shift()) {
				var tarr = attr.split('=');
				var key = tarr[0],
					value = tarr[1];
				attrs += ' <span class="color2">' + key + '</span>=' + '<span class="color4">' + value + '</span>';
			}
			return convert(tmp[1]) + '<span class="color1">' + tag + '</span>' + attrs + convert('>');
		});
		return res;
	};
	/**
	* @desc 项目初始化
	*/
	var init = function(obj) {
		initEle();// 初始化元素
		initConfig(obj);// 初始化参数配置
		var res = bepaint();// 开始着色
		addRowTag(res);// 增加行数标识
	};
	/**
	* @desc 获取代码
	*/
	var getCode = function() {
		var output = param.code.innerText;
		output = output.replace(/(\r|\n)[0-9]+/g, function(tar) {
			return tar.match(/\r|\n/)[0];
		});
		return output;
	};

	return {
		init: init,
		getCode: getCode
	}
}
