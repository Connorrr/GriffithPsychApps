<?php
//============================================================================= Connect to MySQL =============================================================================
$mysql_ok = false;
$servername = "202.146.213.36";
$username = "connorr_connorrr";
$password = "Mhadmuska69";

// Create connection
$conn = new mysqli($servername, $username, $password);

debug_to_console("Is dis even workin?");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
	debug_to_console("Died!!!!!");
} else{
	debug_to_console("OK, so we connected inside the mysql_conn, include");
}

echo "Connected successfully";

function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

    echo $output;
}


?>