<?php
include 'config.php';
session_start();
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if( !empty($_SESSION) ){
		
		echo json_encode( array('code' => 200, 'data' => $_SESSION));
}else{
        echo json_encode( array('code' => 400, 'data' => $_SESSION));
    }


