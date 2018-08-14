(()=>{
	"use strict";
let link = document.createElement("link");
link.rel = "stylesheet";
link.href="css/footer.css";
document.head.appendChild(link);


//异步请求部分
  ajax({
	type:"get",
	url:"footer.html"
  }).then(res=>{
	var footer = document.querySelector("#footer");
	footer.innerHTML = res;
  });
})();