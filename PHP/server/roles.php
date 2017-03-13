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
        
        $input['name'] = $data->data->name;        
        if( empty($data->data->id) )
			$query = "SELECT * FROM roles WHERE `name` = '".$input['name']."'";
		else
			$query = "SELECT * FROM roles WHERE `name` = '".$input['name']."' AND id != '".$data->data->id."'";
        $qryw = $fun->SelectFromTable($query);

        
        if( count($qryw) == 0 ){			
			if( empty($data->data->id) )
				$add_users = $fun->InsertToTable('roles',$input);
			else{
				$input['id'] = $data->data->id;
				$add_users = $fun->UpdateTable('roles',$input,'id');
				
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
        $query = "SELECT * FROM roles";
        $qryw = $fun->SelectFromTable($query);
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
    }else if( $action == "delete" ){
        
        $input['id'] = $data->data->id;
        $condition = 'id='.$input['id'];
        $fun->DeleteFromTable('roles', $condition);
        $response = array(
            'code' => 200,
            'status' => 'OK'
        );
    }

echo json_encode($response);
?>