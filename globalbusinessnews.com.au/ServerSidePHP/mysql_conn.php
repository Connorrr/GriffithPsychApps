<?php
//============================================================================= Connect to MySQL =============================================================================
$mysql_ok = false;
$servername = "202.146.213.36";
$username = "connorr_connorrr";
$password = "Mhadmuska69";
$database = "connorr_test";

// Create connection
$conn = new mysqli($servername, $username, $password);

if (@$conn = mysql_connect($servername,$username,$password)) {
	if (@mysql_select_db($database,$conn)) {
		$mysql_ok = true;
		//echo "found the old database";
	}
}

//echo("Is dis even workin?1");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
	//echo("Died!!!!!");
} 

//echo "Connected successfully";


?>