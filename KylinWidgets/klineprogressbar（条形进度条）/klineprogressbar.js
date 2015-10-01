function Klineprogressbar(bar){

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

	/*-----------------------------*/

	var isShowProgress = false;// 是否显示进度条

	var currentValue = null;
	var maxValue = null;
	var minValue = null;
	var barWidth = null;

	var inner = document.createElement('div');
	bar.appendChild(inner);
	var showDiv = document.createElement('div');
	bar.appendChild(showDiv);


	function getMaxValue(){
		return maxValue;
	}

	function getMinValue(){
		return minValue;
	}

	function getProcess(){
		var process = Math.round( (currentValue - minValue) * 100 / (maxValue - minValue) );
		return process + '%';
	}

	function getValue(){
		return currentValue;
	}

	function setValue(value){
		if(value <= maxValue && value >= minValue){
			currentValue = value;

			var childValue = currentValue - minValue;
			var allValue = maxValue - minValue;

			var innerWidth = ( childValue / allValue ) * barWidth + 'px';
			CssUtil.setCss(inner, {
				'width': innerWidth
			});
			showDiv.innerHTML = isShowProgress ? getProcess() : '';
		}
	}

	function init(obj, data){
		var obj = obj || {};
		var data = data || {};

		var bwidth = obj.width || '600px';
		var bheight = obj.height || '15px';
		var radius = obj.isFillet ? parseInt(bheight) / 2 + 'px' : '0';
		var proColor = obj.proColor || 'orange';
		var bgColor = obj.bgColor || '#eee';
		var textColor = obj.textColor || '#000';
		isShowProgress = obj.isShowProgress;

		currentValue = data.value || 50;
		maxValue = data.maxValue || 100;
		minValue = data.minValue || 0;
		barWidth = parseInt(bwidth);

		var childValue = currentValue - minValue;
		var allValue = maxValue - minValue;
		var innerWidth = ( childValue / allValue ) * parseInt(bwidth) + 'px';

		CssUtil.setCss(bar, {
			'width': bwidth,
			'height': bheight,
			'background': bgColor,
			'border-radius': radius,
			'position': 'relative'
		});

		CssUtil.setCss(inner, {
			'width': innerWidth,
			'height': '100%',
			'background': proColor,
			'border-radius': radius,
			'transition': 'width 200ms ease'
		});

		CssUtil.setCss(showDiv, {
			'width': bwidth,
			'height': bheight,
			'position': 'absolute',
			'top': '0',
			'text-align': 'center',
			'font-size': bheight,
			'line-height': bheight,
			'color': textColor
		});

		showDiv.innerHTML = isShowProgress ? getProcess() : '';
	}

	return {
		init: init,
		getValue: getValue,
		setValue: setValue,
		getMaxValue: getMaxValue,
		getMinValue: getMinValue,
		getProcess: getProcess
	}

}