<?php
header("Content-Type:application/json;charset=utf-8");
require_once('init.php');
// 输出格式 [code=>1/-1,msg=>""]
@$uname = $_REQUEST['uname'];
@$upwd = $_REQUEST['upwd'];
if(!($uname && $upwd)) {
    die("您传入的参数有误，请检查");
}
$sql = "SELECT uid FROM user WHERE uname='$uname'";
$result = mysqli_query($conn,$sql);
//var_dump($result);
if($result==false) {
    echo  "您的sql语句有误请检查";

} else {
    $row = mysqli_fetch_row($result);
    if($row) {
        echo json_encode(["code"=>-1,"msg"=>"用户名已存在"]);
    } else {
        $sql = "INSERT INTO user(uname,upwd) VALUES ('$uname',md5($upwd))";
        $res = mysqli_query($conn,$sql);
        if($res==false) {
        echo    $sql;
            echo  "您的sql语句有误请检查";
        } else {
            $rows = mysqli_affected_rows($conn);
            if($rows==1) {
                echo json_encode(["code"=>1,"msg"=>"数据插入成功"]);
            } else {
                echo json_encode(["code"=>-1,"msg"=>"数据插入失败"]);
            }
        }
    }
 }
?>