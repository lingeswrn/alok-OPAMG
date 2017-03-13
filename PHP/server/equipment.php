<?php
include 'config.php';
include 'database_functions.php';

session_start();

$fun = new DatabaseFunctions();	
$data = json_decode(file_get_contents("php://input"));

$action = $data->data->action;

$logToken_array = getallheaders();
$logToken = $logToken_array['Login-Token'];
//print_r($logToken_array);
 
    if( $action == 'add' ){
        
        $input['model_number'] = $data->data->model;        
        $input['last_calibration_service_center'] = $data->data->calibration;        
        $input['expiry_date'] = date("Y-m-d H:i:s", strtotime($data->data->exp_date));        
        $input['least_count'] = $data->data->least_count;        
        $input['owner'] = $data->data->owner;        
        
		if( empty($data->data->id) )
			$query = "SELECT * FROM equipments_list WHERE `model_number` = '".$input['model_number']."' AND status = '1'";
		else
			$query = "SELECT * FROM equipments_list WHERE `model_number` = '".$input['model_number']."' AND status = '1' AND id != '".$data->data->id."'";
        $qryw = $fun->SelectFromTable($query);

        
        if( count($qryw) == 0 ){			
			if( empty($data->data->id) )
				$add_users = $fun->InsertToTable('equipments_list',$input);
			else{
				$input['id'] = $data->data->id;
				$add_users = $fun->UpdateTable('equipments_list',$input,'id');
				
			}				
            
            if( $add_users ){
                
				$response = array(
					'code' => 200,
					'status' => 'OK'
				);
                
            }else {
                    $response = array(
                        'code' => 400,
                        'status' => 'Error',
                        'message' => 'Something went wrong!'
                    );
                }
        }else{
            $response = array(
                'code' => 400,
                'status' => 'Error',
                'message' => 'Role Already Exists!'
            );
        }
    }else if( $action == "list" ){
        $query = "SELECT * FROM equipments_list WHERE status = '1'";
        $qryw = $fun->SelectFromTable($query);
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
    }else if( $action == "delete" ){
        
        $input['status'] = '2';
        $input['id'] = $data->data->id;
		$add_users = $fun->UpdateTable('equipments_list',$input,'id');
        $response = array(
            'code' => 200,
            'status' => 'OK'
        );
    }

echo json_encode($response);
?>