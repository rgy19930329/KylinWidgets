function KcodeviewCss(bar){

	var param = {};

	var colors = {
		color1: ['@import'],
		color2: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
	};
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
	* @desc 开始着色
	*/
	var bepaint = function() {
		// 开始着色
		var res = param.code.innerHTML;

		var reg_base_obj = {
			note: '(\\/{2,}.*?(\\r|\\n))|(\\/\\*(\\n|.)*?\\*\\/)', // 匹配注释
			string: '("([^\\\"]*(\\.)?)*")|(\'([^\\\']*(\\.)?)*\')', // 匹配字符串
			number: '(([^\\w])([0-9]+)([^\\w]))', // 匹配数字
			method: '([\\r\\n\\(\\s{}\\.;]+)([a-zA-Z_]\\w*\s*\\([a-zA-Z_]*\\w*\\))([\\.\\)\\s{}\\n\\r;]+)', // 匹配函数及其参数
			prop: '\\b([\\w-]+):', // 匹配css属性
			tag: '\\b([\\w-]+)\\s*{', // 匹配css的标签选择器
			class: '(\\.[\\w-]+)\\b', // 匹配css的class选择器
			id: '(#[\\w-]+)\\b', // 匹配css的id选择器
		};

		var reg_keywords_obj = {
			keywords1: '(' + colors.color1.join('|') + ')', // 匹配1类关键字
			keywords2: '(' + colors.color2.join('|') + ')', // 匹配3类关键字
		};

		var reg_base = '';
		for(var key in reg_base_obj) {
			reg_base += ('|' + reg_base_obj[key]);
		}
		reg_base = reg_base.slice(1);

		var reg_keywords = '';
		for(var key in reg_keywords_obj) {
			reg_keywords += ('|' + reg_keywords_obj[key]);
		}
		reg_keywords = reg_keywords.slice(1);

		/*--------------------------*/

		res = res.replace(new RegExp(reg_base, 'g'), function(tar) {
			if(tar.match(new RegExp(reg_base_obj.note))) {
				return '<span class="color0">' + tar + '</span>';
			}else if(tar.match(new RegExp(reg_base_obj.string))) {
				return '<span class="color4">' + tar + '</span>';
			}else if(tar.match(new RegExp(reg_base_obj.number))) {
				var tmp = tar.match(new RegExp(reg_base_obj.number));
				return tmp[2] + '<span class="color11">' + tmp[3] + '</span>' + tmp[4];
			}else if(tar.match(new RegExp(reg_base_obj.method))) {
				var arr = tar.match(new RegExp(reg_base_obj.method));
				var tmp = tar.match(/([a-zA-Z_]\w*)\s*\(([a-zA-Z_]*\w*)\)/);
				return arr[1] + '<span class="color12">' + tmp[1] + '</span>(<span class="color4">' + tmp[2] + '</span>)' + arr[3];
			}else if(tar.match(new RegExp(reg_base_obj.prop))) {
				return '<span class="color5">' + tar + '</span>';
			}else if(tar.match(new RegExp(reg_base_obj.class))) {
				return '<span class="color2">' + tar + '</span>';
			}else if(tar.match(new RegExp(reg_base_obj.id))) {
				return '<span class="color2">' + tar + '</span>';
			}else if(tar.match(new RegExp(reg_base_obj.tag))) {
				var arr = tar.match(new RegExp(reg_base_obj.tag));
				return '<span class="color2">' + arr[1] + '</span>' + ' {';
			}
			return tar;
		});

		res = res.replace(new RegExp(reg_keywords, 'g'), function(tar) {
			if(tar.match(new RegExp(reg_keywords_obj.keywords1))) {
				return '<span class="color1">' + tar + '</span>';
			}else if(tar.match(new RegExp(reg_keywords_obj.keywords2))) {
				return '<span class="color2">' + tar + '</span>';
			}
			return tar;
		});
		return res;
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
		var span_width = (num + '').length;
		ky.CssUtil.setCss(ky.select(bar, '.ky-tab-span'), {
			'width': span_width + 'em',
		});
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
