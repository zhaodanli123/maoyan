(()=>{
    "use strict";
    let orderlist = document.querySelector(".order-list");
    let memory = {
        //"ordernum": {buydate,cid,columns,hid,mid,rows,seat,status,ticketdate,uid,hall,price_a,mcenter_name,poster,mname}
    };
    //获取当前登录用户
    let uid = sessionStorage.getItem('uid');
    let ordersession = sessionStorage.getItem("ordername");
    //当有未付款订单时，查看是否过期，过期则删除订单
    if(ordersession) {
        let starttime = ordersession.split('_')[1];
        let ordernum = ordersession.split('_')[0];
        if(Date.now()-starttime>=15*1000*60) {
            //删除该订单，并移除session
            ajax({
                type:"post",
                url:'data/cart/cancelTicket.php',
                data:{ordernum},
                dataType:'json'
            }).then((res)=>{
                if(res.code>0) {
                    sessionStorage.removeItem("ordername");
                } else {
                    // alert(res.msg);
                }
            });
        }
    }
    function showMyOrders(){
        ajax({
            type:'get',
            url:'data/user/showMyOrders.php',
            data:{uid},
            dataType:"json"
        }).then((res)=>{
            if(res.code>0){
                let {data,halls,mcname,movies,price} = res;
                //console.log(halls,mcname,movies,price);
                //如果订单号相同,就放在一起,只需要保存其seat
                for(let item of data) {
                    let {buydate,cid,columns,hid,mid,ordernum,rows,seat,status,ticketdate,uid} = item;
                    let hall = halls[hid];
                    let {poster,mname} = movies[mid];
                    let mcenter_name = mcname[cid];
                    let price_a = price[cid];
                    if(memory[ordernum]) {
                        //只保存其seat到拼接到字符串中
                        memory[ordernum].seat+=`,${seat}`;
                    } else {
                        //将信息存入memory中
                        memory[ordernum] = {buydate,cid,columns,hid,mid,rows,seat,status,ticketdate,uid,hall,price_a,mcenter_name,poster,mname};
                    }
                }
                //console.log(memory);
                myorder();
                
                
            } else {
                console.log(msg);
            }
        });
    }

    function myorder(){
        let html = "";
        for(let ordernum in memory) {
            let {buydate,cid,columns,hid,mid,rows,seat,status,ticketdate,uid,hall,price_a,mcenter_name,poster,mname} = memory[ordernum];
            let date = getDate(buydate);
            // seat 将作为拆分成数组
            let seatArr = seat.split(",");
            let week = getDay(ticketdate);
            let ticketd = getDate(ticketdate,true);
            let time = getTime(ticketdate);
            html+=`<li>
                <header>
                    <span class="date">${date}</span>
                    <span class="no">猫眼订单号:${ordernum}</span>
                    <a href="#" class="trash"></a>
                </header>
                <table class="main border-box">
                    <tbody >
                    <tr>
                        <td class="poster"><img src="${poster}" alt=""></td>
                        <td class="details">
                            <p class="name">《${mname}》</p>
                            <p>${mcenter_name}</p>
                            <p>${hall} `;
            for(let item of seatArr) {
                let row = item.split("_")[0];
                let column = item.split("_")[1];
                html+=`${row}排${column}座 `;
            }
            html+=`</p>
                            <p class="date">${week} ${ticketd} ${time}</p>
                        </td>
                        <td>
                            ￥<span>${price_a*seatArr.length}</span>
                        </td>
                        <td>${status == 1 ? '已完成': '待付款'}</td>
                        <td class="pay">
                            <a href="orderdetail.html?ordernum=${ordernum}&status=${status}" class="pay-btn inline-block ${status == 1 ? 'hide' : ''}">付款</a>
                            <a href="orderdetail.html?ordernum=${ordernum}&status=${status}" class="more inline-block ${status == 1 ? '' : 'hide'}">查看详情</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </li>`;
        }
        orderlist.innerHTML = html;

    }

    showMyOrders();
})();

Object
