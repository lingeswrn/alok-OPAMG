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
		
        $query = "SELECT measurement.*,layers.symble FROM measurement LEFT OUTER JOIN layers ON layers.code = measurement.layer_code WHERE measurement.status = '1' AND measurement.project_id ='".$data->data->id."' AND measurement.status = '1' ORDER BY measurement.id ASC";
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
        $input_measurement['lattitude'] = $data->data->latitude;
        $input_measurement['longitude'] = $data->data->longitude;
        $input_measurement['utm_zone'] = $data->data->zone;
        $input_measurement['utm_easting'] = $data->data->easting;
        $input_measurement['utm_northing'] = $data->data->northing;
        $input_measurement['el'] = $data->data->el;
        $input_measurement['mapping_ch'] = $data->data->ch;
        $input_measurement['ch_by_auto_level'] = $data->data->chByAutoLevel;
        $input_measurement['measurment_ch'] = $data->data->measurement_ch;
        $input_measurement['gps_offset_length'] = $data->data->gps_offset_length;
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
        $input_measurement['close_photograph'] = $data->data->close_photograph;
        $input_measurement['location_photograph'] = $data->data->location_photograph;
        $input_measurement['screen_shot'] = $data->data->screen_shot;
        $input_measurement['other_photograph'] = $data->data->other_photograph;
        $input_measurement['created_date'] = date("Y-m-d H:i:s");
		
		
        if( empty( $input_project['id'] ) ){
            $add_measurement = $fun->InsertToTable('measurement',$input_measurement);
			
			if( $add_measurement ){
				$explodeLat = explode(',', $data->data->latitudeDMS );
				$inputLat['measurement_id'] = $add_measurement;
				$inputLat['type'] = 'lat';				
				$inputLat['deg'] = $explodeLat[0];				
				$inputLat['min'] = $explodeLat[1];				
				$inputLat['sec'] = $explodeLat[2];
				
				$explodeLng = explode(',', $data->data->longitudeDMS );
				$inputLng['measurement_id'] = $add_measurement;
				$inputLng['type'] = 'lng';				
				$inputLng['deg'] = $explodeLng[0];				
				$inputLng['min'] = $explodeLng[1];				
				$inputLng['sec'] = $explodeLng[2];
				
				$fun->InsertToTable('gps_coordinates',$inputLat);
				$fun->InsertToTable('gps_coordinates',$inputLng);
				
				$implode['measurement_id'] = $add_measurement;
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
    }else if( $action == "measureData" ){       
            $measureDataId = $data->data->id;
            $measurements = $fun->SelectFromTable( 'SELECT 
			measurement.id, 
			measurement.project_id, 
			measurement.equipement_id, 
			measurement.layer_code,
			measurement.lattitude,
			measurement.longitude,
			measurement.utm_zone, 
			measurement.utm_easting, 
			measurement.utm_northing, 
			measurement.el, 
			measurement.mapping_ch,
			measurement.ch_by_auto_level,
			measurement.measurment_ch, 
			measurement.gps_offset_length, 
			measurement.bs_offset, 
			measurement.is_offset, 
			measurement.fs_offset, 
			measurement.n_offset, 
			measurement.e_offset, 
			measurement.l_section_offset,
			measurement.x_section_offset, 
			measurement.rise_plus, 
			measurement.fall_minus, 
			measurement.avg_hight_of_instrument_from_gl,  
			measurement.hight_of_instrument,  
			measurement.calculated_reduce_rl,  
			measurement.checked_reduce_level,  
			measurement.remarks,   
			measurement.adj_rl,   
			measurement.adjustment_error,    
			measurement.tbm_rl,   
			measurement.bs_angle,   
			measurement.fs_angle, 
			projects.id as projectId, 
			projects._from, 
			projects._to, 
			projects.project_name, 
			projects.company_name, 
			projects.work_order_number, 
			projects.scope_wrk, 
			projects.user_id, 
			projects.created_date as projectDate,
			equipments_list.model_number,
			equipments_list.last_calibration_service_center,
			equipments_list.least_count, 
			equipments_list.owner, 
			layers.code, 
			layers.category, 
			layers.description,
			users.id as empID,
			staff_readings.back_site,
			staff_readings.forward_site,
			staff_readings.intermediate_site
			FROM measurement LEFT OUTER JOIN projects ON projects.id = measurement.project_id LEFT OUTER JOIN equipments_list ON equipments_list.id = measurement.equipement_id LEFT OUTER JOIN layers ON layers.code = measurement.layer_code LEFT OUTER JOIN users ON users.id = projects.user_id LEFT OUTER JOIN staff_readings ON staff_readings.measurement_id = measurement.id WHERE measurement.id ='.$measureDataId );
            
			$gpsReadings = $fun->SelectFromTable('SELECT * FROM gps_coordinates WHERE measurement_id ='.$measureDataId);
			
            $response = array(
                'code' => 200,
                'status' => 'OK',
				'data' => array( 'measureData' => $measurements[0], 'gpsReadings' => $gpsReadings )
            );
    }else if( $action == "listMeasurementReport" ){       
            $projectId = $data->data->id;
            $measurements = $fun->SelectFromTable( 'SELECT 
			measurement.id, 
			measurement.project_id, 
			measurement.equipement_id, 
			measurement.layer_code,
			measurement.lattitude,
			measurement.longitude,
			measurement.utm_zone, 
			measurement.utm_easting, 
			measurement.utm_northing, 
			measurement.el, 
			measurement.mapping_ch,
			measurement.ch_by_auto_level,
			measurement.measurment_ch, 
			measurement.gps_offset_length, 
			measurement.bs_offset, 
			measurement.is_offset, 
			measurement.fs_offset, 
			measurement.n_offset, 
			measurement.e_offset, 
			measurement.l_section_offset,
			measurement.x_section_offset, 
			measurement.rise_plus, 
			measurement.fall_minus, 
			measurement.avg_hight_of_instrument_from_gl,  
			measurement.hight_of_instrument,  
			measurement.calculated_reduce_rl,  
			measurement.checked_reduce_level,  
			measurement.remarks,   
			measurement.adj_rl,   
			measurement.adjustment_error,    
			measurement.tbm_rl,   
			measurement.bs_angle,   
			measurement.fs_angle,						measurement.close_photograph,						measurement.location_photograph,						measurement.screen_shot,						measurement.other_photograph,			
			equipments_list.model_number,
			equipments_list.last_calibration_service_center,
			equipments_list.least_count, 
			equipments_list.owner, 
			layers.code, 
			layers.category, 
			layers.description
			FROM measurement LEFT OUTER JOIN equipments_list ON equipments_list.id = measurement.equipement_id LEFT OUTER JOIN layers ON layers.code = measurement.layer_code WHERE measurement.project_id ='.$projectId.' AND measurement.status = "1" AND layers.status = "1" ORDER BY measurement.id ASC' );
            
			for( $i=0; $i< count($measurements); $i++){				$index = $i + 1;				$measurements[$i]['index'] = $index;
				$gpsReadings = $fun->SelectFromTable('SELECT deg, min, sec, type FROM gps_coordinates WHERE measurement_id ='.$measurements[$i]['id']);
				for( $j=0; $j< count($gpsReadings);$j++){
					$type = $gpsReadings[$j]['type'];
					$measurements[$i][$type. 'Deg'] = $gpsReadings[$j]['deg'];
					$measurements[$i][$type. 'Min'] = $gpsReadings[$j]['min'];
					$measurements[$i][$type. 'Sec'] = $gpsReadings[$j]['sec'];					
				}
				
				$staffReadings = $fun->SelectFromTable('SELECT * FROM staff_readings WHERE measurement_id ='.$measurements[$i]['id']);
				for( $j=0; $j< count($staffReadings);$j++){
					$measurements[$i]['back_site'] = $staffReadings[$j]['back_site'];
					$measurements[$i]['intermediate_site'] = $staffReadings[$j]['intermediate_site'];
					$measurements[$i]['forward_site'] = $staffReadings[$j]['forward_site'];					
				}
				$measurements[$i]['offset_result'] = $measurements[$i]['bs_offset'] + $measurements[$i]['is_offset'] + $measurements[$i]['fs_offset'];
					$explodeBS = explode(',', $measurements[$i]['back_site']);
					$bsSum = 0;
					for( $j=0; $j < count($explodeBS); $j++){
						$bsSum += $explodeBS[$j];
					}
					$measurements[$i]['bs_sum'] = $bsSum;
					$measurements[$i]['bs_mean'] = $bsSum/count($explodeBS);
					
					$explodeIS = explode(',', $measurements[$i]['intermediate_site']);
					$IsSum = 0;
					for( $q=0; $q < count($explodeIS); $q++){
						$IsSum += $explodeIS[$q];
					}
					$measurements[$i]['is_sum'] = $IsSum;
					$measurements[$i]['is_mean'] = $IsSum/count($explodeIS);
					
					$explodeFS = explode(',', $measurements[$i]['forward_site']);
					$FsSum = 0;
					for( $q=0; $q < count($explodeFS); $q++){
						$FsSum += $explodeFS[$q];
					}
					$measurements[$i]['fs_sum'] = $FsSum;
					$measurements[$i]['fs_mean'] = $FsSum/count($explodeFS);
					
					if( $explodeBS[0] > 0 && $explodeBS[2] > 0 ){
						$measurements[$i]['bs_reading_error'] = round(($explodeBS[0] - $explodeBS[1])-($explodeBS[1] - $explodeBS[2]),3);
					}else{
						$measurements[$i]['bs_reading_error'] = 0;
					}
					
					if( $explodeIS[0] > 0 && $explodeIS[2] > 0 ){
						$measurements[$i]['is_reading_error'] = round(($explodeIS[0] - $explodeIS[1])-($explodeIS[1] - $explodeIS[2]),3);
					}else{
						$measurements[$i]['is_reading_error'] = 0;
					}
					if( $explodeFS[0] > 0 && $explodeFS[2] > 0 ){
						$measurements[$i]['fs_reading_error'] = round(($explodeFS[0] - $explodeFS[1])-($explodeFS[1] - $explodeFS[2]),3);
					}else{
						$measurements[$i]['fs_reading_error'] = 0;
					}
										
					if( $measurements[$i]['close_photograph'] != '' ){
						$measurements[$i]['close_photograph'] = 'server/upload/'. $measurements[$i]['close_photograph'];
					}else{
						$measurements[$i]['close_photograph'] = 'assets/images/no_img.jpg';
					}
					if( $measurements[$i]['location_photograph'] != '' ){
						$measurements[$i]['location_photograph'] = 'server/upload/'. $measurements[$i]['location_photograph'];
					}else{
						$measurements[$i]['location_photograph'] = 'assets/images/no_img.jpg';
					}
					if( $measurements[$i]['screen_shot'] != '' ){
						$measurements[$i]['screen_shot'] = 'server/upload/'. $measurements[$i]['screen_shot'];
					}else{
						$measurements[$i]['screen_shot'] = 'assets/images/no_img.jpg';
					}
					if( $measurements[$i]['other_photograph'] != '' ){
						$measurements[$i]['other_photograph'] = 'server/upload/'. $measurements[$i]['other_photograph'];
					}else{
						$measurements[$i]['other_photograph'] = 'assets/images/no_img.jpg';
					}					
			}
			
			$projectDetails = $fun->SelectFromTable('SELECT * FROM projects WHERE id ='.$projectId);
            $response = array(
                'code' => 200,
                'status' => 'OK',
				'data' => array( 'measureData' => $measurements, 'projects' => $projectDetails[0] )
            );
    }else if( $action == "singleEquipment" ){       
            $equipementID = $data->data->id;

            $query_equipment = "SELECT * FROM equipments_list WHERE id =".$equipementID;
			$equipements = $fun->SelectFromTable($query_equipment);	
			
            $response = array(
                'code' => 200,
                'status' => 'OK',
				'data' => array( 'equipements' => $equipements[0] )
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