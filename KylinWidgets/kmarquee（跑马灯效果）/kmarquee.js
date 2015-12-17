
function Kmarquee(bar){

	
	
	function init(){

		var dur = 30;
		var tab = document.getElementById("demo");
		var tab1 = document.getElementById("demo1");
		var tab2 = document.getElementById("demo2");
		tab2.innerHTML = tab1.innerHTML;

		function Marquee() {
			if (tab2.offsetWidth - tab.scrollLeft <= 0){
				tab.scrollLeft -= tab1.offsetWidth;
			}else {
				tab.scrollLeft++;
			}
		}

		var clock = setInterval(Marquee, dur);
		tab.onmouseover = function() {
			clearInterval(clock);
		};
		tab.onmouseout = function() {
			clock = setInterval(Marquee, dur);
		};
	}

	return {
		init: init
	}
}

