
function ajax(opts){

	var defaults = {
		method: 'GET',
		url: '',
		data: '',
		dataType: 'json',
		async: true,
		success: function(){},
		error: function(){}
	}

	for(var key in opts){
		defaults[key] = opts[key];
	}

	(function(){
		var str = '';
		for(var key in defaults.data){
			str += (key + '=' + defaults.data[key] + '&');
		}
		defaults.data = str.slice(0);
	})();
	
	defaults.method = defaults.method.toUpperCase();
	if(defaults.method === 'GET' && defaults.data){
		defaults.url += '?' + defaults.data;
	}

	if(defaults.method === 'GET'){
		doGet(defaults.url);
	}else if(defaults.method === 'POST'){
		doPost(defaults.url, defaults.data);
	}

	// -------------------------- //

	function createXmlHttp(){
		var xmlHttp = null;

		if(window.ActiveXObject){//IE浏览器
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}else if(window.XMLHttpRequest){
			xmlHttp = new XMLHttpRequest();
		}

		return xmlHttp;
	}

	function readyStateChange(xmlHttp){
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				if(defaults.dataType === 'json'){
					try{
						defaults.success.call(xmlHttp, JSON.parse(xmlHttp.responseText));
					}catch(e){
						throw new Error("数据解析错误！");
					}
				}else{
					defaults.success.call(xmlHttp, xmlHttp.responseText);
				}
			}else{
				defaults.error.call(xmlHttp, xmlHttp.responseText);
			}
		}
	}

	function doGet(url){
		var xmlHttp = createXmlHttp();
		xmlHttp.open("GET", url, true);//这里的true表示 异步传输
		xmlHttp.send(null);
		readyStateChange(xmlHttp);
	}

	function doPost(url, data){
		var xmlHttp = createXmlHttp();
		xmlHttp.open("POST", url, true);//这里的true表示 异步传输
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlHttp.send(data);
		readyStateChange(xmlHttp);
	}

}
