
function Krecursetable(bar){

    // -------------------------- //
	
	function init(tableData, createCell){

		var deep = 0;
		function build(parentNode, obj){
			deep++;
    		var func = obj.func;
    		var div = document.createElement('div');
    		div.className = 'cell' + deep;
    		parentNode.appendChild(div);
    		for(var i = 0, item; item = func[i++]; ){
    			var name = item.name;
    			var cell = createCell(name);
    			div.appendChild(cell);
    			console.log(name);
    			if(!item.func){
    				continue;
    			}
    			build(cell, item);
    		}
    		deep--;
    	}

    	build(bar, tableData);
		
	}

	return {
		init: init
	}
}

