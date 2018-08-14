<?php
header("Content-Type:application/json;charset=utf-8");

//想看/不想看特定电影   echo json_encode(["code"=>1,"msg"=>"..."]);
function getFav(){
    require_once('init.php');
    //获取当前uid，访问favorite表
    @$uid = $_REQUEST['uid'];
    @$mid = $_REQUEST['mid'];
    if(!$uid || !$mid) {
        die("您还没有登陆");
    }
    $reg = "/^\d+$/";
    if(!preg_match($reg,$uid) ||  !preg_match($reg,$mid)) {
        die("参数格式不正确");
    }
    $sql = "SELECT COUNT(*) AS c FROM favorite WHERE mid=$mid AND uid=$uid";
    $re = mysqli_query($conn,$sql);
    if($re === false) {
        echo "您的sql语法有误";
    } else {
        $row = mysqli_fetch_assoc($re)["c"];
        if($row) {
            echo json_encode(["code"=>1,"msg"=>"用户选中了'想看'按钮"]);
        } else {
            echo json_encode(["code"=>-1,"msg"=>"用户没有选中'想看'按钮"]);
        }
    }
}

function changeFav(){
    require_once('init.php');
    //获取当前uid，访问favorite表
    //fid为0时添加一条数据，否则删除一条数据
    @$fid = $_REQUEST['fid'];
    @$uid = $_REQUEST['uid'];
    @$mid = $_REQUEST['mid'];
    if($fid==1) {
        // 删除那条数据
        //= echo "i want delete one data,because i dont like";
    $sql = "DELETE FROM favorite WHERE uid=$uid AND mid=$mid"; 
    } else {
        // 添加一条数据
        $sql = "INSERT INTO favorite(uid,mid) VALUES($uid,$mid)";
    }
    $re = mysqli_query($conn,$sql);
    if($re === false) {
        echo "您的sql语法有误";
    } else {
        $rows = mysqli_affected_rows($conn);
        if($rows) {
        $count;
            //获取当前电影的fav数 保存到movie的fav字段中
            $sql = "SELECT COUNT(*) as c FROM favorite WHERE mid=$mid";
            $re = mysqli_query($conn,$sql);
            if(!$re) {
                echo "sql语法错误，请检查8";
            } else {
                $row = mysqli_fetch_assoc($re);
                if($row) {
                    $count = $row["c"];
                    $sql = "UPDATE movie SET fav=$count WHERE mid=$mid";
                    $re = mysqli_query($conn,$sql);
                    if(!$re) {
                        echo "sql语法错误，请检查7";
                    }
                }
            }
            echo json_encode(["code"=>1,"msg"=>"成功".$count]);
        } else {
            echo json_encode(["code"=>-1,"msg"=>"失败"]);
        }
    }
}
function getComment() {
    require_once('init.php');
    @$uid = $_REQUEST['uid'];
    @$mid = $_REQUEST['mid'];
    $sql2 = "SELECT COUNT(*) AS c FROM comment WHERE mid=$mid";
    $re2 = mysqli_query($conn,$sql2);
    if(!$re2) {
        echo "您的sql语法有误2";
    } else {
    //得到cid,score,comment,count
        $rows = mysqli_fetch_assoc($re2)["c"];
        if($rows && $uid!==null) {
            $sql = "SELECT cid,score,comment FROM comment WHERE uid=$uid AND mid=$mid";
            $re = mysqli_query($conn,$sql);
            if(!$re) {
                echo "您的sql语法有误1";
                return;
            } else {
                $row = mysqli_fetch_assoc($re);
                if($row) {
                    $res = ["code"=>1,"data"=>["data"=>$row,'count'=>$rows]];
                    echo json_encode($res);
                    return;
                } else {
                    echo json_encode(["code"=>1,"data"=>["count"=>$rows]]);
                }
            }
        } else if($rows) {
            echo json_encode(["code"=>1,"data"=>["count"=>$rows]]);
        } else {
            echo json_encode(["code"=>-1,"msg"=>"无人评价此电影"]);
        }
    }
}
function addComment(){
    //对每部电影只能有一个评价，如果第二次评价会覆盖上一次评价
    //只要评论添加成功就重新计算当前平均分
    require_once('init.php');
    @$cid = $_REQUEST['cid'];
    @$uid = $_REQUEST['uid'];
    @$mid = $_REQUEST['mid'];
    @$score = $_REQUEST['score'];
    @$comment = $_REQUEST['comment'];
    if($cid>=0) {
        //更新评论
        $sql = "UPDATE comment SET comment='$comment', score=$score WHERE cid=$cid";
        $re = mysqli_query($conn,$sql);
            if($re === false) {
                echo "您的sql语法有误2";
            } else {
                $rows = mysqli_affected_rows($conn);
                if($rows) {
                    //算出平均评分
                    //根据comment表进行评分排序
                    $sql = "SELECT AVG(score) as avg FROM comment WHERE mid=$mid";
                    $re = mysqli_query($conn,$sql);
                    if($re === false) {
                        echo "您的sql语法有误4";
                    } else {
                        $avg = mysqli_fetch_assoc($re)["avg"]+1;
                        $sql = "UPDATE movie SET scoreavg=$avg WHERE mid=$mid";
                        $re = mysqli_query($conn,$sql);
                        if($re === false) {
                            echo "您的sql语法有误5";
                        } else {
                            $rows = mysqli_affected_rows($conn);
                            if(!$rows) {
                                echo "movie表的score没有更新";
                            }
                        }
                    }
                    echo json_encode(["code"=>1,"msg"=>"评论更新成功"]);
                } else {
                    echo json_encode(["code"=>-1,"msg"=>"评论更新失败"]);
                }
            }
    } else {
        //插入评论
        $sql = "INSERT INTO comment(uid,mid,score,comment) VALUES($uid,$mid,$score,'$comment')";
            $re = mysqli_query($conn,$sql);
            if($re === false) {
                echo "您的sql语法有误3";
            } else {
                $rows = mysqli_affected_rows($conn);
                if($rows) {
                    // 插入评论成功后
                    $sql = "SELECT AVG(score) as avg FROM comment WHERE mid=$mid";
                    $re = mysqli_query($conn,$sql);
                    if($re === false) {
                        echo "您的sql语法有误4";
                    } else {
                        $avg = mysqli_fetch_assoc($re)["avg"]+1;
                        //echo $avg;
                        $sql = "UPDATE movie SET scoreavg=$avg WHERE mid=$mid";
                        $re = mysqli_query($conn,$sql);
                        if($re === false) {
                            echo "您的sql语法有误5";
                        } else {
                            $rows = mysqli_affected_rows($conn);
                            if(!$rows) {
                                echo "movie表的score没有更新";
                            }
                        }
                    }
                    echo json_encode(["code"=>1,"msg"=>"评论插入成功"]);
                } else {
                    echo json_encode(["code"=>-1,"msg"=>"评论插入失败"]);
                }
            }
    }
}
// function getMyOrder(){
//     require('init.php');
// }

function showMyOrders(){
    session_start();
    require('init.php'); 
    //根据订单号 uid 获取数据
    @$uid = $_REQUEST['uid'];
    if($uid && $uid==$_SESSION['uid']) {
        // 用户已登录
        $sql = "SELECT uid, hid, cid, mid, seat, rows, columns, ticketdate, buydate, status, ordernum FROM showing_movie_ticket WHERE uid=$uid order by buydate DESC";
        $re = mysqli_query($conn,$sql);
        if($re === false) {
            echo "您的sql语法有误";
        } else {
            $rows = mysqli_fetch_all($re,1);
            //返回一个二维数组 每个内层数组中都有hid mid cid
            $halls = [];
            $mcname = [];
            $movies = [];
            $price = [];
            foreach($rows as $item) {
                //拿到每一条数据
                $hid = $item["hid"];
                $mid = $item["mid"];
                $cid = $item['cid'];
                if(!array_key_exists($hid,$halls)) {
                    $sql1 = "SELECT hid, hall FROM hall WHERE hid=$hid";
                    $re1 = mysqli_query($conn,$sql1);
                    if($re1==false) {
                        echo "您的sql语句有误，请检查15 :)";
                        return;
                    } else {
                        $row1 = mysqli_fetch_assoc($re1);
                        if($row1>0){
                            $halls["$hid"] = $row1['hall'];
                        } else {
                            echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                            return;
                        }
                    }
                }
                if(!array_key_exists($mid,$movies)) {
                    $sql2 = "SELECT poster, mname FROM movie WHERE mid=$mid";
                    $re2 = mysqli_query($conn,$sql2);
                    if($re2==false) {
                        echo "您的sql语句有误，请检查15 :)";
                        return;
                    } else {
                        $row2 = mysqli_fetch_assoc($re2);
                        if($row2>0){
                            $movies["$mid"] = ["poster"=>$row2['poster'],"mname"=>$row2['mname']];  
                        } else {
                            echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                            return;
                        }
                    }
                }
                if(!array_key_exists($cid,$mcname)) {
                    $sql3 = "SELECT mcenter_name from moviecenter WHERE mcid=(SELECT mcid FROM cinema WHERE cid=$cid)";
                    $re3 = mysqli_query($conn,$sql3);
                    if($re3==false) {
                        echo "您的sql语句有误，请检查15 :)";
                        return;
                    } else {
                        $row3 = mysqli_fetch_assoc($re3);
                        if($row3>0){
                            $mcname["$cid"] = $row3['mcenter_name'];
                        } else {
                            echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                            return;
                        }
                    }
                }
                if(!array_key_exists($cid,$price)) {
                    $sql4 = "SELECT price FROM cinema WHERE cid=$cid";
                    $re4 = mysqli_query($conn,$sql4);
                    if($re3==false) {
                        echo "您的sql语句有误，请检查18 :)";
                        return;
                    } else {
                        $row4 = mysqli_fetch_assoc($re4);
                        if($row4>0){
                            $price["$cid"] = $row4['price'];
                        } else {
                            echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                            return;
                        }
                    }
                }
            }
            echo json_encode(["code"=>1,"data"=>$rows,"halls"=>$halls,"mcname"=>$mcname,"movies"=>$movies,"price"=>$price]);
        }
    }
}

function showOneOrder(){
    session_start();
    require('init.php'); 
    //根据订单号 uid 获取数据
    @$uid = $_REQUEST['uid'];
    @$ordernum = $_REQUEST['ordernum'];
    if($uid && $uid==$_SESSION['uid']) {
        // 用户已登录
        $sql = "SELECT uid, hid, cid, mid, seat, rows, columns, ticketdate, buydate, status, ordernum FROM showing_movie_ticket WHERE uid=$uid AND ordernum='$ordernum'";
        $re = mysqli_query($conn,$sql);
        if($re === false) {
            echo "您的sql语法有误";
        } else {
            $rows = mysqli_fetch_all($re,1);
            //返回一个二维数组 每个内层数组中都有hid mid cid
            $halls;
            $mcname;
            $movies;
            $price;
            $item = $rows[0];
            $hid = $item["hid"];
            $mid = $item["mid"];
            $cid = $item['cid'];
            $sql1 = "SELECT hid, hall FROM hall WHERE hid=$hid";
            $re1 = mysqli_query($conn,$sql1);
            if($re1==false) {
                echo "您的sql语句有误，请检查15 :)";
                return;
            } else {
                $row1 = mysqli_fetch_assoc($re1);
                if($row1>0){
                    $halls = $row1['hall'];
                } else {
                    echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                    return;
                }
            }

            $sql2 = "SELECT poster, mname FROM movie WHERE mid=$mid";
            $re2 = mysqli_query($conn,$sql2);
            if($re2==false) {
                echo "您的sql语句有误，请检查15 :)";
                return;
            } else {
                $row2 = mysqli_fetch_assoc($re2);
                if($row2>0){
                    $movies = ["poster"=>$row2['poster'],"mname"=>$row2['mname']];  
                } else {
                    echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                    return;
                }
            }
                
            $sql3 = "SELECT mcenter_name,mcid from moviecenter WHERE mcid=(SELECT mcid FROM cinema WHERE cid=$cid)";
            $re3 = mysqli_query($conn,$sql3);
            if($re3==false) {
                echo "您的sql语句有误，请检查15 :)";
                return;
            } else {
                $row3 = mysqli_fetch_assoc($re3);
                if($row3>0){
                    $mcname = ["mcenter_name"=>$row3['mcenter_name'],"mcid"=>$row3['mcid']]; 
                } else {
                    echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                    return;
                }
            }
               
            $sql4 = "SELECT price FROM cinema WHERE cid=$cid";
            $re4 = mysqli_query($conn,$sql4);
            if($re3==false) {
                echo "您的sql语句有误，请检查18 :)";
                return;
            } else {
                $row4 = mysqli_fetch_assoc($re4);
                if($row4>0){
                    $price = $row4['price'];
                } else {
                    echo json_encode(["code"=>-1,"msg"=>"未找到对应数据"]);
                    return;
                }
            }

            echo json_encode(["code"=>1,"data"=>$rows,"halls"=>$halls,"mcname"=>$mcname,"movies"=>$movies,"price"=>$price]);
        }
    }
}
?>
