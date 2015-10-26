
function Ktyper(typer){

    // ---------------------------- //
	
	function init(obj){
		var obj = obj || {};
		var dur = obj.dur || 100;

		var paragraphs = typer.getElementsByTagName('p');
		var res = [];
		for(var i = 0; i < paragraphs.length; i++){
			var item = paragraphs[i].innerText.split('');
			res.push(item);
			paragraphs[i].innerHTML = '';
		}

		// ----------------- //

		print(paragraphs[0], res[0]);

		var rIndex = 1;
		function print(paragraph, item){
			if(rIndex >= res.length){
				return;
			}
			rIndex++;
			// ------------ //
			paragraph.innerHTML = '';
			var index = 0;
			var clock = setInterval(function(){
				if(index >= item.length){
					clearInterval(clock);
					print(paragraphs[rIndex], res[rIndex]);
					return;
				}

				paragraph.innerHTML += item[index]; 
				index++;
			}, dur);
		}
	}

	return {
		init: init
	}
}

