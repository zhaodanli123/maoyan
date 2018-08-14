(()=>{
    //匿名函数自调 防止全局污染 内存泄漏
    "use strict";
    let avatorimg = document.querySelector(".post-shadow img");
    let moviebrief = document.getElementsByClassName("movie-brief-container")[0];
    let mid=querystring(location.search).mid;
    // 点击评分
    let toscore = document.querySelector(".action-buyBtn .toscore");
    let commentbox = document.querySelector(".comment-form-container-box");
    let closebtn = document.querySelector(".jBox-container .close");
    let scorestar = document.querySelector(".score-star");
    let scorestari = document.querySelectorAll(".score-star li i");
    let scoretitle = document.querySelector(".jBox-container>.title");
    let submitComment =document.querySelector(".jBox-container>.btn>button");
    let scoreSpan = document.querySelector(".movie-status-container .score span");
    let mycomment = document.getElementById("my-comment");
    let wantsee = document.getElementsByClassName("wantsee")[0];
    let scorecount=document.querySelector(".movie-status-container .scorecount");
    //console.log(scorecount);
    let uid = sessionStorage.getItem('uid');
    let starClickState = -1;  //星星点击状态
    let desc = ["超烂啊","比较差","一般般","比较好","棒极了"];
    let cid = -1;
    //点击星星评分
    let scorestarEvent = function(no){
        //是不是有更好的方法，优化？？
        //清除当前元素父元素的父元素中所有子元素的子元素的active
        //将当前元素前面的所有元素都加上active类
        for(let i=0;i<scorestari.length;i++) {
            if(i<=no && scorestari[i].className.indexOf("active")==-1) {
                scorestari[i].className += " active";
            } else if(i>no){
                if(i%2==0) {
                    scorestari[i].className = "half-star left";
                } else {
                    scorestari[i].className = "half-star right";
                }
            }
        }
        if(no>=0) {
            scoretitle.className = "title specTitle";
            scoretitle.innerHTML = `
            <p><span>${parseInt(no)+1}</span>分</p>
            <p>${desc[Math.floor(no/2)]}</p>
            </div>`;
        } else {
            scoretitle.className = "title";
            scoretitle.innerHTML = `请点击星星评分`;
        }
    }
    //用户对当前电影的favorite状态
    function getFav(state){
        if(uid) {
            ajax({
                type:'get',
                url:'data/user/getFav.php',
                data:{uid,mid},
                dataType:'json'
            }).then((res)=>{
                //console.log(res.code);
                if(res.code==1) {
                    //默认让‘想看’=>‘已想看’按钮为选中状态
                    wantsee.firstElementChild.src="images/redheart.png";
                    wantsee.lastElementChild.innerHTML = "已想看";
                    wantsee.dataset.fid = '1';
                } else {
                    wantsee.firstElementChild.src="images/heart.png";
                    wantsee.lastElementChild.innerHTML = "想看";
                    wantsee.dataset.fid = '0';
                }
            });
        } else {
            if(state) {
                location.href="login.html";
            }
        }
    }
    function getComment(){
        console.log("这总该有吧");
            ajax({
                type:'get',
                url:'data/user/getComment.php',
                data:{uid,mid},
                dataType:"json"
            }).then((res)=>{
                if(res.code==1) {
                    //用户已评论，拿到评论即可
                    console.log("只要页面加载进来就会有");
                    if(res.data.data) {
                        let {data:{data:{score,comment}}} = res;
                        ({data:{data:{cid}}}=res);
                        mycomment.value = comment;
                        starClickState = score;
                        toscore.firstElementChild.src="images/yellowstars.png";
                        toscore.lastElementChild.innerHTML=`${parseInt(score)+1}分 ${desc[Math.floor(score/2)]}`;
                    }
                    scorecount.innerHTML = res.data.count+"人评分";

                }
            });
    }
    toscore.addEventListener('click',function(e){
        e.preventDefault();
        //首先判断是否登录，如果为登录，跳转到登录页
        //如果登录成功
        if(uid){
            commentbox.className+=" show";
            scorestarEvent(starClickState);
        } else {
            location.href="./login.html";
        }
    });
    closebtn.addEventListener('click',function(e){
            commentbox.className = "comment-form-container-box";
    },false);
    commentbox.addEventListener('click',function(e){
        if(e.target==e.currentTarget) {
            commentbox.className = "comment-form-container-box";
        }
    },false);
    submitComment.addEventListener('click',function(e){
        e.preventDefault();
        //判断是否能点击
        if(this.className.indexOf('active')!==-1) {
            // 发送ajax请求
            let comment = mycomment.value;
            ajax({
                type:'post',
                url:'data/user/addComment.php',
                data:{
                    cid,
                    uid,
                    mid,
                    score:starClickState,
                    comment
                },
                dataType:'json'
            }).then((res)=>{
                if(res.code==1) {
                    //插入/更新成功
                    console.log("插入成功啦");
                    //星星变黄色，分值与desc显示在右侧
                    toscore.firstElementChild.src="images/yellowstars.png";
                    toscore.lastElementChild.innerHTML=`${parseInt(starClickState)+1}分 ${desc[Math.floor(starClickState/2)]}`;
                    getInfo();
                    getComment();

                } else {
                    //插入/更新失败
                    //console.log(res.msg);
                }
            });
        }
        //不管成功失败与否，都要关闭模态框
        commentbox.className = "comment-form-container-box";
    });
    wantsee.addEventListener('click',function(e){
        e.preventDefault();
        if(!uid) {
            location.href="login.html";
        }
        //发送ajax请求，如果现在为想看，则删除那条数据
        ajax({
            type:'post',
            url:'data/user/changeFav.php',
            data:{
                fid:wantsee.dataset.fid,
                uid,
                mid
            },
            dataType:"json"
        }).then((res)=>{
            if(res.code) {
                //console.log("删除或添加成功");
                getFav();
            }
        });
    });
    scorestar.addEventListener('mouseover',function(e){
            let cur = e.target;
            if(cur.nodeName.toLowerCase()=='i') {
                let no = cur.dataset.no;
                scorestarEvent(no);
            }
        }
    );
    scorestar.addEventListener('click',function(e){
            let cur = e.target;
            if(cur.nodeName.toLowerCase()=='i') {
                starClickState = cur.dataset.no;
                submitComment.className="active";
                scorestarEvent(starClickState);
            }
        }
    );
    scorestar.addEventListener('mouseleave',function(){
        //返回到上一次click时的状态，如果没有click过，则返回到不选中状态
        scorestarEvent(starClickState);
    });
    // 异步载入banner内容
    // 两种情况，当从购票入口加载movieinfo时(传递mid并且当前路径为index.html)，与从电影加载时（路径为movie.html
    function getInfo(){
        ajax({
            type:"get",
            url:"data/movie/getInfo.php",
            data:{mid},
            dataType:"json"
            })
            .then((result)=>{
            //console.log(result); 从数据库拿到{code :1/0 data/msg}
            let html = "";
            let endtime;
            if(result.code) {
                let {mname,ename,duration,showtime,intro,avator,scoreavg} = result.data.info;
                endtime = result.data.info.endtime;
                //console.log(endtime);
                let tid = result.data.tid;
                let location = result.data.location;
                avatorimg.src = `${avator}`;
                let date = getDate(showtime);
                html+=`<h3 class="name font26">${mname}</h3>
                <p class="ename font18 mb15">${ename}</p>
                <ul>
                <li class="ellipsis">${tid}</li>                                                                                                                                                    </li>
                <li class="ellipsis">${location}/${duration}分钟</li>
                <li class="ellipsis">${date}大陆上映</li>
                </ul>`;
                // document.querySelector(".hidden-div").innerHTML = intro;
                scoreSpan.innerHTML = scoreavg;
            }
            moviebrief.innerHTML = html;
            //如果下映时间已经pass大于当前时间，不显示购票按钮
            let now = new Date();
            let buyTicket = document.querySelector("[data-btn='buy-ticket']");
            if(parseInt(endtime)<now) {
                (buyTicket.className.indexOf('hide')==-1) && (buyTicket.className+=" hide");
            } else if(location.pathname.lastIndexOf("details.html")!==-1) {
                buyTicket.innerHTML = "特惠购票";
                buyTicket.href=`cinemas.html?mid=${mid}`;
            } else {
                buyTicket.href=`details.html?mid=${mid}`;
            }
        });
    }
    
    //异步请求用户对当前电影的favorite状态
    getFav();
    getInfo();
    //异步请求用户对当前电影的评论状态
    getComment();
})();