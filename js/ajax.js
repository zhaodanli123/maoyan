	"use strict";
	//封装ajax操作
	//兼容性
	//因为无论如何xhr最终都会存储一个对象，因此先赋值为null
	//创建异步对象

	//为了防止callback hell 因此要使用Promise封装
	//type 请求方法
	//get 与 post的区别 get 的查询字符串写在url中加？
	//post的查询字符串写在send中无？ 单独设置请求头
	//data 查询字符串
	function ajax({type,url,data,dataType}) {
		return new Promise((open)=>{
			let xhr = null;
			if(window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			} else {
				xhr = new activeXObject("Microsoft XMLhttp");
			}
			//绑定事件
			xhr.onreadystatechange = function(){
				if(xhr.status === 200 && xhr.readyState === 4) {
					let result = xhr.responseText; 
					if(dataType&&dataType.toUpperCase()==="JSON") {
						result = JSON.parse(result);
					}
					open(result);
				}
			}
			//打开连接
			if(typeof data === "object") {
				//如果传过来的查询字符串为对象格式,就先转换为字符串
				let arr=[];
				for(let key in data) {
					arr.push(`${key}=${data[key]}`);
				}
				data = arr.join("&");
			}
			if(data&&type=="get") {
				url+=`?${data}`;
			}
			xhr.open(type,url);
			//发送请求
			if(type==="post") {
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				xhr.send(data);
			} else {
				xhr.send(null);
			}	
		});
			
	}