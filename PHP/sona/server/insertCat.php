<?php
include 'config.php';
include 'database_functions.php';

$fun = new DatabaseFunctions();	

function readCSV($csvFile){
    $file_handle = fopen($csvFile, 'r');
    while (!feof($file_handle) ) {
        $line_of_text[] = fgetcsv($file_handle, 1024);
    }
    fclose($file_handle);
    return $line_of_text;
}
 
 
// Set path to CSV file
$csvFile = 'layers.csv';
 
$csv = readCSV($csvFile);

foreach( $csv as $val ){
	$input['code'] = $val[0];
	$input['category'] = $val[1];
	$input['description'] = $val[2];
	$sss = $fun->InsertToTable('layers',$input); 
	if($sss){
		echo $sss;
	}else{
		echo "No";
	}
}