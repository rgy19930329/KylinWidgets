
function Kpicview(bar){


	
	function init(){

		var kprev = ky.select('.ky-picview-prev');
		ky.EventUtil.addEvent(kprev, 'click', function() {
			ky.CssUtil.removeClassAll(ky.select('.ky-picview-content'), 'ky-picview-content-prev');
		});
		
	}

	return {
		init: init
	}
}
