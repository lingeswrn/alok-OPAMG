<?php
include 'config.php';
include 'database_functions.php';

session_start();

$fun = new DatabaseFunctions();	
$data = json_decode(file_get_contents("php://input"));
$user = $data->data->username; 		
$pass = $data->data->password; 

$logToken_array = getallheaders();
$logToken = $logToken_array['login_token'];

    $query = "SELECT * FROM users WHERE `email_id` = '".$user."' AND `password` = '".md5($pass)."' AND status = '1'";
    $qryw = $fun->SelectFromTable($query);
    
    if( count($qryw) == 1 ){
        $_SESSION['USER_ID'] = $qryw[0]['id'];
        $_SESSION['USER_NAME'] = $qryw[0]['name'];
		
        $_SESSION['COMMON_TOKEN'] = md5( $_SESSION['USER_ID'] ) . md5( $_SESSION['USER_NAME'] );
        $response = array(
            'code' => 200,
            'status' => 'OK'
        );
    }else{
        $response = array(
            'code' => 400,
            'status' => 'Error'
        );
    }


echo json_encode($response);
?>