(()=>{
    //立即执行 匿名函数 为了不污染全局，内存泄漏
    "use strict";
    //如果url中带有查询字符串，获取当前mid,得到相应info
    let pno = 1;
    let mid = querystring(location.search).mid;
    let datelist = document.querySelector(".datelist");
    let pager = document.querySelector(".movies-pager");
    let datelistUl = datelist.querySelector("ul");
    let cinemaslistul= document.querySelector(".cinemas-list ul");
    //判断是否显示日期
    if(mid) {
        datelist.style.display="block";
        ajax({
            type:"get",
            url:"movieinfo.html",
        }).then((res)=> {
            banner.innerHTML = res;
            let css = document.createElement("link");
            css.rel = "stylesheet";
            css.href= "css/movieinfo.css";
            document.head.appendChild(css);
            let movieinfo = document.createElement("script");
            movieinfo.src = "js/movieinfo.js";
            document.body.appendChild(movieinfo);
            let now = new Date();
            let date = getDate(now.getTime(),true);
            let html = "";
            let day = "";
             html+= `<li><a href="#" class="active">今天${date}</a></li>`;
             now.setDate(now.getDate()+1);
             date = getDate(now.getTime(),true);
             html+= `<li><a href="#">明天${date}</a></li>`;
             now.setDate(now.getDate()+1);
             date = getDate(now.getTime(),true);
             html+= `<li><a href="#">后天${date}</a></li>`;
             for(let i=0;i<=7;i++) {
                 now.setDate(now.getDate()+1);
                 date = getDate(now.getTime(),true);
                 day = getDay(now.getTime());
                 html+= `<li><a href="#">${day}${date}</a></li>`;
             }
            datelistUl.innerHTML = html;
        });
    } else {
        datelist.style.display="none";
    }
    pager.addEventListener('click',function(e){
        e.preventDefault();
        let curelem = e.target;
        if(curelem.nodeName.toLowerCase()=="a" && curelem.dataset.no) {
            // console.log(curelem.dataset.no);
            getAllCinemas(curelem.dataset.no);
        }
    });
    //异步请求
    //得到所有电影院
    function getAllCinemas(pno){
        ajax({
            type:'get',
            url:'data/cinemas/getAllCenter.php',
            data:{
                pno
            },
            dataType:'json'
        })
        .then((res)=>{
            if(res.code>0) {
                let html = "";
                let html2 = "";
                console.log(res);
                let {data,pno,pageSize,pageCount} = res;
                // let pcount = Math.ceil(parseInt(pageCount)/parseInt(pageSize));
                // // pno = parseInt(pno);
                pno = parseInt(pno);
                pageCount = parseInt(pageCount);
                pageSize = parseInt(pageSize);
                let pcount = Math.ceil(pageCount/pageSize);
                console.log(pcount);
                for(let item of data) {
                    let {mcid, mcenter_name,address} = item;
                    html+=`<li class="clear">
                    <div class="cinemas-info">
                    <a href="cinema.html?mcid=${mcid}" class="title font16">${mcenter_name}</a>
                    <p class="address font14 mt10">地址：${address}</p></div>`;
                    if(mid) {
                        html+=`<a  class="buy-btn" href="cinema.html?mcid=${mcid}&mid=${mid}">选座购票</a>`;
                    } else {
                        html+=`<a  class="buy-btn" href="cinema.html?mcid=${mcid}">选座购票</a>`;
                    }
                    html+=`<p class="price"><span>￥48</span>起</p>
                    </li>`;
                }
                cinemaslistul.innerHTML = html;
    
                if(pno-1>0) {
                    html2+=`<a href="#" data-no="${pno-1}" >上一页</a>`;
                } else {
                    html2+=`<a href="#" class="disable">上一页</a>`;
                }
                html2+=``;
                if(pno-2>0){
                    html2+=`<a href="#" data-no="${pno-2}">${pno-2}</a>`;
                }
                if(pno-1>0){
                    html2+=`<a href="#" data-no="${pno-1}">${pno-1}</a>`;
                }
                html2+=`<a href="#" class="active">${pno}</a>`;
                if(pno+1<=pcount){
                    html2+=`<a href="#" data-no="${pno+1}">${pno+1}</a>`;
                }
                if(pno+2<=pcount){
                    html2+=`<a href="#" data-no="${pno+2}">${pno+2}</a>`;
                }
                if(pno+1<=pcount) {
                    html2+=`<a href="#" data-no="${pno+1}">下一页</a>`;
                } else {
                    html2+=`<a href="#" class="disable">下一页</a>`;
                }
                pager.innerHTML = html2;
                
            }
        });
    }
    getAllCinemas(1);

})();