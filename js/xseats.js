(()=>{
    "use strict";
    let uid = sessionStorage.getItem('uid');
    let cid = querystring(location.search).cid;
    let mid = querystring(location.search).mid;
    let seatstats = document.querySelector(".seats");
    let details = document.querySelector(".movie-details");
    let minfo = document.querySelector(".movie-info");
    let tipspan = document.querySelector(".tipspan");
    let ticketbox = document.querySelector('.ticket-box');
    let tips = document.querySelector(".seatselect .tips");
    let totalprice = document.querySelector(".total-price .price");
    let submitbtn = document.querySelector(".textc a");
    let price;
    let seatArr = [];
    let selectCount = 0;
    let selectseats = "";
    // 获取当前座位信息
    function getSeats(){
        ajax({
            type:'get',
            url:'data/cinemas/seats.php',
            data:{cid},
            dataType:'json'
        }).then((res)=>{
            // console.log(res);
            let {cid,hid,lang,mcname,hall,mcid} = res;
            price = res.price;
            let time = getTime(res.date);
            let date = getDate(res.date,true);
            seatArr = res.seats.split(",");
            let html = `
                <li><span>影院：</span><span>${mcname}</span></li>
                <li><span>影厅：</span><span class="myhall">${hall}</span></li>
                <li><span>版本：</span><span>${lang}</span></li>
                <li><span>场次：</span><span>今天${date} ${time}</span></li>
                <li><span>票价：</span><span>￥${price}/张</span></li>
            `;
            let seatsArr  = [];
            for(let i=0;i<seatArr.length;i+=12) {
                seatsArr.push([seatArr[i],seatArr[i+1],seatArr[i+2],seatArr[i+3],seatArr[i+4],seatArr[i+5],
                    seatArr[i+6],seatArr[i+7],seatArr[i+8],seatArr[i+9],seatArr[i+10],seatArr[i+11]]);
            }
            for(let i=0;i<seatsArr.length;i++) {
                for(let j=0;j<seatsArr[i].length;j++) {
                    //i 6排   j:12列
                    if(seatsArr[i][j]==0) {
                        seatstats.children[i].children[11-j].className = "col-x-1";
                    } else {
                        seatstats.children[i].children[11-j].className = "col-x-1 selectedseat";
                    }
                }
            }
            details.innerHTML = html;
        });
    }

    //获取当前电影信息
    function getMovieInfo(){
        ajax({
            type:'get',
            url:'data/movie/getInfo.php',
            data:{mid},
            dataType:'json'
        }).then((res)=>{
            if(res.code>0) {
                let tid = res.data.tid;
                let {poster,duration,mname} = res.data.info;
                //console.log(res);
                let html = `<div class="img-box lf"><img src="${poster}" alt=""></div>
                <div class="info">
                    <h2>${mname}</h2>
                    <ul class="mt15">
                        <li><span>类型：</span><span>${tid}</span></li>
                        <li><span>时长：</span><span>${duration}分钟</span></li>
                    </ul>
                </div>`;
                minfo.innerHTML = html;
            }
        });
    }

    //点击座位进行选座
    seatstats.addEventListener('click',function(e){
        let cur = e.target;
        if(cur.className.indexOf('col-x-1')!==-1) {
            let row = cur.dataset.rowId;
            let column = cur.dataset.columnId;
            //console.log(row,column);
            if(cur.className.indexOf('selectedseat')==-1) {
                //如果当前座位未被他人占用
                if(cur.className.indexOf('willselect')==-1) {
                    if(selectCount<5) {
                        seatArr[(row-1)*12+column-1] = 1;
                        cur.className = "col-x-1 willselect";
                        selectCount++;
                        if(tipspan.className.indexOf("hide")==-1) {
                            tipspan.className = "tipspan hide";
                            tips.className= "tips mt30 hide";
                        }
                        if(submitbtn.className.indexOf('active')==-1) {
                            submitbtn.className = "active";
                        }
                        ticketbox.innerHTML += `<div class="ticket" data-no="${row}-${column}">
                            <p><span class="myrows">${row}</span>排<span class="mycolumns">${column}</span>座</p>
                        </div>`;
                    } else {
                        //提醒用户不能超过5个
                        alert("最多只能选择5个座位~");
                    }
                } else {
                    seatArr[(row-1)*12+column-1] = 0;
                    cur.className = "col-x-1";
                    selectCount--;
                    let curticket = ticketbox.querySelector(`[data-no='${row}-${column}']`);
                    ticketbox.removeChild(curticket);
                    if(selectCount==0) {
                        submitbtn.className = "";
                        if(tipspan.className.indexOf("hide")!==-1) {
                            tipspan.className = "tipspan";
                            tips.className= "tips mt30";
                        }
                    }
                }
                totalprice.innerHTML = selectCount*price;
            }
        }
    },false);
    //异步操作
    getSeats();
    getMovieInfo();

    submitbtn.addEventListener('click',function(e){
        e.preventDefault();
        if(selectCount!=0) {
            console.log("当前uid为",uid);
            if(!uid) {
                location.href="login.html";
            } else {
                // 如果已选座的话按钮可以点击，跳转到支付页面
                let tickets = ticketbox.querySelectorAll('.ticket');
                //这是一个类数组对象
                for(let seat of tickets) {
                    let row = seat.querySelector(".myrows").innerHTML;
                    let column = seat.querySelector(".mycolumns").innerHTML;
                    selectseats+=`${row}_${column},`;
                }
                selectseats = encodeURI(selectseats.slice(0,selectseats.length-1));
                location.href=`payment.html?p=${selectCount*price}&seats=${selectseats}&cid=${cid}&mid=${mid}`;
            }
        }
    },false)

})();