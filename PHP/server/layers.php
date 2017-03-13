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
        
        $input['symble'] = $data->data->symble;        
        $input['code'] = $data->data->code;        
        $input['category'] = $data->data->category;        
        $input['description'] = $data->data->description;        
        
		if( empty($data->data->id) )
			$query = "SELECT * FROM layers WHERE `code` = '".$input['code']."' AND status = 1";
		else
			$query = "SELECT * FROM layers WHERE `code` = '".$input['code']."' AND id != '".$data->data->id."' AND status = 1";
		
        $qryw = $fun->SelectFromTable($query);

        
        if( count($qryw) == 0 ){			
			if( empty($data->data->id) )
				$add_layers = $fun->InsertToTable('layers',$input);
			else{
				$input['id'] = $data->data->id;
				$add_layers = $fun->UpdateTable('layers',$input,'id');
				
			}				
            
            if( $add_layers ){
                
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
                'message' => 'Code Already Exists!'
            );
        }
    }else if( $action == "list" ){
        $query = "SELECT * FROM layers WHERE status = '1'";
        $qryw = $fun->SelectFromTable($query);
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
    }else if( $action == "delete" ){
        
        $input['status'] = '0';
        $input['id'] = $data->data->id;
		$add_layers = $fun->UpdateTable('layers',$input,'id');
        $response = array(
            'code' => 200,
            'status' => 'OK'
        );
    }

echo json_encode($response);
?>