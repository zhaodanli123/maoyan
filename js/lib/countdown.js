function countdown(starttime,totaltime){
    //以秒为单位倒计时
    // let starttime = new Date();  //被保护的变量
    return function(){
        let endtime = new Date();
        let dvalue = totaltime*60*1000-(endtime-starttime);
        let minutes = (dvalue/1000/60)|0;
        let seconds = (dvalue/1000%60)|0;
        minutes<10?minutes="0"+minutes:minutes;
        seconds<10?seconds="0"+seconds:seconds;
        return {minutes,seconds};
    }
}