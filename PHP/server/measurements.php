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
        $input_measurement['equipement_id'] = $data->data->equipmentId;
        $input_measurement['layer_code'] = $data->data->layer;
        $input_measurement['latitude'] = $data->data->latitude;
        $input_measurement['longitude'] = $data->data->longitude;
        $input_measurement['utm_zone'] = $data->data->zone;
        $input_measurement['utm_easting'] = $data->data->easting;
        $input_measurement['utm_northing'] = $data->data->northing;
        $input_measurement['el'] = $data->data->el;
        $input_measurement['mapping_ch'] = $data->data->ch;
        $input_measurement['ch_by_auto_level'] = $data->data->chByAutoLevel;
        $input_measurement['measurment_ch'] = $data->data->measurement_ch;
        $input_measurement['bs_offset'] = $data->data->bsOffset;
        $input_measurement['is_offset'] = $data->data->isOffset;
        $input_measurement['fs_offset'] = $data->data->fsOffset;
        $input_measurement['n_offset'] = $data->data->n_offset;
        $input_measurement['e_offset'] = $data->data->e_offset;
        $input_measurement['l_section_offset'] = $data->data->lSection;
        $input_measurement['x_section_offset'] = $data->data->xSection;
        $input_measurement['rise_plus'] = $data->data->risePlus;
        $input_measurement['fall_minus'] = $data->data->fallMinus;
        $input_measurement['avg_hight_of_instrument_from_gl'] = $data->data->avgHeightOfInstrument;
        $input_measurement['hight_of_instrument'] = $data->data->heightOfInstrument;
        $input_measurement['calculated_reduce_rl'] = $data->data->reduceLevel;
        $input_measurement['checked_reduce_level'] = $data->data->checkedReduceLevel;
        $input_measurement['remarks'] = $data->data->remarks;
        $input_measurement['adj_rl'] = $data->data->adj_rl;
        $input_measurement['adjustment_error'] = $data->data->adjustmentError;
        $input_measurement['tbm_rl'] = $data->data->tbm_rl;
        $input_measurement['bs_angle'] = $data->data->bs_angle;
        $input_measurement['fs_angle'] = $data->data->fs_angle;
        $input_measurement['created_date'] = date("Y-m-d H:i:s");
        
        if( empty( $input_project['id'] ) ){
            $add_measurement = $fun->InsertToTable('measurement',$input_measurement);
			
			if( $add_measurement ){
				$explodeLat = explode(',', $data->data->latitudeDMS );
				$inputLat['measurment_id'] = $add_measurement;
				$inputLat['type'] = 'lat';				
				$inputLat['deg'] = $explodeLat[0];				
				$inputLat['min'] = $explodeLat[1];				
				$inputLat['sec'] = $explodeLat[2];
				
				$explodeLng = explode(',', $data->data->longitudeDMS );
				$inputLng['measurment_id'] = $add_measurement;
				$inputLng['type'] = 'lng';				
				$inputLng['deg'] = $explodeLng[0];				
				$inputLng['min'] = $explodeLng[1];				
				$inputLng['sec'] = $explodeLng[2];
				
				$fun->InsertToTable('gps_coordinates',$inputLat);
				$fun->InsertToTable('gps_coordinates',$inputLng);
				
				$implode['measurment_id'] = $add_measurement;
				$implode['back_site'] = implode(',', $data->data->backSite);
				$implode['intermediate_site'] = implode(',', $data->data->intermediateSite);
				$implode['forward_site'] = implode(',', $data->data->foreSite);				
				$fun->InsertToTable('staff_readings',$implode);
				
				$input_project['updated_date'] = date("Y-m-d H:i:s", strtotime($data->data->updatedDate));
				$input_project['id'] = $data->data->id;
				$Updateproject = $fun->UpdateTable('projects',$input_project,'id');
				
				$response = array(
					'code' => 200,
					'status' => 'OK'
				);
			}
			
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