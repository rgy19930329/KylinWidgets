
function Kscrollnav(nav, content){

	if(arguments.length != 2){
		alert("参数错误！");
	}

	function getAbsPoint(e) {
		var x = e.offsetLeft;
		var y = e.offsetTop;
		while (e = e.offsetParent) {
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		return {
			'x': x,
			'y': y
		};
	};

	function getDomPosList(){
		var res = [];
		var temp = content.querySelectorAll('a[name*=F]');
		for(var i = 0, len = temp.length; i < len; i++){
			res.push(getAbsPoint(temp[i]).y);
		}
		return res;
	}

	
	function init(){

		nav.style.position = 'fixed';

		var list = getDomPosList();
		var navList = nav.querySelectorAll('div');

		document.addEventListener('scroll', function(){
			for(var i = 0; i < list.length; i++){
				var top = document.body.scrollTop;
				if( top + 50 > list[i] && top - 50 < list[i]){
					break;
				}
			}
			if(i < list.length){
				for(var j = 0; j < navList.length; j++){
					navList[j].className = '';
				}
				navList[i].className = 'selected';
			}
		}, false);
	}

	return {
		init: init
	}
}

