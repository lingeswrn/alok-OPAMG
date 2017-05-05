<?php

include 'config/config.php';
include 'config/database_functions.php';

session_start();

$fun = new DatabaseFunctions();	
$data = json_decode(file_get_contents("php://input"));

$action = $data->data->action;
    if( $action == "list" ){
		$name = $data->data->name;
		$id = $data->data->id;
		
        if( $name == 'Admin')
          $query = "SELECT * FROM projects WHERE status = '1' ORDER BY `id` DESC";
        else
           $query = "SELECT * FROM projects WHERE status = '1' AND user_id='".$id."' ORDER BY `id` DESC";

        $qryw = $fun->SelectFromTable($query);
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
    }else if( $action == "addProject" ){
       
        if( empty($data->data->pro_id) ){
           $query = "SELECT * FROM projects WHERE project_name = '".$data->data->pro_name."' AND status = '1'";
        }else{
           $query = "SELECT * FROM projects WHERE project_name = '".$data->data->pro_name."' AND status = '1' AND id != '".$data->data->pro_id."'";
        }
        $qryw = $fun->SelectFromTable($query);
        
        if( count( $qryw ) == 0 ){
			$id = $data->data->id;
			
            $input_project['project_name'] = $data->data->pro_name;
            $input_project['_from'] = $data->data->pro_from;
            $input_project['_to'] = $data->data->pro_to;
            $input_project['company_name'] = $data->data->pro_company_name;
            $input_project['work_order_number'] = $data->data->work_order_number;
            $input_project['scope_wrk'] = $data->data->scope_of_wrk_id;
            $input_project['remarks'] = $data->data->remarks;
            $input_project['client_id'] = $data->data->client_id;
            $input_project['user_id'] = $id;
			$input_project['created_date'] = date("Y-m-d H:i:s");
			$input_project['updated_date'] = date("Y-m-d H:i:s");
			
            if( empty( $data->data->pro_id ) ){
                $add_project = $fun->InsertToTable('projects',$input_project);
                $response = array(
                    'code' => 200,
                    'status' => 'OK'
                );
            } else {
				$input_project['id'] = $data->data->pro_id;
            
                $delete_project = $fun->UpdateTable('projects',$input_project,'id');            
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
        
    }else if( $action == "deleteProject" ){
        
        $query = "SELECT * FROM projects WHERE id = '".$data->data->pro_id."'";
        $qryw = $fun->SelectFromTable($query);
        
        if( $qryw[0]['id'] > 0 ){
            
            $input_project['status'] = '0';
            $input_project['id'] = $data->data->pro_id;

           
            $delete_project = $fun->UpdateTable('projects',$input_project,'id');
            
            $response = array(
                'code' => 200,
                'status' => 'OK'
            );
        }
    }

echo json_encode($response);
?>