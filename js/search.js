(()=>{
    let kw = decodeURI(querystring(location.search).kw);
    let movieitem = document.querySelector(".movie-item");
    let notfound = document.querySelector(".not-found");
    //发送sql语句，请求结果
    //
    let searchinput = document.querySelector('.search-input');
    let searchbox = document.querySelector('.search-box');
    searchinput.value = kw;
    searchbox.addEventListener('submit',e=>{
        e.preventDefault();
        kw = searchinput.value;
        getRes();
    });
    function getRes(){
        ajax({
            type:'get',
            url:'data/movie/matchmovies.php',
            data:{kw},
            dataType:'json'
        }).then(res=>{
            if(res.code>0) {   
                let html = "";
                for(let item of res.data) {
                    let {mid,mname,poster,showtime,scoreavg,lname} = item;
                    let date = getDate(showtime);
                    html+=`<div class="col-x-6 mt30">
                    <img  class="movie-poster" src="${poster}" alt="">
                    <div class="movie-desc">
                        <h1 class="title">${mname}</h1>
                        <span class="score">${scoreavg}</span>
                        <span class="movie-item-cat">纪录片</span>
                        <span class="movie-item-pub">${date}${lname}上映</span>
                    </div>
                    </div>`;
                }
                if(movieitem.className.indexOf('hide')!==-1) {
                    movieitem.className="movie-item";
                    notfound.className += " hide";
                } 
                movieitem.innerHTML = html;
            } else {
                console.log(1232);
                if(movieitem.className.indexOf('hide')==-1) {
                    movieitem.className+=" hide";
                    notfound.className = "not-found";
                } 
            }
        });
    }
    getRes();
})();