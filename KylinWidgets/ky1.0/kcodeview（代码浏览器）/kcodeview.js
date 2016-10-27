function Kcodeview(bar){

	var param = {};

	var colors = {
		color1: ['var', 'let', 'for', 'if', 'else', 'return', 'function', 'this', 'in', 'switch'],
		color2: ['log', 'push', 'shift', 'pop', 'unshift'],
		color3: ['console', 'RegExp', 'Date', 'Array', 'Object'],
		color4: ['prototype']
	};

	// '-', '*', '\/', '%', '+=', '-=', '*=', '\/='

	var initEle = function() {
		param.code = ky.select(bar, 'code');
	};

	/**
	* @desc 项目初始化
	*/
	var init = function(obj) {
		initEle();

		ky.CssUtil.setCss(param.code, obj);

		var res = param.code.innerHTML;

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
