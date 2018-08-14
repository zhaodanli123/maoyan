<?php
//引入init.php
require_once('init.php');
session_start();
@$uname = $_REQUEST['uname'];
@$upwd = $_REQUEST['upwd'];
//验证前台传过来的uname和upwd
$reg = '/^[\w\x{4e00}-\x{9fa5}]+$/u';
$reg2 = '/^[\w]+$/';
$testN = preg_match($reg,$uname);
$testP = preg_match($reg2,$upwd);
if(!($testN && $testP)) {
	die('{"code":-1,"msg":"您输入的信息有误"}');
}
//写sql语句
$sql = "SELECT uid,uname FROM user WHERE uname='$uname' AND binary upwd=md5($upwd)";
#echo $sql;
$re = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($re);  //一维关联数组
if($row) {
	$_SESSION['uid'] = $row['uid'];
	echo "<script>";
	echo "sessionStorage['uid']=".$row['uid'].";";
	echo "sessionStorage['uname']='".$row['uname']."';";
	echo "location.href='../index.html'".";";
	echo "</script>";
} else {
	echo '{"code":-1,"msg":"您输入的用户名密码有误"}';
}
?>