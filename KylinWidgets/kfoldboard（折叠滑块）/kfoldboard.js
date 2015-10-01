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


	var currentValue = null;
	var maxValue = null;
	var minValue = null;
	var barWidth = null;
	var inner = bar.querySelector('.inner');

	function getValue(){
		return currentValue;
	}

	function getMaxValue(){
		return maxValue;
	}

	function getMinValue(){
		return minValue;
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
		}
	}

	function init(obj, data){

		var radius = parseInt(obj.height) / 2 + 'px';

		var childValue = data.value - data.minValue;
		var allValue = data.maxValue - data.minValue;

		var innerWidth = ( childValue / allValue ) * parseInt(obj.width) + 'px';

		currentValue = data.value;
		maxValue = data.maxValue;
		minValue = data.minValue;
		barWidth = parseInt(obj.width);

		CssUtil.setCss(bar, {
			'width': obj.width,
			'height': obj.height,
			'background-color': '#eee',
			'border-radius': radius
		});

		CssUtil.setCss(inner, {
			'width': innerWidth,
			'height': '100%',
			'background-color': obj.color,
			'border-radius': radius,
			'transition': 'width 200ms ease'
		});
	}

	return {
		init: init,
		getValue: getValue,
		setValue: setValue,
		getMaxValue: getMaxValue,
		getMinValue: getMinValue
	}

}