<?php

include 'mysql_conn.php';

	if ($conn == true){
		mysql_select_db('Resources', $conn);
		$query =  "SELECT MAX(NUM) FROM `RegID`";
		$query_return = mysql_query($query) or trigger_error(mysql_error()." ".$query);
		echo $query_return;
	}

?>