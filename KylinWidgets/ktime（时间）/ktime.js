
function Ktime(bar){


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
            if (source.currentStyle) {
                return source.currentStyle[attr];
            } else {
                return getComputedStyle(source, false)[attr];
            }
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
            var dur;
            if(opr.dur == undefined){
                 dur = 1000;
            }else{
                dur = opr.dur;
            }
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
        }
    };
	
	// ---------------------------------------------- //

	function init(obj){
		var obj = obj || {};
        var bgColor = obj.bgColor || '#59f';
        var textColor = obj.textColor || '#fff';
        var textSize = obj.textSize || '80px';
        var hasFillet = obj.hasFillet;
        if(hasFillet == undefined){
            hasFillet = false;
        }
        var bottom_dist = Math.floor(parseInt(textSize) / 10) + 'px';

		CssUtil.setCss(bar, {
			'overflow': 'hidden'
		});

		var hour_div = document.createElement('div');
		var min_div = document.createElement('div');
		var sec_div = document.createElement('div');
		bar.appendChild(hour_div);
		bar.appendChild(min_div);
		bar.appendChild(sec_div);

		var h_span1 = document.createElement('span');
		var h_span2 = document.createElement('span');
		hour_div.appendChild(h_span1);
		hour_div.appendChild(h_span2);

		var m_label1 = document.createElement('label');
		min_div.appendChild(m_label1);
		var m_span1 = document.createElement('span');
		var m_span2 = document.createElement('span');
		min_div.appendChild(m_span1);
		min_div.appendChild(m_span2);
		var m_label2 = document.createElement('label');
		min_div.appendChild(m_label2);
		m_label1.innerHTML = m_label2.innerHTML = ":";

		var s_span1 = document.createElement('span');
		var s_span2 = document.createElement('span');
		sec_div.appendChild(s_span1);
		sec_div.appendChild(s_span2);

		CssUtil.setCss(hour_div, {
			'display': 'inline-block'
		});
		CssUtil.setCss(min_div, {
			'display': 'inline-block'
		});
		CssUtil.setCss(sec_div, {
			'display': 'inline-block'
		});

		var spans = bar.getElementsByTagName('span');
		var labels = bar.getElementsByTagName('label');

		CssUtil.setCss(spans, {
			'display': 'inline-block',
            'position': 'relative'
		});

		CssUtil.setCss(labels, {
			'display': 'inline-block',
			'font-size': textSize,
			'color': bgColor,
			'position': 'relative',
			'bottom': bottom_dist
		});

		CssUtil.setCss(h_span1, {
			'margin-right': '10px'
		});
		CssUtil.setCss(m_span1, {
			'margin-right': '10px'
		});
		CssUtil.setCss(s_span1, {
			'margin-right': '10px'
		});

		// ----------------------------------- //
        var cell_config = {
            'font-size': textSize,
            'background': bgColor,
            'color': textColor,
            'padding': '0 10px'
        };

        if(hasFillet){
            cell_config['border-radius'] = '10px';
        }

        var next_config = {
            'position': 'absolute',
            'top': '0',
            'left': '0'
        };

        // -------第6个cell------- //
        var s2_cur = document.createElement('div');
        var s2_next = document.createElement('div');
        s_span2.appendChild(s2_cur);
        s_span2.appendChild(s2_next);
        s2_cur.innerHTML = '0';
        s2_next.innerHTML = '0';
		CssUtil.setCss(s2_cur, cell_config);
        CssUtil.setCss(s2_next, cell_config);
		CssUtil.setCss(s2_next, next_config);

        // -------第5个cell------- //
        var s1_cur = document.createElement('div');
        var s1_next = document.createElement('div');
        s_span1.appendChild(s1_cur);
        s_span1.appendChild(s1_next);
        s1_cur.innerHTML = '0';
        s1_next.innerHTML = '0';
        CssUtil.setCss(s1_cur, cell_config);
        CssUtil.setCss(s1_next, cell_config);
        CssUtil.setCss(s1_next, next_config);

        // -------第4个cell------- //
        var m2_cur = document.createElement('div');
        var m2_next = document.createElement('div');
        m_span2.appendChild(m2_cur);
        m_span2.appendChild(m2_next);
        m2_cur.innerHTML = '0';
        m2_next.innerHTML = '0';
        CssUtil.setCss(m2_cur, cell_config);
        CssUtil.setCss(m2_next, cell_config);
        CssUtil.setCss(m2_next, next_config);

        // -------第3个cell------- //
        var m1_cur = document.createElement('div');
        var m1_next = document.createElement('div');
        m_span1.appendChild(m1_cur);
        m_span1.appendChild(m1_next);
        m1_cur.innerHTML = '0';
        m1_next.innerHTML = '0';
        CssUtil.setCss(m1_cur, cell_config);
        CssUtil.setCss(m1_next, cell_config);
        CssUtil.setCss(m1_next, next_config);

        // -------第2个cell------- //
        var h2_cur = document.createElement('div');
        var h2_next = document.createElement('div');
        h_span2.appendChild(h2_cur);
        h_span2.appendChild(h2_next);
        h2_cur.innerHTML = '0';
        h2_next.innerHTML = '0';
        CssUtil.setCss(h2_cur, cell_config);
        CssUtil.setCss(h2_next, cell_config);
        CssUtil.setCss(h2_next, next_config);

        // -------第1个cell------- //
        var h1_cur = document.createElement('div');
        var h1_next = document.createElement('div');
        h_span1.appendChild(h1_cur);
        h_span1.appendChild(h1_next);
        h1_cur.innerHTML = '0';
        h1_next.innerHTML = '0';
        CssUtil.setCss(h1_cur, cell_config);
        CssUtil.setCss(h1_next, cell_config);
        CssUtil.setCss(h1_next, next_config);

		// ------------------------------- //

		var c_height = parseInt(CssUtil.getCss(s2_cur, 'height'));
        var dist_config = {
            'top': -c_height + 'px'
        };
		CssUtil.setCss(s2_next, dist_config);
        CssUtil.setCss(s1_next, dist_config);
        CssUtil.setCss(m2_next, dist_config);
        CssUtil.setCss(m1_next, dist_config);
        CssUtil.setCss(h2_next, dist_config);
        CssUtil.setCss(h1_next, dist_config);

        setInterval(function(){
            makeTime();
        }, 1000);

        function makeTime(){
            var date = new Date();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            second = treatTime(second);
            minute = treatTime(minute);
            hour = treatTime(hour);
            
            var s_mark1 = second.slice(0, 1);
            var s_mark2 = second.slice(1);
            var m_mark1 = minute.slice(0, 1);
            var m_mark2 = minute.slice(1);
            var h_mark1 = hour.slice(0, 1);
            var h_mark2 = hour.slice(1);

            cellMove(s2_cur, s2_next, s_mark2);
            cellMove(s1_cur, s1_next, s_mark1);
            cellMove(m2_cur, m2_next, m_mark2);
            cellMove(m1_cur, m1_next, m_mark1);
            cellMove(h2_cur, h2_next, h_mark2);
            cellMove(h1_cur, h1_next, h_mark1);

            function treatTime(num){
                var res = '';
                if(num < 10){
                    res = '0' + num;
                }else{
                    res = num.toString();
                }
                return res;
            }

            function cellMove(cur, next, mark){
                next.innerHTML = mark;
                if(cur.innerHTML !== next.innerHTML){
                    AnimUtil.animate(next, {
                        'top': 0
                    }, {'dur': 500}, function(){
                        AnimUtil.animate(next, dist_config, {'dur': 0});
                        cur.innerHTML = mark;
                    });
                }
            }
        }

	}

	return {
		init: init
	}
}
