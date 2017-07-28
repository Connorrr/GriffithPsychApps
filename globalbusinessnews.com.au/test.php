<!doctype html>
<html>
	<?php
		echo "Program Start<br/>";
		/* Desired Curl Command
		curl https://api.spark.io/v1/devices/0123456789abcdef/brew \
		  -d access_token=123412341234 \
		  -d "args=coffee"
		*/     
		// From http://davidwalsh.name/curl-post
		//set POST variables
		$accessToken = "f3c414183340542034c98fe5f0bd8b985e433922";
		$deviceID = "2e0021000e47343432313031";
		$deviceFunction = "alarm";
		$argument = "on";
		$url = 'https://api.spark.io/v1/devices/' . $deviceID . '/' + $deviceFunction ;
		$fields = array(
			'access_token' => urlencode($accessToken),
			'args' => urlencode($argument)
		);
		//url-ify the data for the POST
		$fields_string = "";
		foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
		$fields_string = rtrim($fields_string, '&');
		//open connection
		$ch = curl_init();
		//set the url, number of POST vars, POST data
		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_POST, count($fields));
		curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
		// Disable SSL verification
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		// Will return the response, if false it print the response
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		//execute post
		echo "Executing Curl Operation<br/>";
		$result = curl_exec($ch);
		echo "Curl Result: '" .  $result . "'<br/>";
		//close connection
		curl_close($ch);
		echo "Program End<br/>";
	?>
</html>