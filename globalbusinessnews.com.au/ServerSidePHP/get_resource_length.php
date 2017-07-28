<?php

include 'mysql_conn.php';

if ($conn == true){
	
	//$sql = "SELECT NUM FROM Resources ORDER BY NUM";
	
	//if ($result = mysqli_query($conn, $sql)){
	//	$row_count = mysqli_num_rows($result);
	//	printf("Result set has %d rows.\n", $row_count);
	//	mysqli_free_result($result);
	//}
	
	//mysqli_close($conn);
	
	$query =  "SELECT MAX(`NUM`) FROM `Resources`";
	$query_return = mysql_query($query) or trigger_error(mysql_error()." ".$query);
	while($data = mysql_fetch_assoc($query_return)){
		print_r($data);
	}
}

?>