var go_but = 191;																	// Button code for GO
var no_go_but = 90;																	// Button code for NOGO
var but_arr = 32;																	// Continue Button
var text_prefix = "<div align = \"center\"><p id=\"stim_p\">" + getBreaks2();		// Attached to the start of stim to place it on the screen
var text_suffix = "</p></div>";														// Attached to the end of stim to place it on the screen
var TRIAL_NUM = 0;																	// Global used to for internal trial number
var START_TIME = (new Date()).getTime();											// Global Start time
var TIME_ELAPSED = (new Date()).getTime() - START_TIME;								// Total Running Time
var LOG_ARRAY = [];																	// Array used for the print out for the csv logfile
var NUM_PARTICIPANTS;																// Get participants from server code
var FIXED_FEEDBACK = false;															// Used to establish if fixed or unfixed feedback
var IS_CONTROL = false;																// Flag used to differentiate between control and experimental condition
var REWARD_FIRST = false;															// Flag used to tell the order of blocks

function setNumParticipants(num){													//  Takes participant num variable from main page
	NUM_PARTICIPANTS = num;
}

function setInitialConditions(){													//  Sets the initial conditions for the experiment
	console.log("participantNo: " + (NUM_PARTICIPANTS % 4));
	if ((NUM_PARTICIPANTS % 4) == 0){
		FIXED_FEEDBACK = true;
		IS_CONTROL = true;		// Punishment Primed
		REWARD_FIRST = false;
	}else if((NUM_PARTICIPANTS % 4) == 1){
		FIXED_FEEDBACK = true;
		IS_CONTROL = false;		// Reward Primed
		REWARD_FIRST = true;
	}else if((NUM_PARTICIPANTS % 4) == 2){
		FIXED_FEEDBACK = false;
		IS_CONTROL = true;		// Punishment Primed
		REWARD_FIRST = true;
	}  //  else: false, false, false
}

function shuffle(array) {
	var tmp, current, top = array.length;
	if(top) while(top--) {
		current = Math.floor(Math.random() * (top + 1));
		tmp = array[current];
		array[current] = array[top];
		array[top] = tmp;
	}
	  return array;
}

var score = 2.00;
function checkScores(is_win){
		if (is_win){
			score = score + 0.10;
		}else{
			score = score - 0.10;
		}
		return score.toFixed(2);
}

function getScore(){
	return score.toFixed(2);	
}

//  returns the string containing the breaks for top of screen
function getBreaks(){
	return "<br><br><br><br><br><br><br><br>";
}

//  returns the string containing the breaks for Stimulus
function getBreaks2(){
	return "<br><br><br>";
}

//  returns the string containing the breaks for Stimulus
function getBreaks3(){
	return "<br><br><br><br>";
}

//Block 1 Stimuli
var a=[];

function setArray(){
	//Build array of 10 random, two digit numbers with no repeats
	for (i=10;i<100;++i) a[i-10]=i;
	a = shuffle(a);
}

function getStim(g, n){		//  g -> number of go stim, n -> number of no-go stim (either 2 or 3)
		setArray();
		var goStim = [];
		var noGoStim = [];
		
		for (var i = 0; i < g; i++){
			goStim.push(a[i].toString());
		}
		
		for (var i = 0; i < n; i++){
			noGoStim.push(a[i+g].toString());
		}
		
		var fullStim = [goStim, noGoStim];
		return fullStim;
}

gngAsCSV = function(append_data) {
	var dataObj = LOG_ARRAY;
	for(var i=0; i < dataObj.length; i++){
		dataObj[i] = $.extend({}, dataObj[i], append_data);
	}
	return JSON2CSV(dataObj);
};

function JSON2CSV(objArray) {
		console.log(objArray);
		var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		var line = '';
		var result = '';
		var columns = [];
	
		var i = 0;
		for (var j = 0; j < array.length; j++) {
			for (var key in array[j]) {
				var keyString = key + "";
				keyString = '"' + keyString.replace(/"/g, '""') + '",';
				if ($.inArray(key, columns) == -1) {
					columns[i] = key;
					line += keyString;
					i++;
				}
			}
		}

		line = line.slice(0, -1);
		result += line + '\r\n';

		for (var i = 0; i < array.length; i++) {
			var line = '';
			for (var j = 0; j < columns.length; j++) {
				var value = (typeof array[i][columns[j]] === 'undefined') ? '' : array[i][columns[j]];
				var valueString = value + "";
				line += '"' + valueString.replace(/"/g, '""') + '",';
			}

			line = line.slice(0, -1);
			result += line + '\r\n';
		}

		return result;
}

function buildBlocks(instructions1, fairwell){
	
	var out_array = [];
	
	//  Set up Practice block
	var tmp = getGandN();		//  Get unique values for the number of go and no-go trials.  Either {2,3}, {3,2} or {3,3}  
	var g = tmp[0];				// num go stim
	var n = tmp[1];				// num no-go stim
	
	var stim = getStim(g,n);	// get proper 2 digit stim values
	
	var prac_block = buildPractice(stim, g);		//  Convert stim into prac block array
	//Finish prac block setup
	
	//Setup Reward block (Same process as Prac)
	tmp = getGandN();
	g = tmp[0];
	n = tmp[1];
	
	stim = getStim(g,n);
	
	var reward_block = buildReward(stim, g, n);
	// Finish reward block setup
	
	//Setup Punishment block (Same process as Prac)
	tmp = getGandN();
	g = tmp[0];
	n = tmp[1];
	
	stim = getStim(g,n);
	
	var punishment_block = buildPunishment(stim, g, n);
	// Finish punishment block setup
	
	//Setup Mixed block (Same process as Prac)
	tmp = getGandN();
	g = tmp[0];
	n = tmp[1];
	
	stim = getStim(g,n);
	
	var mixed_block = buildMixed(stim, g, n);
	// Finish Mixed block setup
	
	//  Build full trials array
	out_array.push(instructions1);
	out_array = addArray(out_array, prac_block);
	//out_array.push(instructions2);
	if (IS_CONTROL) {
		console.log("Punishment Primed");
		out_array = addArray(out_array, punishment_block);
		//out_array.push(instructions3);
		out_array = addArray(out_array, reward_block);
		console.log("Control");
	}else{
		console.log("Reward Primed");
		out_array = addArray(out_array, reward_block);
		//out_array.push(instructions3);
		out_array = addArray(out_array, punishment_block);
		console.log("Experimental");
	}
	//out_array.push(instructions4);
	out_array = addArray(out_array, mixed_block);
	out_array.push(fairwell);
	
	return out_array;
}

function getGandN(){		//Returns an array containg the number of unique go stim and no-go stim in a block. -> {g,n}
	var tmp = [];
	if (Math.random() < 0.34){		//  1/3 chance of 5 stim (3 go 2 nogo)
		tmp.push(3); tmp.push(2);
	}else if(Math.random() < 0.64){	//  1/3 chance of 5 stim (2 go 3 nogo)
		tmp.push(2); tmp.push(3);
	}else{							//  1/3 chance of 6 stim (3 go 3 nogo)
		tmp.push(3); tmp.push(3);
	}
	return tmp;
}

var block_size = 32;						//  Keep as an even number over 4.

function buildPractice(stim, g){			//  stim -> array containing go and nogo stim, g -> num of unique go stim
	var fb = 1;		//  True Feedback
	var pracBlock = [];
	for (var i = 0; i < (block_size/2) ; i++){	//  Add 16 go Stim
		pracBlock.push({type: "gng", text: text_prefix + stim[0][i%g] + "" + text_suffix, go_stim: true, corr_fb: true, feedback: 1, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'go', Stim_no: stim[0][i%g] }, fb_type: fb, block_type: "Practice"});		
	}
	pracBlock.push({type: "gng", text: text_prefix + stim[1][0] + "" + text_suffix, go_stim: false, corr_fb: true, feedback: 1, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'no-go', Stim_no: stim[1][0] }, fb_type: fb, block_type: "Practice"});			// Add 2 nogo stim
	pracBlock.push({type: "gng", text: text_prefix + stim[1][1] + "" + text_suffix, go_stim: false, corr_fb: true, feedback: 1, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'no-go', Stim_no: stim[1][1] }, fb_type: fb, block_type: "Practice"});
	
	pracBlock = shuffle(pracBlock);
	
	return pracBlock;
}

function buildReward(stim, g, n){			//  stim -> array containing go and nogo stim, g -> num of unique go stim, n -> num of unique nogo stim

	var fb = 0;
	var reward_block = [];
	for (var i = 0; i < block_size; i++){		//  Add 16 go Stim and 16 nogo stim
		if (i == 0 || i == 1 || i == 2){
			fb = 2;		// False Positives
		}else if( i == 3 || i == 4 || i == 5 || i == 6 || i == 7 ){
			fb = 0;		// No Feedback
		}else{
			fb = 1;		// True Feedback
		}
		if ( i < block_size/2 ){
			reward_block.push({type: "gng", text: text_prefix + stim[0][i%g] + "" + text_suffix, go_stim: true, corr_fb: true, feedback: 1, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'go', Stim_no: stim[0][i%g] }, fb_type: fb, block_type: "Reward"});	
		}else{
			reward_block.push({type: "gng", text: text_prefix + stim[1][i%n] + "" + text_suffix, go_stim: false, corr_fb: true, feedback: 1, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'no-go', Stim_no: stim[1][i%n] }, fb_type: fb, block_type: "Reward"});
		}
	}
	
	reward_block = shuffle(reward_block);
	
	return reward_block;
}

function buildPunishment(stim, g, n){			//  stim -> array containing go and nogo stim, g -> num of unique go stim, n -> num of unique nogo stim
	var fb;
	var punishment_block = [];
	for (var i = 0; i < block_size; i++){		//  Add 16 go Stim and 16 nogo stim
		if (i == 0 || i == 1 || i == 2){
			fb = 3;		// False Negatives
		}else if( i == 3 || i == 4 || i == 5 || i == 6 || i == 7 ){
			fb = 0;		// No Feedback
		}else{
			fb = 1;		// True Feedback
		}
		if ( i < block_size/2 ){
			punishment_block.push({type: "gng", text: text_prefix + stim[0][i%g] + "" + text_suffix, go_stim: true, corr_fb: true, feedback: 2, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'go', Stim_no: stim[0][i%g] }, fb_type: fb, block_type: "Punishment"});	
		}else{
			punishment_block.push({type: "gng", text: text_prefix + stim[1][i%n] + "" + text_suffix, go_stim: false, corr_fb: true, feedback: 2, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'no-go', Stim_no: stim[1][i%n] }, fb_type: fb, block_type: "Punishment"});
		}
	}
	
	punishment_block = shuffle(punishment_block);
	
	return punishment_block;
}

function buildMixed(stim, g, n){			//  stim -> array containing go and nogo stim, g -> num of unique go stim, n -> num of unique nogo stim
	var fb;
	var mixed_block = [];
	for (var i = 0; i < block_size; i++){			//  Add 16 go Stim and 16 nogo stim
		if (i == 0 || i == 1 || i == 2){
			fb = 4;		// False Feedback
		}else if( i == 3 || i == 4 || i == 5 || i == 6 || i == 7 ){
			fb = 0;		// No Feedback
		}else{
			fb = 1;		// True Feedback
		}
		if ( i < block_size/2 ){
			mixed_block.push({type: "gng", text: text_prefix + stim[0][i%g] + "" + text_suffix, go_stim: true, corr_fb: true, feedback: 3, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'go', Stim_no: stim[0][i%g] }, fb_type: fb, block_type: "Mixed"});
		}else{
			mixed_block.push({type: "gng", text: text_prefix + stim[1][i%n] + "" + text_suffix, go_stim: false, corr_fb: true, feedback: 3, cont_key: but_arr, go_key: go_but, no_go_key:no_go_but, data: { Stim: 'no-go', Stim_no: stim[1][i%n] }, fb_type: fb, block_type: "Mixed"});
		}
	}
	
	mixed_block = shuffle(mixed_block);
	
	return mixed_block;
}

//  Unpacks and adds arr2 to arr1 and returns it
function addArray(arr1, arr2){
	for(var i = 0; i < arr2.length; i++){
		arr1.push(arr2[i]);
	}
	return arr1;
}

//  This function is used to take the Stim Type, Response, Feedback Type
//  and returns and index for appropriate response where:
//  0 - No response, 1 - Correct Response, 2 - Incorrect Response

function getResponseType(is_go_stim, is_key_press, fb_type){
	
	var rtrn = 0;
	
	if (fb_type == 0){						//  No Feedback
		rtrn = 0;
	}else if(fb_type == 1){					//  True Feedback
	
		if (is_go_stim && is_key_press){		//  Correct
			rtrn = 1;
		}if (is_go_stim && !is_key_press){		//  Inorrect
			rtrn = 2;
		}if (!is_go_stim && is_key_press){		//  Incorrect
			rtrn = 2;
		}if (!is_go_stim && !is_key_press){		//  Correct
			rtrn = 1;
		}
		
	}else if(fb_type == 2){					//  False Positives
	
		rtrn = 1;								//  All correct Brah!....  sortof
		
	}else if(fb_type == 3){					//  False Negatives
	
		rtrn = 2;								//  FAAAAIIIILLLL(ish)
		
	}else if(fb_type == 4){					//  False Feedback
		
		if (is_go_stim && is_key_press){		//  Correct
			rtrn = 2;
		}if (is_go_stim && !is_key_press){		//  Inorrect
			rtrn = 1;
		}if (!is_go_stim && is_key_press){		//  Incorrect
			rtrn = 1;
		}if (!is_go_stim && !is_key_press){		//  Correct
			rtrn = 2;
		}
		
	}
	
	return rtrn;	
}