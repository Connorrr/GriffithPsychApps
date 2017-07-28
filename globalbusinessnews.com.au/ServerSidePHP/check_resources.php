<?php

include 'mysql_conn.php';

//  Uses the two POST catagories to return a row and column value from the resource table

if (isset($conn) == true) {		//Are we connected
	$query =  "SELECT * FROM `Resources` WHERE `NUM` = \"".mysql_real_escape_string($_POST["row"])."\"";
	$query_return = mysql_query($query) or trigger_error(mysql_error()." ".$query);
	$row = mysql_fetch_array($query_return);
	$result = $row[mysql_real_escape_string($_POST["column"])];
	print_r($result);
}else{
	echo "0";
}


?>