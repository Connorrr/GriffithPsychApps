<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Flight Numbers</title>
<style>
	
	.mouseDown{
	 	cursor: progress;
	}
	
	#main_container{
		width:100%;
		height:850px;
		border:1px solid gray;
		background-color:#777777;
		border-radius: 12px;
    	position: relative;
		min-width: 1050px;
	}
	
	#left-padding{
		float:left;
		width: 25%;
		color: #777777;
		display:inline-block;
	}
	
	#imgDiv{
		float: left;
		height:830px;
		width:599px;
	}
	
	#outerCheckBox{
		float: left;
		width: 480px;
		height: 820px;
		border-radius: 12px;
    	position: absolute;
	}
	
	#can {
		position: absolute;
	}
	
	table, th, td {
		border: 1px solid black;
		border-collapse: collapse;
	}
	th, td {
		padding: 10px;
	}

</style>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
</head>
<script src="CursorDraw.js"></script>
<script src="flight-numbers.functions.js"></script>
<body onload="init(); initTable(); getScreenWidth();">
<div id="main_container">
	<span id="left-padding"> 
    	<img src = "griffith-logo-g7.png"> </img>
    </span>
	<span id="imgDiv">
    	<canvas id="can" height="820px" width="599px"> </canvas>
    	<!-- <img id="aeroImg" src="A2.png" alt="A1" align="top"> -->
  	</span>
    
    <span id="outerCheckBox">
    	<!--
    	<input type="text" id="flightNumberText" value="" size="17" onkeydown="if (event.keyCode == 13) document.getElementById('okButton').click()" placeholder="Flight Number">
        <input type="button" id="okButton" onclick="addBox()" value="OK"><br>
        -->
        <div style="overflow:scroll;height:780px;width:100%;overflow:auto;border: 1px solid black;">
            <table id="checkTable" style="width:100%">
                <col width="50%">
                <col width="50%">
                <tr>
                    <th> Movement Identifier </th>
                    <th> Checkbox for each instruction and each readback heard </th>
                </tr>
            </table>
        </div>
        <div id="hidden-audio" style="visibility: hidden">
            <audio controls id = "audio-player" onended="playFinished()">
                <source id = "audio-source" src="sound/Practice.m4a" type="audio/mpeg">
            </audio>
        </div>
        <br>
        <input type="button" value="Continue" id="clr" size="23" onclick="saveAndContinue()" >
        
		<input type="range" id="volume" value="100" oninput="changeVolume(this.value)"> Volume
    </span>
    
</div>


<p>&nbsp;</p>
</body>
</html>
