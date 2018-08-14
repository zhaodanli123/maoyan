<?php
//所有有关movie的功能都写在movie.php中
//获取最近8个热映电影
require_once("init.php");
function blockbusters(){
    // require_once("init.php");
    global $conn;
    $now = time()*1000;  //获取当前时间
    // 根据票房进行排序
    $sql = "SELECT mid,mname,poster,scoreavg FROM movie WHERE endtime>$now AND showtime<$now ORDER BY ticket DESC LIMIT 0,8";
    //echo $sql."<br />";
    $res = mysqli_query($conn,$sql);
    if($res==false) {
        die("您的sql语法有误，请检查");
    } else {
        $row = mysqli_fetch_all($res,1);
        if($row) {
            $result = json_encode($row);
            echo $result;
        } else {
            echo "没有数据";
        }
    }
}
function getAllBlockbusters(){
    global $conn;
    $now = time()*1000;  //获取当前时间
    // 根据票房进行排序
    $sql = "SELECT mid,mname,poster,scoreavg FROM movie WHERE endtime>$now AND showtime<$now ORDER BY ticket DESC";
    //echo $sql."<br />";
    $res = mysqli_query($conn,$sql);
    if($res==false) {
        die("您的sql语法有误，请检查");
    } else {
        $row = mysqli_fetch_all($res,1);
        if($row) {
            echo json_encode(["code"=>1,"data"=>$row]);
        } else {
            echo "没有数据";
        }
    }
}
//得到最新的4个banner图
function getBanner(){
    global $conn;
    $sql = "SELECT * FROM banner ORDER BY bid DESC LIMIT 0,4";
    $res = mysqli_query($conn,$sql);
    if($res==false) {
        echo "您输入的sql语句有误,请检查";
    } else {
        $row = mysqli_fetch_all($res,1);
        echo json_encode($row);
    }
}
//得到当前电影的全部信息
function getInfo(){
    global $conn;
    @$mid = $_REQUEST["mid"];
    $sql = "SELECT * FROM movie WHERE mid=$mid";
    //echo $sql;
    $res = mysqli_query($conn,$sql);
    if($res===false) {
        die("您的sql语句有误，请检查");
    } else {
        $row = mysqli_fetch_assoc($res);
        if($row) {
            //从movietype数据库中得到对应的tid 拼成字符串传给前端

            $arr = explode(',',$row["tid"]);
            $length = count($arr);
            //echo $arr[$length-1];

            $sql = "SELECT tname FROM movietype WHERE ";
            for($i=0;$i<$length-1;$i++) {
                 $sql .= "tid=$arr[$i] OR ";
            }
            $sql .="tid=".$arr[$length-1];
            //echo $sql;
            $res = mysqli_query($conn,$sql);
            if($res===false) {
                die("您的sql语句有误，请检查");
            } else {
                $row2 = mysqli_fetch_all($res);
                $arr = [];
                for($i=0;$i<count($row2);$i++) {
                    $arr[] = $row2[$i][0];
                }
                //var_dump($arr);
                //将数组
                $tid = implode(",",$arr);
                //echo $tid;
                //$obj = ["code"=>1,"data"=>["info"=>$row,"tid"=>$tid]];
                //echo json_encode($obj);            
            }

            //从location数据表中得到对应的lid 拼成字符串传给前端
            $arr = explode(',',$row["location"]);
            $length = count($arr);
            //echo $arr[$length-1];

            $sql = "SELECT location FROM location WHERE ";
            for($i=0;$i<$length-1;$i++) {
                 $sql .= "lid=$arr[$i] OR ";
            }
            $sql .="lid=".$arr[$length-1];
            // echo $sql;
            $res = mysqli_query($conn,$sql);
            if($res===false) {
                die("您的sql语句有误，请检查2");
            } else {
                $row3 = mysqli_fetch_all($res);
                $arr = [];
                for($i=0;$i<count($row3);$i++) {
                    $arr[] = $row3[$i][0];
                }
                //var_dump($arr);
                //将数组
                $lid = implode(",",$arr);
                // echo $lid;
                $obj = ["code"=>1,"data"=>["info"=>$row,"tid"=>$tid,"location"=>$lid]];
                echo json_encode($obj);            
            }
        } else {
            echo '{"code"=>0,"msg"=>"无数据返回"}';
        }
    }
}
//即将上映的8个电影
function willShow(){
    //根据movie表中的showtime进行判断，根据根据showtime进行排序
    global $conn;
     $now = time()*1000;  //获取当前时间
     $sql = "SELECT mid, mname, poster, ename, fav, showtime FROM movie WHERE showtime>$now ORDER BY showtime ASC LIMIT 0,8";
     //echo $sql;
     $re = mysqli_query($conn,$sql);
     if($re==false) {
         die("您的sql语法有误,请检查");
     } else {
         $rows = mysqli_fetch_all($re,1);
         echo json_encode($rows);
     }
}

//即将上映的全部电影
function getAllWillShow(){
    //根据movie表中的showtime进行判断，根据根据showtime进行排序
    global $conn;
     $now = time()*1000;  //获取当前时间
     $sql = "SELECT mid, mname, poster, ename, fav, showtime FROM movie WHERE showtime>$now ORDER BY showtime ASC";
     //echo $sql;
     $re = mysqli_query($conn,$sql);
     if($re==false) {
         die("您的sql语法有误,请检查");
     } else {
         $rows = mysqli_fetch_all($re,1);
         echo json_encode(["code"=>1,"data"=>$rows]);
     }
}
// 最受期待的10个电影
function topExpect(){
    //根据movie表中的showtime进行判断,根据想看数量进行排序
    global $conn;
     $now = time()*1000;  //获取当前时间
     $sql = "SELECT mid, mname, poster, fav, showtime FROM movie WHERE showtime>$now ORDER BY fav DESC LIMIT 0,10";
     //echo $sql;
     $re = mysqli_query($conn,$sql);
     if($re==false) {
         die("您的sql语法有误,请检查");
     } else {
         $rows = mysqli_fetch_all($re,1);
         echo json_encode($rows);
     }
}
// 热播电影 10个
function hotView(){
    // 根据 评分高->低进行排序
    global $conn;
    $sql = "SELECT mid, mname, poster, ename, scoreavg FROM movie ORDER BY scoreavg DESC LIMIT 0,10";
    $re = mysqli_query($conn,$sql);
    if($re === false) {
        echo "您的sql语句有误，请检查11";
    } else {
        $rows = mysqli_fetch_all($re,1);
            echo json_encode($rows);
    }
}

// 电影 ——> 类型
function getAllType(){
    global $conn;
    $sql = "SELECT tid, tname FROM movietype";
    $re = mysqli_query($conn,$sql);
    if($re==false) {
        echo "您的sql语句有误，请检查12 :)";
    } else {
        $rows = mysqli_fetch_all($re,1);
        echo json_encode($rows);
    }
}
// 电影 ——> 区域
function getAllArea(){
    global $conn;
    $sql = "SELECT lid, location FROM location";
    $re = mysqli_query($conn,$sql);
    if($re==false) {
        echo "您的sql语句有误，请检查13 :)";
    } else {
        $rows = mysqli_fetch_all($re,1);
        echo json_encode($rows);
    }
}
// 热门电影 全部
function hotMovie(){
    // 根据 评分高->低进行排序
    global $conn;
    @$tid = $_REQUEST['tid'];
    @$lid = $_REQUEST['lid'];
    @$age = $_REQUEST['age'];
    @$pno = $_REQUEST['pno']?$_REQUEST['pno']:1;
    @$pageSize = $_REQUEST['pageSize']?$_REQUEST['pageSize']:24;
    $tid == null && $tid = "";
    $lid == null && $tid = "";
    $age == null && $tid = "";
    $nowPage = ($pno-1)*$pageSize; 
    if($tid=="" && $lid=="" && $age=="") {
    $sql = "SELECT mid, mname, poster, ename, scoreavg FROM movie ORDER BY scoreavg DESC LIMIT $nowPage,$pageSize";
    } else {
        //先凑合凑合吧
        $sql = "SELECT mid, mname, poster, ename, scoreavg FROM movie ORDER BY scoreavg DESC LIMIT $nowPage,$pageSize";
    // $sql = "SELECT mid, mname, poster, ename, scoreavg FROM movie WHERE location LIKE '%$lid%' AND tid LIKE '%$tid%'  ORDER BY scoreavg DESC";
    }
    $re = mysqli_query($conn,$sql);
    if($re === false) {
        echo "您的sql语句有误，请检查11";
    } else {
        $rows = mysqli_fetch_all($re,1);
        if($rows) {
            $sql = "SELECT COUNT(*) as c  FROM movie";
            $re = mysqli_query($conn,$sql);
            $pageCount = mysqli_fetch_assoc($re)["c"];
            echo json_encode(["code"=>1,"data"=>$rows,"pno"=>$pno,"pageSize"=>$pageSize,"pageCount"=>$pageCount]);
        }
        else {
            echo json_encode(["code"=>-1,"msg"=>"没有符合要求的影片"]);
        }
    }
}

//今日票房 10个
// function ticketTop(){
//     require_once('init.php');
//     $sql = "SELECT ";
// }

//搜索匹配结果
function matchmovies(){
    global $conn;
    @$kw = $_REQUEST['kw'];
    if(!$kw==null) {
        $sql = "SELECT mid,mname,poster,showtime,scoreavg,location FROM movie WHERE mname like '%$kw"."%'";
        // echo $sql;
        $res = mysqli_query($conn,$sql);
        if($res==false) {
            echo "您的sql语句有误，请重新输入";
        } else {
            $rows = mysqli_fetch_all($res,1);
            for($i=0;$i<count($rows);$i++) {
                $loc = $rows[$i]["location"];
                $sql = "SELECT location FROM location WHERE lid=$loc";
                $re = mysqli_query($conn,$sql);
                if($re==false) {
                    echo "您的sql语句有误，请重新输入";
                } else {
                    $row = mysqli_fetch_assoc($re)["location"];
                    $rows[$i]["lname"]=$row;
                }
                
            }
            echo json_encode(["code"=>1,"data"=>$rows]);
        }
    } else {
        echo json_encode(["code"=>-1,"msg"=>"未匹配任何电影"]);
    }

}
?>
