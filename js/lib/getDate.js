"use strict";
// 有参数2 表示显示方式为 x月x日
function getDate(showtime,status,isNum){
    let date = new Date(parseInt(showtime));
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    if(status && !isNum) {
            return `${m}月${d}日`;
    }
    m = parseInt(m) < 10 ? "0"+m : m; 
    d = parseInt(d) < 10 ? "0"+d : d;
    if(isNum) {
        return new Date(`${y}-${m}-${d} 00:00:00`).getTime();
    }
    return `${y}-${m}-${d}`;
}
function getDay(showtime){
    let date = new Date(parseInt(showtime));
    let day = date.getDay();
    switch (day){
        case 0:
            day = "周日";
            break;
        case 1:
            day = "周一";
            break;
        case 2:
            day = "周二";
            break;
        case 3:
            day = "周三";
            break;
        case 4:
            day = "周四";
            break;
        case 5:
            day = "周五";
            break;
        case 6:
            day = "周六";
            break;
    }
    return day;
}
function getTime(time){
    let date = new Date(parseInt(time));
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours<10 ? "0"+hours : hours;
    minutes = minutes<10 ? "0"+minutes : minutes;
    return hours+":"+minutes;
}
