<?php

// Enable error logging: 
error_reporting(E_ALL);

include 'mysql_conn.php';

if (isset($conn) == true) {
	debug_to_console("OK We Connected");
}else{
	debug_to_console("ThaFukkkk!?  No SQL connect!");
}

//Get database IDs from server and store in Array
$sql = mysql_query("SELECT ID FROM RegID");
$userid = array();

while($row_id = mysql_fetch_assoc($sql)){
	array_push($userid, $row_id['ID']);
}

// Message to be sent
$message = $_POST['message'];

// Set POST variables
$url = 'https://android.googleapis.com/gcm/send';     

$fields = array(
                'registration_ids'  => $userid,
                'data'              => array( "message" => $message ),
                );

$headers = array( 
                    'Authorization: key=' . $_POST['apiKey'],
                    'Content-Type: application/json'
                );

// Open connection
$ch = curl_init();

// Set the url, number of POST vars, POST data
curl_setopt( $ch, CURLOPT_URL, $url );

curl_setopt( $ch, CURLOPT_POST, true );
curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );

// Execute post
$result = curl_exec($ch);

// Close connection
curl_close($ch);

echo $result;

//echo var_dump(array($_POST['registrationIDs']));

function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";
    echo $output;
}

?>