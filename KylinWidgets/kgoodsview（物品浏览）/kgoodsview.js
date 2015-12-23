
function Kgoodsview(bar){

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
                Object.prototype.toString.call(source) == '[object HTMLCollection]' ||
                Object.prototype.toString.call(source) == '[object Array]'){
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
        },

        getCss: function(source, attr) {
            try{
                if(source.style[attr]){
                    return source.style[attr];
                }else if (source.currentStyle) {
                    return source.currentStyle[attr];
                } else {
                    return getComputedStyle(source, false)[attr];
                }
            }catch(e){
                console.log(e);
            }
        },

        hover: function(source, obj){
            var that = this;
            var oldobj = {};
            for(var k in obj){
                oldobj[k] = that.getCss(source, k);
            }

            EventUtil.addEvent(source, 'mouseover', function(){
                that.setCss(source, obj);
            });
            EventUtil.addEvent(source, 'mouseout', function(){
                that.setCss(source, oldobj);
            });
        }
    };

   	var EventUtil = {
        //添加事件
        addEvent: function(element, eventType, handler){
            if(element.addEventListener){//标准浏览器
                element.addEventListener(eventType, handler, false);
            }else{
                element.attachEvent('on' + eventType, handler);
            }
        },
        //获取事件
        getEvent: function(event){
            return event || window.event;
        },
        //获取目标元素
        getTarget: function(event){
            return this.getEvent(event).target || this.getEvent(event).srcElement;
        }
    };

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

            /*----------------*/

            function getTransitionEndEvent(){
                var ele = document.createElement('fakeelement');
                var obj = {
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MsTransition': 'msTransitionEnd'
                }
                for(var i in obj){
                    if(ele.style[i] !== undefined){
                        return obj[i];
                    }
                }
            }

            var transitionend = getTransitionEndEvent();

            EventUtil.addEvent(source, transitionend, callback);
        },

        createKeyframes: function(source, obj){
            var styleDom = document.createElement('style');
            var process = '';
            for(var i in obj){
                process += (i + obj[i]);
            }
            var prefix = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
            var str = '';
            for(var i = 0; i < prefix.length; i++){
                str += ('@' + prefix[i] + 'keyframes ' + source + '{' + process + '}');
            }
            styleDom.innerHTML = str;
            document.getElementsByTagName("head")[0].appendChild(styleDom);
        },

        createAnimation: function(source, animConfig, keyframesConfig){
            var animConfig = animConfig || {};
            var dur = animConfig.dur || 1000;// 每次循环持续时间
            var easing = animConfig.easing || 'linear';// 缓动函数
            var times = animConfig.times || 'infinite';// 循环次数

            var motion_name = 'motion_' + Math.random().toString().slice(2);
            console.log(motion_name)
            var param = motion_name + ' ' + dur + ' ' + easing + ' ' + times;
            CssUtil.setCss(source, {
                'animation': param,
                '-webkit-animation': param,
                '-moz-animation': param,
                '-o-animation': param,
                '-ms-animation': param
            });

            this.createKeyframes(motion_name, keyframesConfig);
        }
    };
	
	function init(obj, description, link, imgLinks){
		var obj = obj || {};
		var bwidth = obj.width || '250px';
        var textColor = obj.textColor || '#444';
        var csize = Math.floor(parseInt(bwidth) / 6);
		
		CssUtil.setCss(bar, {
			'width': bwidth
		});
		var big_show = document.createElement('div');
		bar.appendChild(big_show);
        var big_link = document.createElement('a');
        big_show.appendChild(big_link);
        big_link.setAttribute('href', link);
        big_link.setAttribute('title', description);
		var big_img = document.createElement('img');
		big_link.appendChild(big_img);
		CssUtil.setCss(big_img, {
			'display': 'block',
			'width': bwidth,
			'height': bwidth
		});
		big_img.setAttribute('src', imgLinks[0]);

		var small_show = document.createElement('div');
		bar.appendChild(small_show);
        var left_btn = document.createElement('div');
        small_show.appendChild(left_btn);
        var btn_width = (parseInt(bwidth) - (csize + 4) * 5) / 2;
        var btn_config = {
            'width': btn_width + 'px',
            'height': (csize + 4) + 'px',
            'border': '1px solid #eee',
            'display': 'inline-block',
            'border-radius': '5px',
            'font-size': btn_width + 'px',
            'line-height': (csize + 4) + 'px',
            'text-align': 'center',
            'vertical-align': 'top',
            'color': '#888',
            'font-weight': 'bold',
            'cursor': 'pointer',
            'box-sizing': 'border-box'
        };
        CssUtil.setCss(left_btn, btn_config);
        left_btn.innerHTML = '<';
        var box = document.createElement('div');
        small_show.appendChild(box);
        CssUtil.setCss(box, {
            'width': (csize + 4) * 5 + 'px',
            'height': (csize + 4) + 'px',
            'display': 'inline-block',
            'overflow': 'hidden'
        });
        var inner_box = document.createElement('div');
        box.appendChild(inner_box);
        CssUtil.setCss(inner_box, {
            'width': ((csize + 4) * imgLinks.length) + 'px',
            'position': 'relative',
            'left': 0
        });
		for(var i = 0, len = imgLinks.length; i < len; i++){
            var new_img = document.createElement('img');
            CssUtil.setCss(new_img, {
                'display': 'inline-block',
                'width': csize + 'px',
                'height': csize + 'px',
                'border': '1px solid #eee',
                'margin': '1px',
                'cursor': 'pointer',
                'transition': 'all 300ms'
            });
            new_img.setAttribute('src', imgLinks[i]);
            inner_box.appendChild(new_img);
        }
        var right_btn = document.createElement('div');
        small_show.appendChild(right_btn);
        CssUtil.setCss(right_btn, btn_config);
        right_btn.innerHTML = '>';

        var title_show = document.createElement('p');
        bar.appendChild(title_show);
        CssUtil.setCss(title_show, {
            'text-align': 'center'
        });
        var title_link = document.createElement('a');
        title_show.appendChild(title_link);
        title_link.innerHTML = description;
        title_link.setAttribute('href', link);
        CssUtil.setCss(title_link, {
            'text-decoration': 'none',
            'color': textColor
        });
        CssUtil.hover(title_link, {
            'text-decoration': 'underline'
        });
        // ------------------------------------- //

        if(imgLinks.length < 5){
            CssUtil.setCss(left_btn, {
                'display': 'none'
            });
            CssUtil.setCss(right_btn, {
                'display': 'none'
            });
        }

        var moveDist = (csize + 4) * 5;
        var isLock = false; // 按钮锁
        EventUtil.addEvent(right_btn, 'click', function(){
            var cur_pos = parseInt(CssUtil.getCss(inner_box, 'left'));
            var min_pos = Math.floor(imgLinks.length / 5) * 5 * (csize + 4);
            if(cur_pos <= -min_pos){
                return;
            }
            if(isLock == false){
                isLock = true;
                AnimUtil.animate(inner_box, {
                    'left': cur_pos - moveDist + 'px'
                }, {}, function(){
                    isLock = false;
                });
            }
        });
        EventUtil.addEvent(left_btn, 'click', function(){
            var cur_pos = parseInt(CssUtil.getCss(inner_box, 'left'));
            var max_pos = 0;
            if(cur_pos >= max_pos){
                return;
            }
            if(isLock == false){
                isLock = true;
                AnimUtil.animate(inner_box, {
                    'left': cur_pos + moveDist + 'px'
                }, {}, function(){
                    isLock = false;
                });
            }
        });

        // ---------------------------------- //

        var imgs = inner_box.getElementsByTagName('img');
        CssUtil.setCss(imgs[0], {
            'border': '1px solid red'
        });
        EventUtil.addEvent(inner_box, 'mouseover', function(){
            var target = EventUtil.getTarget();
            if(target.tagName.toLowerCase() == 'img'){
                CssUtil.setCss(imgs, {
                    'border': '1px solid #eee'
                });
                var cur_src = target.getAttribute('src');
                big_img.setAttribute('src', cur_src);
                CssUtil.setCss(target, {
                    'border': '1px solid red'
                });
            }
        });

	}

	return {
		init: init
	}
}

