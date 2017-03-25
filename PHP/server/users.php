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
        $input['mobile'] = $data->data->phone;
        $input['email_id'] = $data->data->email;
        $input['password'] = md5($data->data->password);
        $input['emp_id'] = $data->data->emp_id;
        $input['id_no'] = $data->data->id_no;
        
        //Residential Address
        $inputAddress['address_type'] = "residencial";
        $inputAddress['address'] = $data->data->address;
        $inputAddress['city'] = $data->data->city;
        $inputAddress['state'] = $data->data->state;
        $inputAddress['country'] = $data->data->country;
        $inputAddress['pincode'] = $data->data->pincode;
        $inputAddress['district'] = $data->data->district;
        
        //Corporate Address
        $inputCorpAddress['address_type'] = "corporate";
        $inputCorpAddress['address'] = $data->data->corpaddress;
        $inputCorpAddress['city'] = $data->data->corpcity;
        $inputCorpAddress['state'] = $data->data->corpstate;
        $inputCorpAddress['country'] = $data->data->corpcountry;
        $inputCorpAddress['pincode'] = $data->data->corppincode;
        $inputCorpAddress['district'] = $data->data->corpdistrict;
        
        $query = "SELECT * FROM users WHERE status = '1' AND (`email_id` = '".$input['email_id']."' OR `mobile` = '".$input['mobile']."') ";
        $qryw = $fun->SelectFromTable($query);

        
        if( count($qryw) == 0 ){
            $add_users = $fun->InsertToTable('users',$input);
            
            if( $add_users ){
                $inputAddress['user_id'] = $add_users;
                $inputCorpAddress['user_id'] = $add_users;
                
                $add_resi_drivers = $fun->InsertToTable('address',$inputAddress);
                $add_corp_drivers = $fun->InsertToTable('address',$inputCorpAddress);
                
                if( $add_corp_drivers && $add_resi_drivers ){
                    $response = array(
                        'code' => 200,
                        'status' => 'OK'
                    );
                } else {
                    $response = array(
                        'code' => 400,
                        'status' => 'Error',
                        'message' => 'Something went wrong!'
                    );
                }
                
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
                'message' => 'User Already Registered!'
            );
        }
    }else if( $action == "list" ){
        $query = "SELECT * FROM users WHERE name != 'Admin' AND status != '3'";
        $qryw = $fun->SelectFromTable($query);
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $qryw
        );
    }else if( $action == "senMail" ){
        $temp_pass = rand(11111, 99999);
        $input['password'] = md5($temp_pass);
        $input['email_id'] = $data->data->email;
        
        $query = "SELECT * FROM users WHERE `email_id` = '".$input['email_id']."' ";
        $qryw = $fun->SelectFromTable($query);
        
        if( count($qryw) == 1 ){
            $val = mail( $input['email_id'], "my sub", "12345");
            
            
            
            $update_password = $fun->UpdateTable('users',$input,'email_id');

            $response = array(
                'code' => 200,
                'status' => 'OK'
            );
        }else{
           $response = array(
                'code' => 400,
                'status' => 'Error'
            );           
        }
    }else if( $action == "edit" ){
        $id = $data->data->id;
        $query = "SELECT * FROM `users` WHERE id = '".$id."'";
        $query1 = "SELECT * FROM `address` WHERE user_id = '".$id."'";
        
        $qryw = $fun->SelectFromTable($query);
        $qryw1 = $fun->SelectFromTable($query1);
        
        $result = array();
        $result['id']     = $qryw[0]['id'];
        $result['name']     = $qryw[0]['name'];
        $result['phone']    = $qryw[0]['mobile'];
        $result['email']    = $qryw[0]['email_id'];
        $result['emp_id']   = $qryw[0]['emp_id'];
        $result['id_no']    = $qryw[0]['id_no'];
        $result['address']  = $qryw1[0]['address'];
        $result['city']     = $qryw1[0]['city'];
        $result['pincode']  = $qryw1[0]['pincode'];
        $result['district'] = $qryw1[0]['district'];
        $result['res_id'] = $qryw1[0]['id'];
        $result['state']         = $qryw1[0]['state'];
        $result['country']       = $qryw1[0]['country'];
        $result['corpaddress']   = $qryw1[1]['address'];
        $result['corpcity']      = $qryw1[1]['city'];
        $result['corpdistrict']  = $qryw1[1]['pincode'];
        $result['corppincode']   = $qryw1[1]['district'];
        $result['corpstate']     = $qryw1[1]['state'];
        $result['corpcountry']   = $qryw1[1]['country'];
        $result['corp_id']       = $qryw1[1]['id'];
        
        $response = array(
            'code' => 200,
            'status' => 'OK',
            'data' => $result
        );
        
    }else if( $action == "update" ){
       
        $input['name'] = $data->data->name;
        $input['mobile'] = $data->data->phone;
        $input['email_id'] = $data->data->email;
        $input['emp_id'] = $data->data->emp_id;
        $input['id_no'] = $data->data->id_no;
        $input['id'] = $data->data->id;
        
        //Residential Address
        $inputRes['address'] = $data->data->address;
        $inputRes['city'] = $data->data->city;
        $inputRes['pincode'] = $data->data->pincode;
        $inputRes['district'] = $data->data->district;
        $inputRes['state'] = $data->data->state;
        $inputRes['country'] = $data->data->country;
        $inputRes['id'] = $data->data->res_id;
        
        //Corporation Address
        $inputcorp['address'] = $data->data->corpaddress;
        $inputcorp['city'] = $data->data->corpcity;
        $inputcorp['pincode'] = $data->data->corppincode;
        $inputcorp['district'] = $data->data->corpdistrict;
        $inputcorp['state'] = $data->data->corpstate;
        $inputcorp['country'] = $data->data->corpcountry;
        $inputcorp['id'] = $data->data->corp_id;
        
        $query = "SELECT * FROM users WHERE (`email_id` = '".$input['email_id']."' OR `mobile` = '".$input['mobile']."') AND id != '".$input['id']."'";
        $qryw = $fun->SelectFromTable($query);
        
        if( count($qryw) == 0 ){
            $update_drivers = $fun->UpdateTable('users',$input,'id');
            if( $update_drivers ){
                $fun->UpdateTable('address',$inputRes,'id');
                $fun->UpdateTable('address',$inputcorp,'id');
            }
            $response = array(
                'code' => 200,
                'status' => 'OK'
            );
        }else{
            $response = array(
                'code' => 400,
                'status' => 'Error',
                'message' => 'User Already Registered!'
            );
        }
    }else if( $action == "changeStatus" ){
        
        $input['status'] = $data->data->currentStatus;
        
        if( $input['status'] == "1"){
            $input['status'] = "0"; 
            $input['user_role'] = $data->data->role;
            $input['id'] = $data->data->id;
        } else {
            $input['status'] = "1"; 
            $input['user_role'] = $data->data->role;
            $input['id'] = $data->data->id;
        }
        
        $fun->UpdateTable('users',$input,'id');
        $response = array(
            'code' => 200,
            'status' => 'OK'
        );
    }else if( $action == "delete" ){
        
        $input['status'] = '3';
        $input['id'] = $data->data->id;
        
        $fun->UpdateTable('users',$input,'id');
        $response = array(
            'code' => 200,
            'status' => 'OK'
        );
    }

echo json_encode($response);
?>