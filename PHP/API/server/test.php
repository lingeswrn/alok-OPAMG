<?php
include "config/config.php";
include "config/database_functions.php";
$fun = new DatabaseFunctions();	


$data = json_decode(file_get_contents("php://input"));
$action = $data->data->action;
    if( $action == "list" ){
        $query = "SELECT * FROM equipments_list WHERE status = '1'";
        $qryw = $fun->SelectFromTable($query); 
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
    }
echo json_encode($response);

?>