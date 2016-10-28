function Kcodeview(bar){

	var param = {};

	var operators = ['\\+=', '-=', '\\*=', '\\/=', '&lt;=', '&gt;=', '&lt;', '&gt;', '=', '\\+', '-', '\\*', '\\/', '%'];

	var colors = {
		color1: ['var', 'let', 'for', 'if', 'else', 'return', 'function', 'this', 'in', 'switch', 'new'],
		color2: ['log', 'push', 'shift', 'pop', 'unshift', 'join', 'concat', 'match', 'replace'],
		color3: ['console', 'RegExp', 'Date', 'Array', 'Object'],
		color4: ['prototype']
	};

	var initEle = function() {
		param.code = ky.select(bar, 'code');
	};

	/**
	* @desc 项目初始化
	*/
	var init = function(obj) {
		initEle();

		// 参数配置
		ky.CssUtil.setCss(param.code, {
			'font-family': 'consolas'
		});
		ky.CssUtil.setCss(param.code, obj);

		// 开始着色
		var res = param.code.innerHTML;
		// 符号 + 字符串 着色
		res = res.replace(new RegExp(operators.join('|').concat("|\".*\"|'.*'"), 'g'), function(tar) {
			if(tar.match(/"|'/)) {
				return '<span class="color4">' + tar + '</span>';
			}else{
				return '<span class="color2">' + tar + '</span>';
			}
		});
		// 关键字着色
		for (var key in colors) {
			res = res.replace(new RegExp(colors[key].join('|'), 'g'), function(tar) {
				return '<span class="' + key + '">' + tar + '</span>';
			});
		}
		param.code.innerHTML = res;
	};

	return {
		init: init
	}
}
