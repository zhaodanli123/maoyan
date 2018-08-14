<?php
//获取所有影院
function getAllCenter(){
    require_once('init.php');
    @$pno = $_REQUEST['pno'] ? $_REQUEST['pno'] : 1;
    @$pageSize = $_REQUEST['pageSize'] ? $_REQUEST['pageSize'] : 5;
    $nowPage = ($pno-1)*$pageSize;
    $sql = "SELECT mcid, mcenter_name,address FROM moviecenter LIMIT $nowPage,$pageSize";
    $re = mysqli_query($conn,$sql);
    if($re==false) {
        echo "您的sql语句有误，请检查12 :)";
    } else {
        $rows = mysqli_fetch_all($re,1);
        $sql = "SELECT COUNT(*) as c FROM moviecenter";
        $re = mysqli_query($conn,$sql);
        $pageCount = mysqli_fetch_assoc($re)["c"];
        echo json_encode(["code"=>1,"data"=>$rows,"pno"=>$pno,"pageSize"=>$pageSize,"pageCount"=>$pageCount]);
    }
}

//获取当前影院的详细信息
function getMC(){
    require_once('init.php');
    @$mcid = $_REQUEST['mcid'];
    $reg = "/^\d+$/";
    if($mcid==null) {
        die("未传入指定参数，请检查 : )");
    }
    if(!preg_match($reg,$mcid)) {
        die("您传入的参数有误，请检查1");
    }
    $sql = "SELECT mcid, mcenter_name, tel, glass, poster, childassist, parking, mbid, address FROM moviecenter WHERE mcid=$mcid";
    $re = mysqli_query($conn,$sql);
    if($re==false) {
        echo "您的sql语句有误，请检查12 :)";
    } else {
        $rows = mysqli_fetch_assoc($re);
        echo json_encode($rows);
    }
}

//获取当前影院的所有在上映电影
function getMovies(){
    require_once('init.php');
    $reg = "/^\d+$/";
    @$mcid = $_REQUEST['mcid'];
    $now = time()*1000;  //获取当前时间
    if($mcid==null) {
        die("未传入指定参数，请检查 : )");
    }
    if(!preg_match($reg,$mcid)) {
        die("您传入的参数有误，请检查1");
    }
    //获取当前影院上映中电影 movies中的showtime endtime
    $sql = "SELECT distinct mid FROM cinema WHERE mcid=$mcid";
    $re = mysqli_query($conn,$sql);
    if($re==false) {
        echo "您的sql语句有误，请检查13 :)";
    } else {
        $rows = mysqli_fetch_all($re,1);  //拿到一维关联数组
        $midArr = [];
        $now = time()*1000;
        foreach($rows as $row) {
            $mid = $row["mid"];
            $sql = "SELECT mid FROM movie WHERE mid=$mid AND showtime<$now AND endtime>$now";
            $re = mysqli_query($conn,$sql);
            if($re==false) {
                echo "您的sql语句有误，请检查14 :)";
            } else {
                $result = mysqli_fetch_assoc($re);  //一维数组
                if($result) {
                    $midArr[]=$result["mid"];
                }
            }
        }
        echo json_encode($midArr);
    }
}


//获取当前电影的所有场次等信息
function curMovieTicketDetail(){
    require_once('init.php');
    $now = time()*1000;  //获取当前时间
    @$mcid = $_REQUEST['mcid'];
    @$mid = $_REQUEST['mid'];
    $reg = "/^\d+$/";
    if($mcid==null || $mid == null) {
        die("未传入指定参数，请检查 : )");
    }
    if(!preg_match($reg,$mcid) || !preg_match($reg,$mid)) {
        die("您传入的参数有误，请检查1");
    }
    $sql = "SELECT cid, date, hid, lang, mcid, mid, price FROM cinema WHERE mcid=$mcid AND mid=$mid AND date>$now ORDER BY date ASC";
    $re = mysqli_query($conn,$sql);
    if($re==false) {
        echo "您的sql语句有误，请检查13 :)";
    } else {
        $rows = mysqli_fetch_all($re,1);  //拿到所有的数据
        $halls = [];
        foreach($rows as $item) {
            //拿到每一条数据
            $hid = $item["hid"];
            $sql = "SELECT hid, hall FROM hall WHERE hid=$hid";
            $re = mysqli_query($conn,$sql);
            if($re==false) {
                echo "您的sql语句有误，请检查14 :)";
            } else {
                $row = mysqli_fetch_assoc($re);
                $halls["$hid"] = $row['hall'];
            }
        }
       echo json_encode(["info"=>$rows,"halls"=>$halls]);
    }
}

// 获取当前电影座位情况
function seats(){
    require_once('init.php');
    @$cid = $_REQUEST['cid'];
    $reg = "/^\d+$/";
    if($cid==null) {
        die("您传入的参数有误，请检查 ：)");
    } else {
        $sql = "SELECT cid,date,hid,lang,mcid,mid,price,seats FROM cinema WHERE cid=$cid";
        $re = mysqli_query($conn,$sql);
        if($re==false) {
            echo "您的sql语句有误，请检查13 :)";
        } else {
            $row1 = mysqli_fetch_assoc($re);
            if($row1) {
                $hid = $row1["hid"];
                $mcid = $row1["mcid"];
//                $mid = $row1["mid"];
                $sql = "SELECT hall FROM hall WHERE hid=$hid";
                $re = mysqli_query($conn,$sql);
                if($re==false) {
                    echo "您的sql语句有误，请检查15 :)";
                } else {
                    $row2 = mysqli_fetch_assoc($re);
                    $row1["hall"] = $row2["hall"];
                }
                $sql = "SELECT mcenter_name FROM moviecenter WHERE mcid=$mcid";
                $re = mysqli_query($conn,$sql);
                if($re==false) {
                    echo "您的sql语句有误，请检查16 :)";
                } else {
                    $row2 = mysqli_fetch_assoc($re);
                    $row1["mcname"] = $row2["mcenter_name"];
                }
//                $sql = "SELECT mcenter_name FROM movie WHERE mid=$mid";
                echo json_encode($row1);
            }
        }
    }
}

//function getHall(){
//    require_once('init.php');
//    @$hid = $_REQUEST['hid'];
//    $reg = "/^\d$/";
//    if($hid==null) {
//        die("您传入的参数有误，请检查 ：)");
//    } else {
//        $sql = "SELECT hall FROM hall WHERE hid=$hid";
//        $re = mysqli_query($conn,$sql);
//        if($re==false) {
//            echo "您的sql语句有误，请检查15 :)";
//        } else {
//            $row = mysqli_fetch_assoc($re);
//            echo json_encode($row);
//        }
//    }
//}
?>
