(()=>{
	"use strict";
	let banner = document.getElementById("banner");
	let bannerimg = document.querySelector("#banner .banner-post");
	let part1contentElem = document.querySelector("#main .part1-left .content");
	let part2contentElem = document.querySelector("#main .part2-left .content");
	let part1rightContent = document.querySelector("#main .part1-right .content");
	let part2rightContent = document.querySelector("#main .part2-right .content");
	let part3rightContent = document.querySelector("#main .part3-right .content");
	//半成品...
	let part3contentElems= document.querySelectorAll("#main .part3-left .content .post-shadow");
	//备用 异步请求后才能赋值
	let topticket = null;
	let topticket2 = null;
	let timer = null;
	
	// let canJump = document.querySelectorAll('[data-mid]');
	// changeShow函数用来封装轮播图变换
	function changeShow(e){
		//let a = e.target;
		//如果是定时器切换图片，就模拟点击右键效果
		let a = e ? e.target : document.querySelector("#banner .right-arrow");
		let circle = document.querySelector("#banner .four-btn .active");
		let show = document.querySelector(".banner-post .show");
		let beforeShow = show.previousElementSibling;
		let afterShow = show.nextElementSibling;
		let beforeCircle = circle.previousElementSibling;
		let afterCircle = circle.nextElementSibling;
		let firstShow = show.parentNode.firstElementChild;
		let lastShow = show.parentNode.lastElementChild;
		if(a.className==="left-arrow") {
			//如果当前图片是第一张图片，则.show放在最后一个元素上
			e.preventDefault();
			//得到class为.show的li
			show.className = "";
			circle.className = "";
			if(show===firstShow) {
				lastShow.className = "show";
				circle.parentNode.lastElementChild.className = "active";
			} else {
				beforeShow.className = "show";
				beforeCircle.className = "active";
			}
		} else if(a.className==="right-arrow"){
			e && e.preventDefault();
			show.className = "";
			circle.className = "";
			if(show===lastShow) {
				firstShow.className = "show";
				circle.parentNode.firstElementChild.className = "active";
			} else {
				afterShow.className = "show";
				afterCircle.className = "active";
			}
		} else if(a.parentNode.className.indexOf("four-btn")!==-1 && circle!==a ) {
			e.preventDefault();
			circle.className = "";
			show.className = "";
			a.className = "active";
			//要知道当前元素为第几个元素
			let num = a.getAttribute("data-num");
			console.log(show.parentNode.children[num]);
		    show.parentNode.children[num].className = "show";
		}
	};
	//事件委托 给其父元素绑定onclick事件，减少事件调用者负担，加快事件遍历速度

	//main事件委托：post-shadow触发
    main.addEventListener("click",function(e){
    	let curtarget = e.target;
        if(curtarget.className=="post-shadow") {
    		//跳转到detail.html页面 并且mid带参
			let mid = curtarget.dataset.mid;
			// console.log(mid);
			location.href="details.html?mid="+mid;
		}
	},false);
	// 如何绑定事件 是最优化的？ 【待优化】
	function jumptoDetail(e){
        e.preventDefault();
        let mid = this.dataset.mid;
        location.href="details.html?mid="+mid;
    };

    banner.addEventListener("click",changeShow);
	banner.addEventListener("mouseenter",function(){
		clearInterval(timer);
		timer = null;
	});
	banner.addEventListener("mouseleave",function(){
		timer = setInterval(changeShow,8000);
	});
	//这样写真的好吗？定时器 【待优化】
	


	//异步请求数据
//  ajax({type,url,data,dataType})

//  banner
	ajax({
		type:"get",
		url:"data/movie/getBanner.php",
		dataType:"json"
	}).
	then((res)=>{
		//console.log(res);
		let html = "";
		for(let item of res) {
			let {bid,banner} = item;
			html+=`<li><a href="#"><img src="${banner}" alt=""></a></li>`;
		}
		bannerimg.innerHTML = html;
		//给第一个li添加className show
		bannerimg.querySelector("li:first-child").className = "show";

	});
// 正在热映
	ajax({
        type:"get",
		url:"./data/movie/blockbusters.php",
		data:"",
		dataType:"json"
	}).
	then((res)=>{
		//console.log(res);
        let html = "";
        for(var item of res) {
            var {mid,mname,poster,scoreavg} = item;
			html+=`<div class="movie-items">
                <div class="movie-info relative">
                    <img src="${poster}" alt="">
                    <div class="post-shadow" data-mid="${mid}">	
                        <span class="movie-name">${mname}</span>
                        <span class="movie-score">`;
			if(scoreavg){
				var integer = scoreavg.split(".")[0];
            	var fraction = scoreavg.split(".")[1];
				html+=`<span class="integer">${integer}.</span>
                   <span class="fraction">${fraction}</span>`;
			} else {
				html+=`<span style="font-size:12px;font-style: normal;">暂无评分</span>`;
			}
			html+=`</span>
                    </div>
                </div>
                <a href="cinemas.html?mid=${mid}" class="buy-btn">购票</a>
            </div>`;
        }
		part1contentElem.innerHTML = html;
	});
// 即将上映
	ajax({
        type:"get",
		url:"./data/movie/willShow.php",
		data:"",
		dataType:"json"
	}).
	then((res)=>{
		//console.log(res);
        let html = "";
        for(var item of res) {
            var {mid, mname, poster, ename, fav, showtime} = item;
            //console.log("页面重新渲染");
			var showtime = getDate(showtime,true);
			html+=`<div class="item-container">
					<div class="movie-items">
						<div class="movie-info relative">
							<img src="${poster}" alt="">
							<div class="post-shadow" data-mid="${mid}">	
								<span class="movie-name">${mname}</span>
							</div>
						</div>
						<p class="like-count">${fav}人想看</p>
						<a href="#" class="preview-video">预告片</a><a href="cinemas.html?mid=${mid}" class="prebuy">预售</a>
					</div>
					<p class="showtime">${showtime}上映</p>
				</div>`;
        }
		part2contentElem.innerHTML = html;
	});
// 最受期待
	ajax({
		type:'get',
		url:'data/movie/topExpect.php',
		dataType:'json'
	}).
	then((res)=>{
		// console.log(res);
		// let {mid, mname, poster, ename, fav, showtime} = res[i];
        // let stime =
		let html = "";
		let html2 = "";
		let {mid,poster,mname,showtime,fav} = res[0];
		html+=`<div class="top-ticket flex hot-part-spec" data-mid="${mid}">
					<div class="left-part relative">
						<img src="${poster}" class="top-img" alt="">
						<img src="images/hot.png" alt="" class="trophy">
					</div>
					<div class="right-part flex">
						<p class="font18">${mname}</p>
						<p class="font16">上映时间：<strong>${getDate(showtime)}</strong></p>
						<p class="font14">${fav}人想看</p>
					</div>
				</div>
				<div class="next-top flex">
				`;
		for(let i=1;i<=2;i++) {
            let {mid,poster,mname,showtime,fav} = res[i];
            html+=`<div class="movie-items relative" data-mid="${mid}">
					<div class="img-box">
						<img src="${poster}" alt="">	
					</div>
					<p class="movie-title font18">${mname}</p>
					<p class="like-count">${fav}人想看</p>
					<div class="order font16">${i+1}</div>
				</div>`;
		}
		html+="</div><ul>";
		for(let i=3;i<res.length;i++) {
            let {mid,mname,fav} = res[i];
            html+=`
			<li data-mid="${mid}">
				<a href="#">
					<span>${i+1}</span>
					<span>${mname}</span>
					<span>${fav}人想看</span>
				</a>
			</li>`;
		}
		html+="</ul>";

		// html2
		html2+=`<div class="top-ticket flex" data-mid="${mid}">
		<div class="left-part relative">
			<img src="images/ticket-one.jpg" alt="">
			<img src="images/trophy.png" alt="" class="trophy">
		</div>
		<div class="right-part flex">
			<p class="font18">${mname}</p>
			<p class="font14">${fav}张</p>
		</div>
	    </div>
	    <ul>`;
		for(let i=1;i<res.length;i++) {
			let {mid,mname,fav} = res[i];
			html2+=`<li data-mid="${mid}">
			<a href="#">
				<span>${i}</span>
				<span>${mname}</span>
				<span>${fav}张</span>
			</a>
		</li>`;
		}
		html2+=`</ul>
		<div class="today-check flex">
			<div class="left">今日大盘</div>
			<div class="right">
				<p class="msg">
					<span class="count">2709.2</span>
					<span>万</span>
					<a href="javascript:;" class="rf">查看更多》</a>
				</p>
				<p class="sub-msg">
					<span>北京时间10:06:05</span>
					<span class="rf">猫眼专业版实时票房数据</span>
				</p>
			</div>
		</div>`;
		

		part2rightContent.innerHTML = html;
		part1rightContent.innerHTML = html2;
		topticket=part2rightContent.firstElementChild;
		topticket2=part1rightContent.firstElementChild;
        let movieitems = part2rightContent.querySelectorAll(".movie-items");
		let lis = part2rightContent.querySelectorAll("ul li");
		let lis2 = part1rightContent.querySelectorAll("ul li");
        //事件绑定
		//这样写真的好吗？？ [待优化]
		topticket.addEventListener("click",jumptoDetail,false);
		topticket2.addEventListener("click",jumptoDetail,false);
        movieitems[0].addEventListener("click",jumptoDetail,false);
		movieitems[1].addEventListener("click",jumptoDetail,false);
		for(let i=0;i<=8;i++) {
            lis2[i].addEventListener("click",jumptoDetail,false);
		}
        for(let i=0;i<=6;i++) {
            lis[i].addEventListener("click",jumptoDetail,false);
		}
	});
// TOP 100
	ajax({
		type:'get',
		url:"data/movie/hotView.php",
		dataType:'json'
	}).
	then((res)=>{
		//console.log(res);
		let html = "";
		let {mid,poster,mname,scoreavg} = res[0];
		html+=`
			<div class="top-ticket flex " data-mid='${mid}'>
				<div class="left-part img-box2 relative">
					<img src="${poster}" alt="">
					<img src="images/star.png" alt="" class="trophy">
				</div>
				<div class="right-part flex">
					<p class="font18">${mname}</p>
					<p class="font14">${scoreavg}</p>
				</div>
			</div>
		`;
		html+="<ul>";
		for(let i=1;i<=9;i++) {
			let {mid,mname,scoreavg}  = res[i];
            html+=`<li data-mid="${mid}">
				<a href="#">
					<span>${i+1}</span>
					<span>${mname}</span>
					<span>${scoreavg}</span>
				</a>
			</li>`;
		}
        html+="</ul>";
        part3rightContent.innerHTML = html;

        topticket=part3rightContent.firstElementChild;

        let lis = part3rightContent.querySelectorAll("ul li");
        //事件绑定
        //这样写真的好吗？？ [待优化]
        topticket.addEventListener("click",jumptoDetail,false);
        for(let i=0;i<=8;i++) {
            lis[i].addEventListener("click",jumptoDetail,false);
        }
	});
})();
//今日票房
	ajax({
		type:'get',
		url:'data/movie/ticketTop.php'
	}).then((res)=>{
		console.log();
	});


