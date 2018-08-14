(()=>{
    "use strict";
    let type = document.querySelector(".movie-channel .channel-item .type");
    let area = document.querySelector(".movie-channel .channel-item .area");
    let age = document.querySelector(".movie-channel .channel-item .age");
    let movielist = document.querySelector(".movies-list .movies-list-box");
    let pager = document.querySelector(".movies-pager");
    let mynav = document.querySelector(".mynav");
    let url = querystring(location.search);
    let pageSize = 24;
    let pno = 0;
    let typeactiveli = {index:0,tid:null};  //默认选中全部，记录当前active元素的索引
    let areaactiveli = {index:0,lid:null}; //默认选中全部，记录当前active元素的索引
    let ageactiveli ={index:0,age:null};  //默认选中全部，记录当前active元素的索引

    function getFocus(e){
        e.preventDefault();
        let cur = e.target;
        if(cur.nodeName.toLowerCase()=='a') {
            //判断自身是否有class active
            let parentli = cur.parentNode;
            //console.log(parentli);
            if(parentli.className.indexOf('active')==-1) {
                //移除其他兄弟元素的active class
                if(parentli.parentNode.className.indexOf("type")!==-1) {
                    parentli.parentNode.querySelector("[data-pos='"+typeactiveli.index+"']").className = "";
                    typeactiveli.index = parentli.dataset.pos;
                    typeactiveli.tid = cur.href;
                } else if(parentli.parentNode.className.indexOf("area")!==-1) {
                    parentli.parentNode.querySelector("[data-pos='"+areaactiveli.index+"']").className = "";
                    areaactiveli.index = parentli.dataset.pos;
                    areaactiveli.lid = cur.href;
                } else {
                    //当前点击的按钮为年代时
                    parentli.parentNode.querySelector("[data-pos='"+ageactiveli.index+"']").className = "";
                    ageactiveli.index = parentli.dataset.pos;
                    areaactiveli.age = cur.innerHTML;
                }
                //给其添加class active
                parentli.className = "active";
                // 发送异步请求到数据库，请求筛选后的影片
            }

        }
        //searchMovie();
    }

    pager.addEventListener("click",function(e){
        e.preventDefault();
        let curelem = e.target;
        if(curelem.nodeName.toLowerCase()=="a" && curelem.dataset.no) {
            // console.log(curelem.dataset.no);
            getAllClassicbusters(curelem.dataset.no);
        }
    });

    function fillHTML(res){
        // console.log(res);
        if(res.code>0) {
            let html = "";
            for(let item of res.data) {
                let {mid, mname, poster, ename, scoreavg} = item;
                let score = parseFloat(scoreavg) ? scoreavg : '暂无评分';
                html+=`
                    <div class="movie-item">
                        <a href="details.html?mid=${mid}"><img src="${poster}" alt=""></a>
                        <a href="#" class="movie-title">${mname}</a>
                        <p>${score}</p>
                    </div>
                `;
            }
            movielist.innerHTML = html;
            if(res.pno) {
                let {pno,pageSize,pageCount} = res;
                pno=parseInt(pno);
                pageSize=parseInt(pageSize);
                let pcount=Math.ceil(parseInt(pageCount)/pageSize);
                let html2 = "";
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
                //只显示中间5页
                pager.innerHTML = html2;
            }  else {
                pager.innerHTML = "";
            }
        }
    }

    function changeNav(cur) {
        let pageid = cur.id;
        let parent = cur.parentNode;
        // 判断是否当前元素父元素有 class active
        if(parent.className.indexOf('active')==-1) {
            // 移除兄弟元素 上的class active
            //console.log("进到if语句中");
            let activeElem = mynav.querySelector(".active");
            activeElem.className = "";
            //给当前元素加上active
            parent.className = "active";
            //获取相应的电影数据
            if(pageid=="l0"){
                getAllBlockbusters();
            } else if(pageid=="l1") {
                getAllWillShow();
            } else if(pageid=="l2"){
                getAllClassicbusters(pno);
            }
        }
    }
    function switchPage(e){
        e.preventDefault();
        let cur = e.target;
        if(cur.nodeName.toLowerCase()=="a") {
            changeNav(cur);
        }
    }
    function pagerchange(i){
        
    }
    //根据url模拟触发点击事件
    url.id=='l1' &&  changeNav(mynav.querySelector("#l1"));
    url.id=='l2' &&  changeNav(mynav.querySelector("#l2"));
    //请求正在热映的所有电影
    function getAllBlockbusters(){
        ajax({
            type:'get',
            url:'data/movie/getAllBlockbusters.php',
            dataType:'json'
        }).then(fillHTML);
    }
    //请求即将上映的所有电影
    function getAllWillShow(){
        ajax({
            type:'get',
            url:'data/movie/getAllWillShow.php',
            dataType:'json'
        }).then(fillHTML);
    }
    //请求经典影片的所有电影
    function getAllClassicbusters(i){
        ajax({
            type:'get',
            url:'data/movie/hotMovie.php',
            data:{
                // tid:typeactiveli.tid,
                // lid:areaactiveli.lid,
                // age:ageactiveli.age
                pno:i,
                pageSize,
            },
            dataType:'json'
        }).then(fillHTML);
    }

    //请求相应电影年代对应的-检索movie进行筛选
    age.addEventListener('click',getFocus,false);

    //默认请求全部电影 默认按照热门排序
    getAllBlockbusters();

    mynav.addEventListener('click',switchPage,false);

    // 异步请求

    //请求所有的电影类型
    ajax({
        type:'get',
        url:'data/movie/getAllType.php',
        dataType:"json"
    })
    .then((res)=>{
        //console.log(res);
        let html = `<li class="active" data-pos="0"><a href="#">全部</a></li>`;
        let i = 1;
        for(let item of res) {
            let {tid, tname} = item;
            html+=`<li data-pos="${i}"><a href="${tid}">${tname}</a></li>`;
            i++;
        }
        type.innerHTML = html;
        //给每一个元素绑定事件
        type.addEventListener('click',getFocus,false);
    });

    //请求所有的电影区域
    ajax({
        type:'get',
        url:'data/movie/getAllArea.php',
        dataType:"json"
    })
    .then((res)=>{
        let html = `<li class="active" data-pos="0"><a href="#">全部</a></li>`;
        let i = 1;
        for(let item of res) {
            let {lid, location} = item;
            if(location=='中国大陆') {
                location = '大陆';
            }
            html+=`<li data-pos="${i}"><a href="${lid}" >${location}</a></li>`;
            i++;
        }
        area.innerHTML = html;
        //给每一个元素绑定事件
        area.addEventListener('click',getFocus,false);
    });

})();