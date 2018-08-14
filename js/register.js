(()=>{
    "use strict";
    let formElem = document.querySelector('.my-form');
    let unameElem = document.querySelector('.my-form .uname-input');
    let pwdElem = document.querySelector('.my-form .pwd-input');
    let repwdElem = document.querySelector('.my-form .repwd-input');
    let submitBtn = document.querySelector('.submit-btn');

    focusEvent(unameElem,"focus","uname","请输入数字、字母、下划线，5-9个中文或英文字符字符");
    focusEvent(pwdElem,"focus","upwd","请输入数字、字母、下划线，6-12个字符");
    focusEvent(repwdElem,"focus","repwd","");
    let reg1 = /^[\w\u4e00-\u9fa5]+$/;
    let reg2 = /^[\w]+$/;
    let nameReg = /^[\w\u4e00-\u9fa5]{5,9}$/;
    let pwdReg = /^[\w]{6,12}$/;
    function unameFun(){
        let p = this.parentNode.nextElementSibling;
        if(this.value!=="") {
            if(!nameReg.test(this.value)) {
                p.className="error-msg";
                if(this.parentNode.className.indexOf("error")==-1) {
                    this.parentNode.className+=" error";
                }
                if(!reg1.test(this.value)) {
                    console.log(this.value);
                    p.innerHTML = "用户名不能包含特殊字符";
                } else if(this.value.length<5){
                    p.innerHTML = "用户名不能少于5个字符";
                } else if(this.value.length>9){
                    p.innerHTML = "用户名不能大于9个字符";
                }
                return false;
            }  else {
                this.parentNode.className = "uname";
                p.className="ok-msg";
                p.innerHTML = "";
                return true;
            }
        } else {
            p.className="error-msg";
            if(this.parentNode.className.indexOf("error")==-1) {
                this.parentNode.className+=" error";
            }
            p.innerHTML = "用户名不能为空";
            return false;
        }
    }
    function pwdFun(){
        let p = this.parentNode.nextElementSibling;
        if(this.value!=="") {
            if(!pwdReg.test(this.value)) {
                p.className="error-msg";
                if(this.parentNode.className.indexOf("error")==-1) {
                    this.parentNode.className+=" error";
                }
                if(!reg2.test(this.value)) {
                    p.innerHTML = "密码不能包含特殊字符";
                } else if(this.value.length<5){
                    p.innerHTML = "密码不能少于6个字符";
                } else if(this.value.length>9){
                    p.innerHTML = "密码不能大于12个字符";
                }
                return false;
            }  else {
                this.parentNode.className = "upwd";
                p.className="ok-msg";
                p.innerHTML = "";
                return true;
            }
        } else {
            p.className="error-msg";
            if(this.parentNode.className.indexOf("error")==-1) {
                this.parentNode.className+=" error";
            }
            p.innerHTML = "密码不能为空";
            return false;
        }

    }
    function repwdFun() {
        let p = this.parentNode.nextElementSibling;
        if(this.value!==pwdElem.value) {
            if(this.parentNode.className.indexOf("error")==-1) {
                this.parentNode.className+=" error";
            }
            p.className="error-msg";
            p.innerHTML = "密码不一致";
            return false;
        } else {
            this.parentNode.className = "repwd";
            p.className="ok-msg";
            p.innerHTML = "";
            return true;
        }
    }
    unameElem.addEventListener("blur",unameFun);
    pwdElem.addEventListener("blur",pwdFun);
    repwdElem.addEventListener("blur",repwdFun);

    function focusEvent(el,ev,cname,content) {
        el.addEventListener(ev,function(){
            this.parentNode.className = cname;
            this.parentNode.nextElementSibling.className="info-msg";
            this.parentNode.nextElementSibling.innerHTML = content;
        });
    }
    //点击注册按钮时，查看是否所有表单内容都符合要求

    submitBtn.onclick=function(e){
        e.preventDefault();
        //在第一次提交表单后就禁用提交按钮
        //利用onsubmit事件处理程序取消后续表单提交操作
        // console.log("触发submit事件");
        let that = this;
        let u = unameFun.call(unameElem);
        let p = pwdFun.call(pwdElem);
        let r = repwdFun.call(repwdElem);
        let uname = unameElem.value;
        let upwd = pwdElem.value;
        if(u && p && r) {
            //提交表单
            ajax({
                type:"get",
                url:"data/register.php",
                data:{uname, upwd},
                dataType:"json"
            }).then((res)=>{
                // console.log(res);
                if(res.code>0) {
                    //插入成功，跳转到登录页
                    location.href="login.html";
                } else {
                    unameElem.parentNode.nextElementSibling.className="error-msg";
                    unameElem.parentNode.nextElementSibling.innerHTML = res.msg;
                }
            });
            // method="post" action="data/login.php"
        }
        that.disabled = true;
        setTimeout(function(){
            that.disabled=false;
        },2000);
    }

})();