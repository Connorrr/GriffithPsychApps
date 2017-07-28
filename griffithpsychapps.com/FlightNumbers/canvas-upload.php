<?php
	// requires php5
	date_default_timezone_set('UTC');
	$curr_time = date('y-m-d-H-i-s');
	
	define('UPLOAD_DIR', 'images/');
	$img = $_POST['img'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$count = $_POST['count'];
	$data = base64_decode($img);
	$subID = $_POST["subid"];
	$file = UPLOAD_DIR . 'Flight-' . $subID . '-' . $count . '-' . $curr_time . '.png';
	$fileSize = filesize($file);
	$test = 10;
	echo("<script>console.log('PHP: ".$file."');</script>");
	$success = file_put_contents($file, $data);
?>