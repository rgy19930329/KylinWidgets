
function Kpicview(bar){

	var currentIndex = 0;

	var initMask = function() {
		var tmpl = document.createElement('div');
		tmpl.innerHTML =
		'<div class="ky-picview-mask">' +
	        '<div class="ky-picview-close"><i>&Chi;</i></div>' +
	        '<div class="ky-picview-prev"><i>&lt;</i></div>' +
	        '<div class="ky-picview-next"><i>&gt;</i></div>' +
	        '<div class="ky-picview-content"><img src=""></div>' +
	    '</div>';
		document.body.appendChild(tmpl);
	};

	var init = function() {
		initMask();

		var imgs = ky.select(bar, 'img');
		for(var i = 0; i < imgs.length; i++) {
			imgs[i].setAttribute('data-index', i);
		}

		ky.EventUtil.addEvent(imgs, 'click', function(){
			ky.CssUtil.addClass(ky.select('.ky-picview-mask'), 'ky-picview-mask-show');
			ky.select('.ky-picview-content img').src = this.src;
			currentIndex = +this.getAttribute('data-index');
		});

		ky.EventUtil.addEvent(ky.select('.ky-picview-prev'), 'click', function() {
			currentIndex--;
			if(currentIndex == 0) {
				ky.CssUtil.setCss(ky.select('.ky-picview-prev'), {
					'display': 'none'
				});
			}
			if(currentIndex < imgs.length - 1) {
				ky.CssUtil.setCss(ky.select('.ky-picview-next'), {
					'display': 'block'
				});
			}
			ky.select('.ky-picview-content img').src = imgs[currentIndex].src;
		});

		ky.EventUtil.addEvent(ky.select('.ky-picview-next'), 'click', function() {
			currentIndex++;
			if(currentIndex > 0) {
				ky.CssUtil.setCss(ky.select('.ky-picview-prev'), {
					'display': 'block'
				});
			}
			if(currentIndex == imgs.length - 1) {
				ky.CssUtil.setCss(ky.select('.ky-picview-next'), {
					'display': 'none'
				});
			}
			ky.select('.ky-picview-content img').src = imgs[currentIndex].src;
		});

		ky.EventUtil.addEvent(ky.select('.ky-picview-close'), 'click', function() {
			ky.CssUtil.removeClass(ky.select('.ky-picview-mask'), 'ky-picview-mask-show');
		});
	};

	return {
		init: init
	}
}
