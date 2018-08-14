(()=>{ 
    //初始化
    "use strict";
    let tabList = document.querySelector("[data-toggle='tablist']");
    let buyticket = null;
    // console.log(tabList);
    //绑定点击tabList的点击事件
    let tabs = document.querySelector(".content .tabs");
    let introduct = "";
    tabs.addEventListener("click",function(e){
        e.preventDefault();
        var curtarget = e.target;
        if(curtarget.nodeName.toLowerCase()=="a" && curtarget.className.indexOf("active")==-1) {
            //去除其他a标记的active
            var activeElem = tabs.querySelector("li .active");
            activeElem.className = "";
            //给他加上active
            curtarget.className = "active";
            //拿到对应的html文件
            ajax({
                type:"get",
                url:curtarget.href,
            }).then((res)=>{
                tabList.className = curtarget.href;
                tabList.innerHTML = res;
            });
        }
    },false);

    //当页面加载完成时
        let mid=querystring(location.search).mid;
        ajax({
            type:"get",
            url:"movieinfo.html",
        }).then((res)=>{
            banner.innerHTML = res;
            let movieinfo = document.createElement("script");
            movieinfo.src= "js/movieinfo.js";
            document.body.appendChild(movieinfo);
            return ajax({
                type:"get",
                url:"data/movie/getInfo.php",
                data:{mid},
                dataType:"json"
            });
        }).then((result)=>{
            ({data:{info:{intro:introduct}}} = result);
            return ajax({
                type:"get",
                url:"./introduct.html"
            });
        }).then((res)=>{
            tabList.className = "introduct";
            tabList.innerHTML = res;
            let intro = document.querySelector(".introduct .intro p");

            // console.log(document.querySelector(".hidden-div"));  //与movieinfo.js的加载速度 无法确定
            intro.innerHTML = introduct;


        });
})();