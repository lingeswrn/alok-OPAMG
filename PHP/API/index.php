<?php

$todo = $_GET['todo'];

switch($todo){
	case 'login':
		include 'server/login.php';
		break;	
	case 'projects':
		include 'server/projects.php';
		break;	
	case 'equipments':
		include 'server/test.php';
		break;	
	case 'layers':
		include 'server/getLayers.php';
		break;
}
