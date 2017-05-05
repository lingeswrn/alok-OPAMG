<?php

$todo = $_GET['todo'];

switch($todo){
	case 'login':
		include 'server/login.php';
		break;	
	case 'projects':
		include 'server/projects.php';
		break;
}
