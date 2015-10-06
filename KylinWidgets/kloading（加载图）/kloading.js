
function Kloading(bar){

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

	var AnimUtil = {
		
        animate: function(source, obj, opr, callback){
            var opr = opr || {};

            var easing = opr.easing || 'ease';
            var dur = opr.dur || 1000;
            var str = easing + " " + dur + "ms";

            CssUtil.setCss(source, {
                'transition': str,
                '-moz-transition': str,
                '-webkit-transition': str,
                '-o-transition': str,
                '-ms-transition': str
            });

            CssUtil.setCss(source, obj);
        },

        createKeyframes: function(target, obj){
            var styleDom = document.createElement('style');
            var process = '';
            for(var i in obj){
                process += (i + obj[i]);
            }
            var prefix = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
            var str = '';
            for(var i = 0; i < prefix.length; i++){
                str += ('@' + prefix[i] + 'keyframes ' + target + '{' + process + '}');
            }
            styleDom.innerHTML = str;
            document.getElementsByTagName("head")[0].appendChild(styleDom);
        }
	}
	
	function init(obj){
		var obj = obj || {};

		var bwidth = obj.radius || '50px';
        bwidth = parseInt(bwidth) * 2 + 'px';
		var bheight = obj.radius || '50px';
        bheight = parseInt(bheight) * 2 + 'px';
        var thick = obj.thick || '5px';
        var color = obj.color || '#59f';
        var bgColor = obj.bgColor || '#fff';
        var time = obj.time || 1000;
        time = time + 'ms';
        var model = obj.model || 'model_1';

		CssUtil.setCss(bar, {
			'width': bwidth,
			'height': bheight,
            'background': bgColor,
            'position': 'relative'
		});

        var animPara1 = 'motion_1 ' + time + ' ease-out infinite';
        CssUtil.setCss(bar, {
            'animation': animPara1,
            '-webkit-animation': animPara1,
            '-moz-animation': animPara1,
            '-o-animation': animPara1,
            '-ms-animation': animPara1
        });

        AnimUtil.createKeyframes('motion_1', {
            '0%': '{transform: rotate(0deg);}',
            '100%': '{transform: rotate(360deg);}'
        });


        var box = document.createElement('div');
        var mask = document.createElement('div');
        bar.appendChild(box);
        bar.appendChild(mask);

        CssUtil.setCss(box, {
            'width': bwidth,
            'height': bheight,
            'border': thick + ' solid ' + color,
            'border-radius': '50%',
            'box-sizing': 'border-box'
        });

        CssUtil.setCss(mask, {
            'width': bwidth,
            'height': Math.floor(parseInt(bheight) * 0.9) + 'px',
            'background': bgColor,
            'position': 'absolute',
            'bottom': '0'
        });

        var animPara2 = 'motion_2 ' + time + ' ease-out infinite';
        CssUtil.setCss(mask, {
            'animation': animPara2,
            '-webkit-animation': animPara2,
            '-moz-animation': animPara2,
            '-o-animation': animPara2,
            '-ms-animation': animPara2
        });

        AnimUtil.createKeyframes('motion_2', {
            '0%': '{height:' + Math.floor(parseInt(bheight) * 0.9) + 'px' + ';}',
            '50%': '{height:' + Math.floor(parseInt(bheight) * 0.5) + 'px' + ';}',
            '100%': '{height:' + Math.floor(parseInt(bheight) * 0.9) + 'px' + ';}'
        });

	}

	return {
		init: init
	}
}


