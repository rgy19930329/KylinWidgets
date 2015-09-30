function Kcircleprogressbar(bar){

	var radius = null;
	var thick = null;
	var bgColor = null;
	var fillColor = null;
	var proColor = null;
	var textColor = null;
	var textSize = null;

	var currentProcess = null;

	function draw(process) {  
        
        var ctx = bar.getContext('2d');
        ctx.clearRect(0, 0, radius * 2, radius * 2);  

        ctx.beginPath();  
        ctx.moveTo(radius, radius);  
        ctx.arc(radius, radius, radius, 0, Math.PI * 2, false);  
        ctx.closePath();  
        ctx.fillStyle = bgColor;  
        ctx.fill();  

        ctx.beginPath();  
        ctx.moveTo(radius, radius);    
        ctx.arc(radius, radius, radius, Math.PI * 1.5, Math.PI * 1.5 + Math.PI * 2 * process / 100, false);  
        ctx.closePath();  
        ctx.fillStyle = proColor;  
        ctx.fill();   

        ctx.beginPath();  
        ctx.moveTo(radius, radius);  
        ctx.arc(radius, radius, radius - thick, 0, Math.PI * 2, false);  
        ctx.closePath();  
        ctx.fillStyle = fillColor;  
        ctx.fill();  

        ctx.font = 'bold ' + textSize + ' Microsoft Yahei';  
        ctx.fillStyle = textColor;  
        ctx.textAlign = 'center';  
        ctx.textBaseline = 'middle';  
        ctx.fillText(process + '%', radius, radius);
	}

	function getProcess(){
		return currentProcess;
	}

	function setProcess(value){
		var process = value;
		if(process <= 100 && process >= 0){
			currentProcess = process;
			draw(currentProcess);
		}
	}

	function init(obj, data){
		var obj = obj || {};
		var data = data || {};

		var bwidth = bar.width;
		var bheight = bar.height;
		var r = Math.min(bwidth, bheight);
		console.log(r);

		radius = parseInt(obj.radius) || r / 2;
		thick = parseInt(obj.thick) || 10;
		bgColor = obj.bgColor || '#eee';
		fillColor = obj.fillColor || '#fff';
		proColor = obj.proColor || 'orange';
		textColor = obj.textColor || '#59f';
		textSize = obj.textSize || '20px';

		var str_process = data.process || '50%';
		currentProcess = parseInt(str_process);

		var process = str_process.slice(0, -1);
		draw(process);
	}

	return {
		init: init,
		getProcess: getProcess,
		setProcess: setProcess
	}

}