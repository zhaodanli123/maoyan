(()=>{
    "use strict";
    //status为1 是已完成
    let uid = sessionStorage.getItem('uid');
    let ordernum=querystring(location.search).ordernum;
    let status=querystring(location.search).status;
    //console.log(ordernum,status);
    let doneinfo= document.querySelector(".container .done-info");
    let waitpay = document.querySelector(".container .count-down");
    let minutes = document.querySelector(".time-left .minutes");
    let seconds = document.querySelector(".time-left .seconds");
    let ordersession = sessionStorage.getItem("ordername");
    let mytbody = document.querySelector(".ticket-info .mytbody");
    let curordernum = document.querySelector(".ordernum");
    let mcinfo = document.querySelector(".other-info .mc-info");
    let totalprice = document.querySelector(".price");
    let userpay = document.querySelector(".userpay");
    let cid;
    if(status==0) {
        //未完成
        if(doneinfo.className.indexOf('hide')==-1) {
            doneinfo.className += " hide";
        }
        waitpay.className  = "count-down";
        let starttime = ordersession ? ordersession.split("_")[1] : Date.now();
        let timerFunc = function(){
            let time = ms();
            minutes.innerHTML = time.minutes;
            seconds.innerHTML = time.seconds;
            if(time.minutes<=0 && time.seconds<=0) {
                clearInterval(timer);
                //如果当前执行完了，弹出一个模态框，告知其已放弃支付
                //删除showing_movie_ticket表中的数据
                ajax({
                    type:"post",
                    url:'data/cart/cancelTicket.php',
                    data:{ordernum},
                    dataType:'json'
                }).then((res)=>{
                    if(res.code>0) {
                        sessionStorage.removeItem(`${ordername}`);
                        alert("支付超时，该订单已失效，请重新购买");
                        location.href="myorder.html";          
                    } else {
                        alert(res.msg);
                    }
                });
            }
        };
        let ms = countdown(starttime,15);
        let timer = setInterval(timerFunc,0); //定时器
    } else {
        if(waitpay.className.indexOf('hide')==-1) {
            waitpay.className += " hide";
        }
        if(userpay.className.indexOf('hide')==-1) {
            userpay.className += " hide";
        }
        doneinfo.className  = "done-info";
        
    }
    function getInfo(){
        ajax({
            type:'get',
            url:'data/user/showOneOrder.php',
            data:{uid,ordernum},
            dataType:'json'
        }).then((res)=>{
            // console.log(res);
            let {data,halls,mcname:{mcenter_name,mcid},movies:{mname,poster},price} = res;
            let {ordernum,ticketdate}= data[0];
            cid = data[0].cid;
            getMC(mcid);
            // let week = getDay(ticketdate);
            let ticketd = getDate(ticketdate,true);
            let time = getTime(ticketdate);
            let html = "";
            for(let item of data) {
                let {rows,columns} = item;
                html+=`<tr>
                <td>《${mname}》</td>
                <td class="date">${ticketd} ${time}</td>
                <td>${mcenter_name}</td>
                <td>
                    <span>${halls}</span><span>${rows}排${columns}座</span>
                </td>
                </tr>`;
            }
            mytbody.innerHTML = html;
            totalprice.innerHTML = price*data.length;
            curordernum.innerHTML = ordernum;
            if(status==0) {
                if(userpay.className.indexOf('active')==-1) {
                    userpay.className+=" active";
                }
            }
        });
    }
    function getMC(mcid){
        ajax({
            type:'get',
            url:'data/cinemas/getMC.php',
            data:{mcid},
            dataType:'json'
        }).then((res)=>{
            //console.log(res);
            let {mcenter_name,address,tel} = res;
            let html = `<h3>${mcenter_name}</h3>
            <p>地址：${address}</p>
            <p>电话：${tel}</p>`;
            mcinfo.innerHTML = html;
        });
    }
    getInfo();

    userpay.addEventListener('click',function(e){
        e.preventDefault();
        if(this.className.indexOf('active')!==-1) {
            location.href=`weixinpay.html?cid=${cid}&ordernum=${ordernum}`;
        }
    },false);
})();

