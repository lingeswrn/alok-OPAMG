<?php
include 'config.php';
include 'database_functions.php';

session_start();

$fun = new DatabaseFunctions();	
$data = json_decode(file_get_contents("php://input"));

$action = $data->data->action;

$logToken_array = getallheaders();
$logToken = $logToken_array['login_token'];

if( !empty($_SESSION['COMMON_TOKEN'])){
    
    if( $action == "listMeasurement" ){
		
        $query = "SELECT * FROM measurement WHERE status = '1' AND project_id ='".$data->data->id."'";
        $qryw = $fun->SelectFromTable($query);
		
        $query_proj = "SELECT * FROM projects WHERE id ='".$data->data->id."'";
        $proj = $fun->SelectFromTable($query_proj);
		
        $last = count($qryw) - 1;
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => array( 'list' => $qryw, 'previous' => $qryw[$last], 'project' => $proj)
        );
    }else if( $action == "add" ){
        
        $input_measurement['project_id'] = $data->data->id;
        $input_measurement['back_site'] = $data->data->back_site;
        $input_measurement['intermediate_site'] = $data->data->intermediate_site;
        $input_measurement['fore_site'] = $data->data->fore_site;
        $input_measurement['adj'] = $data->data->adj;
        $input_measurement['adj_rl'] = $data->data->adj_rl;
        $input_measurement['northing'] = $data->data->northing;
        $input_measurement['easting'] = $data->data->easting;
        $input_measurement['reduce_level'] = $data->data->reduce_level;
        $input_measurement['hight_of_instrument'] = $data->data->hight_of_instrument;
        $input_measurement['offset_length'] = $data->data->offset_length;
        $input_measurement['measurement_offset'] = $data->data->measurement_offset;
        $input_measurement['ch'] = $data->data->ch;
        $input_measurement['measurement_ch'] = $data->data->measurement_ch;
        $input_measurement['layer_name'] = $data->data->layer_name;
        $input_measurement['remarks'] = $data->data->remarks;
        $input_measurement['lattitude'] = $data->data->latitude;
        $input_measurement['longitude'] = $data->data->longitude;
        $input_measurement['created_date'] = date("Y-m-d H:i:s");
        
        if( empty( $input_project['id'] ) ){
            $add_project = $fun->InsertToTable('measurement',$input_measurement);
			
			$input_project['updated_date'] = date("Y-m-d H:i:s", strtotime($data->data->updatedDate));
            $input_project['id'] = $data->data->id; 
			
            $Updateproject = $fun->UpdateTable('projects',$input_project,'id');
			
            $response = array(
                'code' => 200,
                'status' => 'OK'
            );
        }        
    }else if( $action == "delete" ){
       
            
            $input_project['status'] = '0';
            $input_project['id'] = $data->data->id;

           
            $delete_project = $fun->UpdateTable('measurement',$input_project,'id');
            
            $response = array(
                'code' => 200,
                'status' => 'OK'
            );
    }
}else{
    $response = array(
        'code' => 400,
        'status' => 'Error'
    );
}

echo json_encode($response);
?>