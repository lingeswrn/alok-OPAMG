<?php
include 'config/config.php';
include 'config/database_functions.php';
$fun = new DatabaseFunctions();	
$data = json_decode(file_get_contents("php://input"));
$user = $data->data->username; 		
$pass = $data->data->password; 
$query = "SELECT * FROM users WHERE `email_id` = '".$user."' AND `password` = '".md5($pass)."' AND status = '1'";
$qryw = $fun->SelectFromTable($query);

if( count($qryw) == 1 ){
	$response = array(
		'code' => 200,
		'status' => 'OK',		'data' => $qryw
	);
}else{
	$response = array(
		'code' => 400,
		'status' => 'Error'
	);
}
echo json_encode($response);
?>