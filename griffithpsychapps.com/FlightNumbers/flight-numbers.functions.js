var order = [1,2,3];
var order2 = [1,2,3];
var counter = 0;					// Counter used to show which trial we are on
var csvArray = [];	
var audioArray = ["Practice.m4a","Condition 1 CBH-01.m4a","Condition 1 CBH-02.m4a","Condition 1 CBH-03.m4a","Condition 2 AH-01.m4a","Condition 2 AH-02.m4a","Condition 2 AH-03.m4a"];
var orderedAudio = ["","","","","","",""];
var log_text = "";	
var subId = "";
var rowCount = 120;

function getScreenWidth(){
	var width = $(window).width();
	return width;
}

function initTable(){
	subId = getParameterByName('subid');
	console.log(subId);
	for (var i = 0; i < rowCount; i++){
		newRow(i);
	}
	
	setAudioOrder();

	fillArray();			//Sets up CSV Array
	removeListeners();
	initCanvas();
	initAudio();
}

function initCanvas(){
	//hidePlayer();
	removeListeners();
	//showContinue();
	drawBackgroundImage('A2.png');
}

function initAudio(){
	hideContinue();
	hidePlayer();
	var audio = document.getElementById("audio-player");		// get audio playe
	var source = document.getElementById('audio-source');		// get source
	var sourceString = "sound/" + orderedAudio[counter];			//file path
	console.log(sourceString);
	source.src=sourceString;									// Apply fname
	audio.load();			// load audio
	audio.play(); 			// play	
}

function saveAndContinue(){		//  Save the data and pic and move onto the next step
	removeListeners();
	resetCheckBoxes();
	resetTextFields();
	if (counter != 0){
		saveImg(counter);				// Save the currentedited canvas
		print2dArray();
		saveCSV();
	}else{
		//clearCanvas();
	}
	counter++;					// Step to next trial
	startTrial();
}

function startTrial(){
	if (counter < 7){
		//showPlayer();
		if (counter == 1) drawBackgroundImage('A2.png');
		if (counter == 4) drawBackgroundImage('A2-blank.png');
		initAudio();
	}else{
		window.location.href = 'http://griffithbbh.co1.qualtrics.com/SE/?SID=SV_4NRXa5q63ptLAAB';
		hideContinue();
		//print2dArray();
		//saveCSV();
	}
}

function playFinished() {
	hidePlayer();
	addListeners();
	showContinue();
	//if (counter != 0) setDrawBackground();
	//drawBackgroundImage('A2-blank.png');
}

function imgWidth(){
	return document.getElementById("aeroImg").width;	
}
		
function imgHeight(){
	return document.getElementById("aeroImg").height;	
}
		
function addCheckBoxes(cell, n){
	for (var i = 0; i < 10; i++){
		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.name = "name";
		checkbox.value = "value";
		checkbox.id = "cb_" + n + "_" + i;
		cell.appendChild(checkbox);
	}
}
		
function addInputTextBox(cell, n){
	var inputText = document.createElement('input');
	inputText.type = 'text';
	inputText.value="";
	inputText.size="17";
	inputText.id = "mI_" + n;
	inputText.style.width = "100%";
	inputText.style.height = "100%";
	cell.appendChild(inputText);
}
		
function newRow(n) {
	var table = document.getElementById("checkTable");
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	addInputTextBox(cell1, n);
	addCheckBoxes(cell2, n);
}
		
window.onresize = function(event) {
	var x = (getScreenWidth() - 1050)/2;
	if (x > 176) {
		document.getElementById("left-padding").style.width = x + "px";
	}
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function showContinue(){
	document.getElementById("clr").style.display="block";	
}

function hideContinue(){
	document.getElementById("clr").style.display="none";	
}

function showPlayer(){
	document.getElementById("audio-player").style.display="block";	
}

function hidePlayer(){
	document.getElementById("audio-player").style.display="none";	
}

function clearCanvas(){
	ctx.clearRect(0, 0, w, h);
}

function drawBackgroundImage(fName){
	var img = document.getElementById("canvasImg");
	
	base_image.src = fName;
	base_image.id = 'canvasImg';
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0);
	}
}

function saveCSV(){
	$.post('save_file.php', {
		csvlog: log_text,
		subid: subId
	});
}

function resetCheckBoxes(){
	var csvCol = counter + counter - 1;
	var checkCounter = 0;
	for (var i = 0; i < rowCount; i++){
		var tmp = [];
		tmp = csvArray[i+1];
		for (var j = 0; j < 10; j++){
			if (document.getElementById("cb_" + i + "_" + j).checked == true){
				checkCounter++;
				if (counter == 0 || counter == 3) document.getElementById("cb_" + i + "_" + j).checked = false;
			}
		}
		if (checkCounter != 0){
			tmp[csvCol]=checkCounter;
			if (counter != 0){
				csvArray[i+1] = tmp;
			}
		}
		checkCounter = 0;
	}
}


function resetTextFields(){
	var tmp = [];
	var csvCol = counter + (counter - 2);
	for (var i = 0; i < rowCount; i++){
		tmp = csvArray[i+1];
		if (document.getElementById("mI_" + i).value != ""){
			tmp[csvCol] = document.getElementById("mI_" + i).value;
			if (counter != 0){
				csvArray[i+1] = tmp;
			}
			if (counter == 0 || counter == 3) document.getElementById("mI_" + i).value = "";
		}
	}
}

function fillArray(){
	//console.log("Edit1");
	var rows = rowCount+1;
	var row = ["","","","","","","","","","","",""];
	for (var i = 0; i < rows; i++){
		csvArray[i] = ["","","","","","","","","","","",""];
	} 
	row = ["C1 Movement Identifier " + order[0], "Count", "C1 Movement Identifier " + order[1], "Count", "C1 Movement Identifier " + order[2], "Count", "C2 Movement Identifier " + order2[0], "Count", "C2 Movement Identifier " + order2[1], "Count", "C2 Movement Identifier " + order2[2], "Count"];
	csvArray[0]=row;
}

function print2dArray(){
	var rowString = "";
	log_text = "";
	for (var i = 0; i < csvArray.length; i++){
		for (var j = 0; j <csvArray[i].length; j++){
			rowString += csvArray[i][j] + ", ";
		}
		rowString += "\n"; 
		log_text += rowString;
		//console.log(rowString); 
		rowString = "";
	}
}

function getParameterByName(name) {		//Get url parameters
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function changeVolume(input){
	var vol = input / 100;
	var audio = document.getElementById("audio-player");	
	audio.volume = vol;	
}

function setAudioOrder(){
	shuffle(order); shuffle(order2);
	orderedAudio[0] = audioArray[0];
	orderedAudio[1] = audioArray[order[0]];
	orderedAudio[2] = audioArray[order[1]];
	orderedAudio[3] = audioArray[order[2]];
	orderedAudio[4] = audioArray[order2[0]+3];
	orderedAudio[5] = audioArray[order2[1]+3];
	orderedAudio[6] = audioArray[order2[2]+3];
}