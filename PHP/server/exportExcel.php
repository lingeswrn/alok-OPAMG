<?php  
  include 'config.php';
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS);  
mysqli_select_db($conn, DB_NAME);  
  
 $proj_id = $_GET['id'];
 
$setSql = "SELECT * FROM `measurement` WHERE project_id = '".$proj_id."'";  
$setRec = mysqli_query($conn, $setSql);  
  
$columnHeader = '';  
$columnHeader = "Sr NO" . "\t" . "CH" . "\t" . "BACK SITE" . "\t" . "INTERMEDIATE SITE" . "\t" . "FORE SITE" . "\t". "HIGHT OF INSTRUMENT" . "\t". "LAYER LIBRARY" . "\t". "REMARKS" . "\t". "ADJ." . "\t". "ADJ. RL" . "\t". "LATITUDE" . "\t". "LONGITUDE" . "\t". "NORTHING" . "\t". "EASTING" . "\t". "OFFSET LENGTH" . "\t". "MEASUREMENT OFFSET" . "\t". "Measurement by chainage" . "\t";  
  
$setData = '';  
  
while ($rec = mysqli_fetch_row($setRec)) {  
    $rowData = '';  
    foreach ($rec as $value) {  
        $value = '"' . $value . '"' . "\t";  
        $rowData .= $value;  
    }  
    $setData .= trim($rowData) . "\n";  
}  
  
  
header("Content-type: application/octet-stream");  
header("Content-Disposition: attachment; filename=User_Detail_Reoprt.xls");  
header("Pragma: no-cache");  
header("Expires: 0");  
  
echo ucwords($columnHeader) . "\n" . $setData . "\n";  
  
?> 