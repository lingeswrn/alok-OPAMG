<?php

     $target_dir = "./upload/";
     $name = $_POST['name'];
     
     $target_file = $target_dir . strtotime(Date("Y-m-d H:i:s")) * 1000 . "-".basename($_FILES["file"]["name"]);

     move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);

	echo strtotime(Date("Y-m-d H:i:s")) * 1000 . "-".basename($_FILES["file"]["name"]);
?>