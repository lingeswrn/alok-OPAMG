<?php
include 'config.php';
include 'database_functions.php';

session_start();

$fun = new DatabaseFunctions();

$query = "SELECT CONCAT( code ,'--',description ) as code, description FROM layers WHERE status = '1' AND code LIKE '%".$_GET['s']."%'";
        $qryw = $fun->SelectFromTable($query);
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
		
echo json_encode($response);