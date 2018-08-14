"use strict";
function querystring(url){
    let urlArr = url.slice(1).split("&");
    let urlObj = {};
    for(let item of urlArr) {
        let key = item.split("=")[0];
        let value = item.split("=")[1];
        urlObj[key] = value;
    }
    return urlObj;
}

function splitSeat(seatsArr){

}