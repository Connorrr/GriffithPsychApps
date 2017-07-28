<?php

include 'mysql_conn.php';

if (isset($conn) == true) {
	echo ("OK We Connected");
}else{
	echo ("ThaFukkkk!?  No SQL connect!");
	exit();
}

$target_dir = "../res/";
$target_img_file = $target_dir . basename($_FILES["imgfileToUpload"]["name"]);
$target_txt_file = $target_dir . basename($_FILES["txtfileToUpload"]["name"]);
$img_link = $target_dir = "http://globalbusinessnews.com.au/res/".basename($_FILES["imgfileToUpload"]["name"]);
$txt_link = $target_dir = "http://globalbusinessnews.com.au/res/".basename($_FILES["imgfileToUpload"]["name"]);
$imgUploadOk = 1;
$txtUploadOk = 1;
$imageFileType = pathinfo($target_img_file,PATHINFO_EXTENSION);
$txtFileType = pathinfo($target_txt_file,PATHINFO_EXTENSION);

//check img file exists
$img_exists = true;
if(!file_exists($_FILES['imgfileToUpload']['tmp_name']) || !is_uploaded_file($_FILES['imgfileToUpload']['tmp_name'])) {
    $img_exists = false;
	echo "No image file";
}

//check txt file exists
$txt_exists = true;
if(!file_exists($_FILES['txtfileToUpload']['tmp_name']) || !is_uploaded_file($_FILES['txtfileToUpload']['tmp_name'])) {
    $txt_exists = false;
	echo "No Txt File";
}

// Check if image file is a actual image or fake image
if(isset($_POST["submit"]) && $img_exists) {
    $check = getimagesize($_FILES["imgfileToUpload"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $imgUploadOk = 1;
    } else {
        echo "File is not an image.";
        $imgUploadOk = 0;
    }
}

// Check if img file already exists
if (file_exists($target_img_file) && $img_exists) {
    echo "Sorry, img file already exists.";
    $imgUploadOk = 0;
}

// Check if txt file already exists
if (file_exists($target_txt_file) && $txt_exists) {
    echo "Sorry, txt file already exists.";
    $txtUploadOk = 0;
}

// Allow certain img file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "PNG" && $imageFileType != "jpeg"
&& $imageFileType != "gif" && $imageFileType != "JPG" && $img_exists) {
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $imgUploadOk = 0;
}

// Allow certain img file formats
if($txtFileType != "txt" && $txt_exists) {
    echo "Sorry, only .txt files are allowed in this section.";
    $txtUploadOk = 0;
}

$img_uploaded = false;
if($img_exists){
	// Check if $imgUploadOk is set to 0 by an error
	if ($imgUploadOk == 0) {
		echo "Sorry, your img file was not uploaded.";
	// if everything is ok, try to upload file
	} else {
		if (move_uploaded_file($_FILES["imgfileToUpload"]["tmp_name"], $target_img_file)) {
			echo "The file ". basename( $_FILES["imgfileToUpload"]["name"]). " has been uploaded.";
			$img_uploaded = true;
		} else {
			echo "Sorry, there was an error uploading your img file.";
		}
	}
}

$txt_uploaded = false;
if($txt_exists){
	// Check if $txtUploadOk is set to 0 by an error
	if ($txtUploadOk == 0) {
		echo "Sorry, your txt file was not uploaded.";
	// if everything is ok, try to upload file
	} else {
		if (move_uploaded_file($_FILES["txtfileToUpload"]["tmp_name"], $target_txt_file)) {
			echo "The file ". basename( $_FILES["txtfileToUpload"]["name"]). " has been uploaded.";
			$txt_uploaded = true;
		} else {
			echo "Sorry, there was an error uploading your txt file.";
		}
	}
}

echo $img_link;

//  Register filenames in resources table
if ($img_uploaded && !$txt_uploaded){
	mysql_query("INSERT INTO Resources (IMGFILE) VALUES (\"".mysql_real_escape_string($img_link)."\")");
}elseif (!$img_uploaded && $txt_uploaded){
	mysql_query("INSERT INTO Resources (TXTFILE) VALUES (\"".mysql_real_escape_string($txt_link)."\")");
}elseif ($img_uploaded && $txt_uploaded){
	$query = mysql_query("INSERT INTO Resources (IMGFILE, TXTFILE) VALUES (\"".mysql_real_escape_string($img_link)."\", \"".mysql_real_escape_string($txt_link)."\")");
}

echo $query;

?>