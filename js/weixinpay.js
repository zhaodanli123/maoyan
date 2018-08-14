(()=>{
    "use strict";
    let ordernum = querystring(location.search).ordernum;
    let cid = querystring(location.search).cid;
    let aleadypay = document.querySelector(".aleadypay");
    let notpay = document.querySelector(".notpay");
    aleadypay.addEventListener('click',function(){
        // 将show_movie_ticket表中的status转为1
        //将cinema表中的seats字段进行变更
        ajax({
            type:'post',
            url:'data/cart/buyTicket.php',
            data:{ordernum,cid},
            dataType:"json"
        }).then((res)=>{
            if(res.code>0) {
                sessionStorage.removeItem("ordername");
                location.href="ecode.html";
            } else {
                alert(res.msg);
            }
        });
    },false);
    notpay.addEventListener('click',function(){
        //将show_movie_ticket表中的数据删除。
        ajax({
            type:"post",
            url:'data/cart/cancelTicket.php',
            data:{ordernum},
            dataType:'json'
        }).then((res)=>{
            //console.log(res);
            if(res.code>0) {
                location.href="index.html";
            } else {
                alert(res.msg);
            }
        });
    },false);
})();
