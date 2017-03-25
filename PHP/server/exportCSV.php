<?php
$conn = mysql_connect("localhost","root","");
mysql_select_db("alok",$conn);

$filename = "toy_csv.csv";
$fp = fopen('php://output', 'w');

	
header('Content-type: application/csv');
header('Content-Disposition: attachment; filename='.$filename);
fputcsv($fp, $header);

$num_column = count($header);		
$query = "SELECT * FROM projects";
$result = mysql_query($query);
while($row = mysql_fetch_row($result)) {
	fputcsv($fp, $row);
}
exit;
?>