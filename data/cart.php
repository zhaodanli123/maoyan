<?php
    function payment(){
        require_once('init.php');
        session_start();
        @$uid = $_REQUEST['uid'];
        @$mid = $_REQUEST['mid'];
        @$cid = $_REQUEST['cid'];
        @$hid = $_REQUEST['hid'];
        @$date = $_REQUEST['date'];
        @$seatsArr = $_REQUEST['seatsArr'];
        @$seatsArr = explode(",",$seatsArr);
        @$sessionuid=$_SESSION['uid'];
        if($uid==null || $sessionuid==null) {   
            echo json_encode(["code"=>-1,"msg"=>"请重新登录"]);
            return;
        } else if($uid && $uid==$sessionuid) {
            $ordernum = time().rand(1,9999);
            $buydate = time()*1000;  //获取当前时间
            foreach($seatsArr as $item){
                $rows = explode("_",$item)[0];
                $columns = explode("_",$item)[1];
                $sql = "SELECT * FROM showing_movie_ticket WHERE uid=$uid AND cid=$cid AND seat='$item'";
                $re = mysqli_query($conn,$sql);
                if($re==false) {
                    echo "您的sql语句有误，请检查13 :)".$sql;
                    return;
                } else {
                    $row = mysqli_fetch_row($re);
                    if($row) {
                        echo json_encode(["code"=>-1,"msg"=>"订票信息已存入数据库中,请勿重复提交<br />请到[我的订单]中进行付款"]);
                        return;
                    } else {
                        $sql = "INSERT INTO showing_movie_ticket(uid,hid,mid,cid,seat,rows,columns,ticketdate,buydate,status,ordernum)".
                        " VALUES($uid,$hid,$mid,$cid,'$item',$rows,$columns,'$date','$buydate',0,'$ordernum')";
                        $re = mysqli_query($conn,$sql);
                        if($re==false) {
                            echo "您的sql语句有误，请检查14 :)".$sql;
                            return;
                        } else {
                            $row = mysqli_affected_rows($conn);
                            if($row<1) {
                                echo json_encode(["code"=>-1,"msg"=>"发生错误，为能成功提交到数据库"]);
                                return;
                            }
                        }
                    }
                }
            }
            echo json_encode(["code"=>1,"ordernum"=>$ordernum,"msg"=>"订票信息已存入数据库中，等待付款"]);
        }
    }
    
    function buyTicket(){
        header("Content-Type:javascript/json;charset=utf-8");
        require_once('init.php');
        @$ordernum = $_REQUEST['ordernum'];
        @$cid = $_REQUEST['cid'];
        if($ordernum==null) {
            die("参数有误，请检查");
        } else {
            // 将show_movie_ticket表中的status转为1
            $sql = "UPDATE showing_movie_ticket SET status=1 WHERE ordernum='$ordernum'";
            $re = mysqli_query($conn,$sql);
            if($re==false) {
                echo "您的sql语句有误，请检查15 :)".$sql;
                return;
            } else {
                $row = mysqli_affected_rows($conn);
                if($row>0) {
                   // 将cinema表中的seats字段进行变更  拿到所有数据的座位号
                    $sql = "SELECT seats FROM cinema WHERE cid=$cid";
                    $re = mysqli_query($conn,$sql);
                    if($re==false) {
                        echo "您的sql语句有误，请检查17 :)".$sql;
                        return;
                    } else {
                        $row = mysqli_fetch_assoc($re);
                        if($row) {
                            $seats = $row["seats"];
                            $seatsArr = explode(",",$seats);
                            //改变某些座位信息
                        }
                    }
                    $sql = "SELECT rows, columns  FROM showing_movie_ticket WHERE ordernum='$ordernum'";
                    $re = mysqli_query($conn,$sql);
                    if($re==false) {
                        echo "您的sql语句有误，请检查16 :)".$sql;
                        return;
                    } else {
                        $rows = mysqli_fetch_all($re,1);  //返回一个二维数组
                        // var_dump($seatsArr);
                        foreach($rows as $item) {
                            $index = ($item["rows"]-1)*12+($item["columns"]-1);
                            if($seatsArr[$index]!==1) {
                                $seatsArr[$index]=1;
                            } else {
                                echo "购票失败";
                                return;
                            }
                        }
                        $seats = implode(",",$seatsArr);
                        //更新cinema表中的seats字段
                        $sql = "UPDATE cinema SET seats='$seats' WHERE cid=$cid";
                        $re = mysqli_query($conn,$sql);
                        if($re==false) {
                            echo "您的sql语句有误，请检查17 :)".$sql;
                            return;
                        } else {
                            echo json_encode(["code"=>1,"msg"=>"购票成功"]);
                        }
                    }
                } else {
                    echo "数据已更新，无需重复提交";
                }
            }
        }

    }

    function cancelTicket(){
        require_once('init.php');
        @$ordernum = $_REQUEST['ordernum'];
        if($ordernum==null) {
            die("您传入的参数有误，请检查");
        } else {
            $sql = "DELETE FROM showing_movie_ticket WHERE ordernum='$ordernum'";
            $re = mysqli_query($conn,$sql);
            if($re==false) {
                echo "您的sql语句有误，请检查15 :)".$sql;
                return;
            } else {
                $row = mysqli_affected_rows($conn);
                if($row>0) {
                    echo json_encode(["code"=>1,"msg"=>"删除订单成功"]);
                } else {
                    echo json_encode(["code"=>-1,"msg"=>"删除订单失败"]);
                }
            }
        }
    }


?>