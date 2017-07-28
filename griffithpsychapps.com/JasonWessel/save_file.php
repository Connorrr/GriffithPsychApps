<?php
	// set the default timezone to use. Available since PHP 5.1
	date_default_timezone_set('UTC');
	$curr_time = date('y-m-d-H-i-s');

	$contents = $_POST["csvData"];
	$subID = $_POST["subid"];

	$file = $subID.'.csv';
	// Open the file to get existing content
	$current = file_get_contents($file);
	// Append a new person to the file
	$current .= $contents;
	// Write the contents back to the file
	file_put_contents($file, $current);
?>