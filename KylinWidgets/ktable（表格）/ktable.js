/**
	表格组件
*/
function Ktable(table){
	
	/**
		删除行
	*/
	function deleteRow(index){
		if(table.tBodies[0].rows[0]){
			table.tBodies[0].deleteRow(index);
		}	
	}

	/**
		删除列
	*/
	function deleteCol(index){
		if(getColNum() > 0){
			if(table.tHead.rows[0]){
				table.tHead.rows[0].deleteCell(index);
				for(var i = 0, len = table.tBodies[0].rows.length; i < len; i++){
					table.tBodies[0].rows[i].deleteCell(index);
				}
			}else{
				for(var i = 0, len = table.tBodies[0].rows.length; i < len; i++){
					table.rows[i].deleteCell(index);
				}
			}
		}
	}

	/**
		插入行
	*/
	function insertRow(index){
		var otr = table.tBodies[0].insertRow(index);
		for(var i = 0, len = table.rows[0].cells.length; i < len; i++){
			otr.insertCell().innerHTML = "null";
		}
	}

	/**
		插入列
	*/
	function insertCol(index){
		if(index < -1){
			return;
		}
		if(table.tHead.rows[0]){
			var otr = table.tHead.rows[0];
			var list = otr.getElementsByTagName('th');
			var newTh = document.createElement('th');
			newTh.innerHTML = "null";
			otr.insertBefore(newTh, list[index]);
		}
		for(var i = 0, len = table.tBodies[0].rows.length; i < len; i++){
			var otr = table.tBodies[0].rows[i];
			otr.insertCell(index).innerHTML = "null";
		}
	}

	/**
		获得行数
	*/
	function getRowNum(){
		return tab.tBodies[0].rows.length;
	}

	/**
		获得列数
	*/
	function getColNum(){
		return table.rows[0].cells.length;
	}

	/**
		获取单元格对象
	*/
	function getCell(rowIndex, colIndex){
		var cell = table.tBodies[0].rows[rowIndex].cells[colIndex];
		return cell;
	}

	/**
		获取所有表格数据，以二维数组方式返回数据
	*/
	function getDataList(){
		var list = [];
		for(var i = 0, len1 = getRowNum(); i < len1; i++){
			var rowList = [];
			for(var j = 0, len2 = getColNum(); j < len2; j++){
				rowList[j] = getCell(i, j).innerHTML;
			}
			list.push(rowList);
		}
		return list;
	}

	/**
		双击让单元格可编辑
	*/
	table.addEventListener('dblclick', function(event){
		var evt = event || window.event;
		var currentCell = evt.target || evt.srcElement;
		var temp = currentCell.innerHTML;
		currentCell.innerHTML = "";

		var input = document.createElement("input");
    	input.type="text";
    	
        //用单元格的值来填充文本框的值
        input.value = currentCell.innerHTML;
        //当文本框丢失焦点时调用
        input.onblur = function(){
        	currentCell.innerHTML = input.value || temp;
        }
        
        //把文本框加到当前单元格上
        currentCell.appendChild(input);
        input.focus();

	}, false);

	return {
		deleteRow: deleteRow,
		deleteCol: deleteCol,
		insertRow: insertRow,
		insertCol: insertCol,
		getCell: getCell,
		getRowNum: getRowNum,
		getColNum: getColNum,
		getDataList: getDataList
	}
}