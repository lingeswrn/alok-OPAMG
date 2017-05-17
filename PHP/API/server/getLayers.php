<?php
include "config/config.php";
include "config/database_functions.php";

$fun = new DatabaseFunctions();

$query = "SELECT CONCAT( code ,'--',description ) as code, description FROM layers WHERE status = '1' LIMIT 0, 100";
        $qryw = $fun->SelectFromTable($query);
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
		
echo json_encode($response);