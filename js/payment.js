(()=>{
    "use strict";
    //从sessionStorage中获取ordernum和remaintime
    let ordersession = sessionStorage.getItem("ordername");
    let minutes = document.querySelector(".count-down .minutes");
    let seconds = document.querySelector(".count-down .seconds");
    let nowtime = Date.now();
    let totalprice = querystring(location.search).p;
    let seatsArr = decodeURI(querystring(location.search).seats).split(",");
    let cid = querystring(location.search).cid;
    let mid = querystring(location.search).mid;
    let tbodydiv = document.querySelector(".ticket-info .mytbody");
    let totalmoney = document.querySelector(".total-money .price");
    let userpay = document.querySelector(".userpay");
    let errormsg = document.querySelector(".error-msg");
    let date;
    totalmoney.innerHTML = totalprice;
    let mcname;
    let duration;
    let mname;
    let showtime;
    let hall={};
    let uid = sessionStorage.getItem('uid') || "";
    let showdate;
    let starttime = ordersession ? ordersession.split('_')[1] : Date.now(); 
    let timerFunc = function(){
        let time = ms();
        minutes.innerHTML = time.minutes;
        seconds.innerHTML = time.seconds;
        // console.log(time.minutes,time.seconds);
        if(time.minutes<=0 && time.seconds<=0) {
            clearInterval(timer);
            //如果当前执行完了，弹出一个模态框，告知其已放弃支付
            //删除showing_movie_ticket表中的数据
            ajax({
                type:"post",
                url:'data/cart/cancelTicket.php',
                data:{ordernum:sessionStorage.getItem("ordername").split('_')[0]},
                dataType:'json'
            }).then((res)=>{
                if(res.code>0) {
                    sessionStorage.removeItem("ordername");
                    alert("支付超时，该订单已失效，请重新购买");
                    location.href="index.html";          
                } else {
                    alert(res.msg);
                }
            });
            
            
        }
    };
    let ms = countdown(starttime,15);
    let timer = setInterval(timerFunc,0); //定时器
    //获取影院名称/影厅名称
    function getHall(){
        return new Promise((resolve,rejected)=>{
            ajax({
                type:'get',
                url:'data/cinemas/seats.php',
                data:{cid},
                dataType:'json'
            }).then((res)=>{
                //console.log(res);
                showtime = getTime(res.date);
                showdate = getDate(res.date,true);
                hall.hallname = res.hall;
                hall.hid = res.hid;
                ({date} = res);
                mcname = res.mcname;
                resolve();
            });
        });
    }
    // 获取电影信息
    function getMovieInfo(){
        return new Promise((resolve,rejected)=> {
            ajax({
                type: 'get',
                url: 'data/movie/getInfo.php',
                data: {mid},
                dataType: 'json'
            }).then((res) => {
                if (res.code > 0) {
                    duration = res.data.info.duration;
                    mname = res.data.info.mname;
                    resolve();
                }
            });
        });
    }
    // 获取座位信息
    function getTicketDetails(){
        let all = Promise.all([getHall(),getMovieInfo()]);
        all.then((res)=>{
            let html = "";
            for(let ticket of seatsArr) {
                let row = ticket.split("_")[0];
                let column = ticket.split("_")[1];
                html+=`
                <tr>
                    <td>《${mname}》</td>
                    <td class="date">今天 ${showdate} ${showtime}</td>
                    <td>${mcname}</td>
                    <td><span>${hall.hallname}</span>&nbsp;<span>${row}排${column}座</span></td>
                </tr>
                `;
            }
            tbodydiv.innerHTML = html;
            if(userpay.className.indexOf('active')==-1) {
                userpay.className+=" active";
            }
            submitTicketInfo();
        });
    }
    getTicketDetails();

    userpay.addEventListener('click',function(e){
        e.preventDefault();
        if(this.className.indexOf('active')!==-1) {
            location.href=`weixinpay.html?cid=${cid}&ordernum=${sessionStorage.getItem("ordername").split('_')[0]}`;
        }
    },false);
    // 将当前订单提交到数据库，会返回一个订单号
    function submitTicketInfo(){  
        ajax({
            type:'get',
            url:'data/cart/payment.php',
            data:{uid,cid,mid,seatsArr,hid:hall.hid,date},
            dataType:"json"
        }).then((res)=>{
            if(res.code>0) {
                // ordernum = res.ordernum;
                //保存住这个订单号
                sessionStorage.setItem("ordername",`${res.ordernum}_${starttime}`);
            } else {
                //如果当前订单已经存在则不要重新创建一个ordernum了
                // errormsg.innerHTML = res.msg;
            }
        });
    }
    
    //当页面关闭或重新刷新时
    // window.onbeforeunload = function(){
    // }
})();