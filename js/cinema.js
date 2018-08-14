(()=>{
    "use strict";
    let posterimg = document.querySelector('.post-shadow>img');
    let info = document.querySelector('.movie-brief-container');
    let carouselul = document.querySelector(".carousel ul");
    let minfo_title= document.querySelector(".movie-info .movie-title");
    let minfo_msg= document.querySelector(".movie-info .movie-msg");
    let mdate= document.querySelector(".movie-date");
    let moviedetail= document.querySelector(".movie-details");
    let notfounddetail= document.querySelector(".notfound-details");
    let movietoshow = document.querySelector(".movie-to-show .today-show");
    let mdetails= moviedetail.querySelector(".detail-tbody");
    let mcid = querystring(location.search).mcid;
    let mid =  querystring(location.search).mid;
    let contentbox = document.querySelector(".content-box");
    let curmid;
    let duration = null;
    //得到今天0点的时间戳 如何得到        
    console.log(getDate(Date.now(),true,true));         
    movietoshow.innerHTML = "今天"+getDate(Date.now(),true);
    //函数记忆？？
    let memory = {};

    //得到影院信息
    function getDetails(){
        ajax({
            type:'get',
            url:'data/cinemas/getMC.php',
            data:{mcid},
            dataType:'json'
        })
        .then((res)=>{
            // console.log(res);
            let html = "";
            let {mcid,poster,parking,tel,address,childassist,glass,mbid,mcenter_name} = res;
            html += ` 
                <h3 class="name font26">${mcenter_name}</h3>
                <p class="ename font18 mb15">${address}</p>
                <p class="ename font18 mb15">${tel ? "电话："+tel : ""}</p>
                <P>影院服务 ————————————————————————————————————————</P>
                <ul class="mt10">
                    <li class="ellipsis"><span>3D眼镜</span>${glass}</li>
                    <li class="ellipsis"><span>儿童优惠</span>${childassist}</li>
                    <li class="ellipsis"><span>可修车</span>${parking}</li>
                </ul>`;
            posterimg.src = `${poster}`;
            info.innerHTML = html;
        });
    }
    //获取影院当前正在上映的电影的mids
    function getMovies() {
        ajax({
            type:'get',
            url:'data/cinemas/getMovies.php',
            data:{mcid},
            dataType:'json'
        })
        .then((res)=>{
             console.log(res);
            if(res.length>0) {
                //找到当前数据对应的mid，去movie表中找到
                let arr = [];
                for(let item of res) {
                    // 如果 memory 里面没有此mid对应的详情，则去去movie表中找到
                    arr.push(getMovieinfo(item));
                }
                let all = Promise.all(arr);
                all.then(()=>{
                    //异步完成
                    if(memory) {
                        let html = "";
                        for(let i in memory) {
                            let {poster,mid} = memory[i].data.info;
                            html+=`<li><a href="#"><img src="${poster}" alt="" data-mid="${mid}"></a></li>`;
                        }
                        carouselul.innerHTML = html;
                        if(carouselul.querySelector("[data-mid='"+mid+"']")){
                            let curposter = carouselul.querySelector("[data-mid='"+mid+"']")
                            curposter.parentNode.parentNode.className = "selected-poster";
                            getMovieDetail(mid);
                            curmid = mid;
                        } else {
                            let curposter = carouselul.querySelector("li:first-child a img");
                            let mid = curposter.dataset.mid;
                            curmid = mid;
                            //console.log(curmid);
                            curposter.parentNode.parentNode.className = "selected-poster";
                            getMovieDetail(mid);
                        }
                    }
                });
            } else {
                //页面中显示404提示信息
                if(contentbox.className.indexOf('notfound')==-1) {
                    contentbox.className+=" notfound";
                    contentbox.innerHTML = `<img src="./images/404.png"><p>此影城未有上映电影<p>`;
                }
            }
        });
    }
    //获取影院所有上映中电影的大概信息
    function getMovieinfo(mid){
        //console.log("调用");
        return new Promise((resolve,rejected)=>{
            ajax({
                type:'get',
                url:'data/movie/getInfo.php',
                data:{mid},
                dataType:'json'
            }).then((res)=>{
                memory[mid] = res;
                //console.log(memory);
                resolve("done");
            });
        });
    }
    // 获取当前电影的详细信息
    function getMovieDetail(mid){
        getMoviesTime(mid);
        let {mname,fav} = memory[mid].data.info;
        duration = parseInt(memory[mid].data.info.duration);
        let {location,tid} = memory[mid].data;
        let html = `<h3 class="title">${mname}</h3>
            <span class="count">${fav}</span><span>人想看</span>`;
        minfo_title.innerHTML = html;
        html = `<div><span>时长：</span><span>${duration?duration+"分钟":'暂无'}</span></div>
            <div><span>类型：</span><span>${tid}</span></div>
            <div><span>主演：</span><span></span></div>`;
        minfo_msg.innerHTML = html;

    }
    //获取当前影院、当前电影的场次
    function getMoviesTime(mid){
        ajax({
            type:'get',
            url:'data/cinemas/curMovieTicketDetail.php',
            data:{mcid,mid},
            dataType:'json'
        }).then((res)=>{
            if(res.info.length>0) {
                //console.log("场次信息",res);
                let html = "";
                for(let item of res.info) {
                    let {cid, hid, lang, mcid, mid, price} = item;
                    let startdate = getTime(item.date);
                    let enddate = getTime(parseInt(item.date)+duration*60000);
                     html+= `<tr><td><p>${startdate}</p>`;
                     if(duration) {
                        html+=`
                        <p>${enddate}散场</p>`;
                     }
                        html+=`</td>
                        <td>${lang}</td>
                        <td>${res.halls[hid]}</td>
                        <td class="price">￥<span>${price}</span></td>
                        <td><a href="xseats.html?cid=${cid}&mid=${mid}" class="buy-btn font14">选票购座</a></td>
                    </tr>`;
                }
                mdetails.innerHTML = html;
                if(moviedetail.className.indexOf('hide')!==-1) {
                    moviedetail.className="movie-details";
                    notfounddetail.className += " hide";
                }
            } else {
                // moviedetail.innerHTML = "";
                if(moviedetail.className.indexOf('hide')==-1) {
                    moviedetail.className+=" hide";
                    notfounddetail.className = "notfound-details";
                }
            }
            
        });
    }

    //点击事件
    carouselul.addEventListener('click',function(e){
        e.preventDefault();
        let cur = e.target;
        if(cur.nodeName.toLowerCase()=="img") {
            let prevposter = this.querySelector("[data-mid='"+curmid+"']");
            if(!(cur==prevposter)) {
                prevposter.parentNode.parentNode.className = "";
                cur.parentNode.parentNode.className = "selected-poster";
                curmid = cur.dataset.mid;
                getMovieDetail(cur.dataset.mid);
            }
        }
    },false);

    //异步请求
    getDetails();
    getMovies();
})();
