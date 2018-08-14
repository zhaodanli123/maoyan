(()=>{
"use strict";
let link = document.createElement("link");
link.rel="stylesheet";
link.href="css/header.css";
//从本地存储中获取uid
var uid = sessionStorage.getItem('uid');
document.head.appendChild(link);
function getCurrentUrl() {
	var curnav = location.pathname.lastIndexOf("/");
	curnav = location.pathname.slice(curnav+1) || 'index.html';
	var active = document.querySelector('ul.navbar li a.active');
	var curhref = document.querySelector(`ul.navbar li a[href='${curnav}']`);
	// console.log();
	if(curhref&&(curhref!==active) || curhref=='404.html') {
		active.className = "";
		curhref.className = "active";
	}
}
// 跳转到search页面
function jumptoSearch(e){
	e.preventDefault();
	// console.log(e.target);
	let kw = e.target.querySelector("[type='text']").value;
	location.href=`search.html?kw=${kw}`;
	// console.log(kw);
	// console.log("跳转页面");
}
//显示隐藏的登录下拉菜单
//初始化元素 init
let uinfo = null;
let uinfoUl = null;
let uinfocaret = null;
let logout = null;
let citycontainer = null;
let citycaret = null;
let cityUl = null;
let curcity = null;
let ecode = null;
let ecodecaret = null;
let myHeader = document.querySelector('#header');
//页面滚动事件
window.addEventListener('scroll',()=>{
	// console.log(this.scrollX);
   myHeader.style.left=-this.scrollX+"px";
})
function showLoginUL(){
	if(uinfoUl.className.indexOf('hide')!==-1) {
		uinfoUl.className = " ";
		//uinfocaret.className.split('').splice(uinfocaret.className.indexOf('open'),4);
		uinfocaret.className+=" open";
	} else {
		uinfoUl.className = "hide";
		uinfocaret.className="caret rf";
	}
}
function logoutEvent(e){
	//点击登出,登出成功，跳转到login页面
	e.preventDefault();
    sessionStorage.removeItem('uid');
    location.href='login.html';
}
function showDropdown(ul,caret){
	if(ul.className.indexOf('hide')!==-1) {
		ul.className = " ";
		caret.className+=" open";
	} else {
		ul.className = "hide";
		caret.className="caret rf";
	}
}
function switchCity(e){
	let curtarget = e.target;
	let cityno = e.target.dataset.no;
	//切换为当前
	if(curcity.innerHTML != curtarget.innerHTML) {
		curcity.innerHTML = curtarget.innerHTML;
		// sessionStorage.setItem("city",cityno);
	}
}
//发送ajax请求，请求header.html页面，拿到内容，给页面中的 .class为header的元素

//需要异步请求的部分
ajax({
	type:"get",
	url:"header.html",
}).then(res=>{
	let header = document.querySelector("#header");
	header.innerHTML = res;
	//当获取到当前的url
	getCurrentUrl();
	//绑定事件
	uinfo = document.querySelector(".user-info");
	if(uid) {
		uinfoUl = document.querySelectorAll(".user-info ul")[1];
	}
	else {
		uinfoUl = document.querySelectorAll(".user-info ul")[0];
	}
	let searchform = document.querySelector('.search-form');
	citycaret =  document.querySelector(".city-container .caret");
	citycontainer =  document.querySelector(".city-container");
	curcity = document.querySelector(".city-container .city");
	cityUl = document.querySelector(".city-container ul");
	uinfocaret = document.querySelector(".user-info .caret");
	ecode = document.querySelector(".app-download");
	ecodecaret = ecode.querySelector(".caret");
	ecode.addEventListener('click',()=>{showDropdown(ecode.querySelector("ul"),ecodecaret)});
	uinfo.addEventListener('click',showLoginUL);
	citycontainer.addEventListener('click',()=>{showDropdown(cityUl,citycaret)});
	cityUl.addEventListener('click',switchCity);

	// sessionStorage.setItem("city",curcity.dataset.cno);

    logout = document.querySelector(".logout");
	logout.addEventListener("click",logoutEvent);
	searchform.addEventListener("submit",jumptoSearch);
});
})();