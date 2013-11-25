<?php
echo header('Access-Control-Allow-Origin: *');
echo header('Content-Type: application/json');
if (!isset($_GET['req'])) die();
$req = $_GET['req'];
if (isset($_GET['token'])){
	$token = $_GET['token'];
	$token_status = true;
}
switch($req){

case 'token':
	$url = "apiv1/payexpress?output=json&method=getToken&secretkey=<disini masukkan secret key>";
break;

case 'bandara':
if($token_status){
	$url = "flight_api/all_airport?output=json&token=".$token;
}
else{
echo "token tidak ada";
}
break;

case 'oneway':
if($token_status){
$d = $_GET['d'];
$a = $_GET['a'];
$date = $_GET['date'];
$adult = $_GET['adult'];
$child = $_GET['child'];
$infant = $_GET['inf'];
$asc = $_GET['asc'];
	$url = "search/flight?d=".$d."&a=".$a."&date=".$date."&adult=".$adult."&child=".$child."&infant=".$infant."&v=2&sort=".$asc."&lang=en&currency=IDR&output=json&token=".$token;
}
else{
echo "token tidak ada";
}
break;

case 'return':
if($token_status){
$d = $_GET['d'];
$a = $_GET['a'];
$date = $_GET['date'];
$ret_date = $_GET['dateret'];
$adult = $_GET['adult'];
$child = $_GET['child'];
$infant = $_GET['inf'];
$asc = $_GET['asc'];
	$url = "search/flight?d=".$d."&a=".$a."&date=".$date."&ret_date=".$ret_date."&adult=".$adult."&child=".$child."&infant=".$infant."&v=2&sort=".$asc."&lang=en&currency=IDR&output=json&token=".$token;
}
else{
echo "token tidak ada";
}
break;

}
$url = urldecode("http://api.tiket.com/".$url);
echo file_get_contents($url);
?>