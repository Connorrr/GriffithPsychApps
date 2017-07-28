<?php

include 'mysql_conn.php';

$regid = 'test';

//mysql_query("INSERT INTO users_statistics (id_user, timestamp, id_statistic, value) VALUES (\"".mysql_real_escape_string($_POST["userId"])."\")");

if(mysql_num_rows($return) != 0) {
	echo "Found that ID, K?";
}

if (isset($conn) == true) {		//Are we connected
	if (isset($_POST["id"])) {	//Did we recieve an id from the app
		$return = mysql_query("SELECT * FROM RegID WHERE ID = \"".mysql_real_escape_string($_POST["id"])."\"");
		if(mysql_num_rows($return) == 0) {	// Has the ID already been registered
			mysql_query("INSERT INTO RegID (ID) VALUES (\"".mysql_real_escape_string($_POST["id"])."\")");
		}
	}else{
		echo "No Post";
	}
}else{
	echo "No Database";
}


?>