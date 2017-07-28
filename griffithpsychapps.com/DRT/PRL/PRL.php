<!doctype html>
<html>

    <head>
        <title>PRL</title>
        <!-- jQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <!-- jsPsych -->
        <script src="jspsych.js"></script>
		<script src="plugins/jspsych-text.js"></script>
        <script src="plugins/jspsych-plt.js"></script>
		<script src="plugins/jspsych-ab.js"></script>
		<!-- Dropbox -->
		<script src="https://www.dropbox.com/static/api/dropbox-datastores-1.0-latest.js"></script>
		
        <!-- style -->
		
        <style>
            #jspsych_target {
                margin: 14% 25% 20% 20%;
                font-size: 25px;
                text-align: center;
            }
            #instructions {
                text-align: center;
				position:relative;
            }
			
			#myinnercontainer { 
				position:absolute; 
				top:50%; height:10em; 
				margin-top:-1em;
				font-size:20px;
			}
			
            pre {
                text-align: left;
				font-size:20px;
            }
            img {
                width: 150px;
                margin: 30px;
            }
        </style>
    </head>

    <body>
        <div id="jspsych_target"></div>	
    </body>

    <script type="text/javascript">
		//Initial Instructions
		var instructions = '<div id="instructions">The task you are about to participate in examines the effects of feedback on \
            learning. During this task you will be presented with two abstract patterns that will appear on your \
			screen simultaneously. One of these patterns is &lsquo;correct&rsquo;according to a predetermined rule while the other is &lsquo;incorrect&rsquo;.  \
			For each pair of abstract patterns you are to choose which pattern is correct. Indicate your answer \
			by pressing the Z key on your keyboard to indicate that the left pattern is \
			correct and the / key on your keyboard to indicate that the right pattern \
			is correct. Correct answers will be indicated by the appearance of a green smiley \
			face on your screen and incorrect answer will be indicated by the appearance of \
			a red frown face on your screen. However, the feedback you get will not always \
			be correct.</div>';		
			
		var goodbye_block = '<div id="goodbye">Thank you for completing this task!  Please click on the following link to complete the next survey.\
		<a href="http://griffithbbh.co1.qualtrics.com/SE/?SID=SV_agTu9pRwSRx7ncV" target="_blank"><br><br>Back to Survey!</a> </div>';
		
		var subId = getParameterByName('subid');
		var uCode = getParameterByName('ucode');
		var group = getParameterByName('group'); //With sequential subject Ids this will break people into groups 0, 1, 2.
		var group_text = "";
		var smile_time = 0;
		var frown_time = 0;
		if (group == 2){
			console.log("Fixed Frown");
			group_text = "FixedFrown";
			smile_time = 1;
			frown_time = 5000;
			instructions += '<p>When the green smiley face appears on your screen, press any key to move onto the next trial when you are ready. When the red frown face appears on your screen you will have to wait a short time until the task continues onto the next trial.</p><p>Press Enter to Begin</p>';
		}else if(group == 1){
			console.log("Fixed Smile");
			group_text = "FixedSmile";
			smile_time = 5000;
			frown_time = 1;
			instructions += '<p>When the red frown face appears on your screen, press any key to move onto the next trial when you are ready. When the green smiley face appears on your screen you will have to wait a short time until the task continues onto the next trial.</p><p>Press Enter to Begin</p>';
		}else{
			console.log("Unfixed feedback");
			group_text = "UnfixedFeedback";
			smile_time = 1;
			frown_time = 1;
			instructions += '<p>When the green smiley face or red frown face appears on your screen, press any key to move onto the next trial when you are ready.</p><p>Press Enter to Begin</p>';
		}
		
		var rnd = Math.floor((Math.random() * 2));
        // declare an array to hold the stimuli
        var stimuli = [];

        for (var i = 1; i <= 4; i++) {
            stimuli.push("img/" + i + ".jpg");
        }
		
		stmuli = shuffle(stimuli);
		
		stimuli.push("img/s.jpg");
		stimuli.push("img/f.jpg");
		
		function getParameterByName(name) {		//Get url parameters
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		
		function getPErrors(no_trials){
			var probErrors = [];	// Array with PError locations
			var numProbErrors = Math.floor(Math.random()*5);
			var probErrorsCopy = [];
			if (numProbErrors == 1){		//create array or size 0 - 4 with probabilistic error locations
				probErrorsCopy.push(getProbReversalPoints(no_trials,99,99,99));
			}else if(numProbErrors == 2){
				probErrorsCopy.push(getProbReversalPoints(no_trials,99,99,99));
				probErrorsCopy.push(getProbReversalPoints(no_trials,probErrors[0],99,99));
			}else if(numProbErrors == 3){
				probErrorsCopy.push(getProbReversalPoints(no_trials,99,99,99));
				probErrorsCopy.push(getProbReversalPoints(no_trials,probErrors[0],99,99));
				probErrorsCopy.push(getProbReversalPoints(no_trials,probErrors[0],probErrors[1],99));
			}else if(numProbErrors == 4){
				probErrorsCopy.push(getProbReversalPoints(no_trials,99,99,99));
				probErrorsCopy.push(getProbReversalPoints(no_trials,probErrors[0],99,99));
				probErrorsCopy.push(getProbReversalPoints(no_trials,probErrors[0],probErrors[1],99));
				probErrorsCopy.push(getProbReversalPoints(no_trials,probErrors[0],probErrors[1],probErrors[2]));
			}
			probErrorsCopy.sort(function(a, b){return a-b});
			return probErrorsCopy;
		}
		
		function getProbReversalPoints(numTrials, ex1, ex2, ex3){
			var num = Math.floor(Math.random()*(numTrials + 1));
			if (num == ex1 || num == ex2 || num == ex3){
				num = getProbReversalPoints(numTrials, ex1, ex2, ex3);
			}
			return num;
		}
		
		
		function getStim(no_trials, f_stim, s_stim){	//Returns plugin Readable Stimulus Array
			console.log(no_trials);
			var stim_pairs = [];
			for (var i = 0; i < no_trials; i++) {
				stim_pairs = [];  // randomly choose the two stimuli we will show to subject
				var rand_num = Math.floor(Math.random() * stimuli.length);
				console.log(stimuli[f_stim] + stimuli[s_stim]);
				var first_stim = stimuli[f_stim];
				var second_stim = stimuli[s_stim];
				// add the pair
				stim_pairs.push([first_stim, second_stim]);
			}
			console.log("StimPairs: " + stim_pairs);
			return stim_pairs;
		}
		
		function getPErrorLocations(no_trials, error_locs){	//Takes the number of Trials and Array from getPErrors and places it into a plugin readable array
			var peStep = 0;
			var PEArr = [];
			for (var i = 0; i < no_trials; i++) {
				if (error_locs[peStep] == i){	//If current location needs a PE error, add it.
					PEArr.push(true);
					peStep++;
				}else{
					PEArr.push(false);
				}
			}
			return [PEArr, peStep];
		}
		
		function shuffle(array) {
			  var currentIndex = array.length
				, temporaryValue
				, randomIndex
				;

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
		
		//creat text block
		var instruction_block = {
			type: "text",
			text: [instructions],
			timing_post_trial: 750
		};
		
		var pairs2 = [];
		var pairs3 = [];

		var first_stim = stimuli[0];
		var second_stim = stimuli[1];
		var third_stim = stimuli[2];
		var fourth_stim = stimuli[3];
		pairs2.push([first_stim, second_stim]);
		pairs3.push([third_stim, fourth_stim]);
				
        var ab_block = {
            type: "ab",
            stimuli: pairs2,
            prompt: "<p>The following two patterns will be used in the next test.<br>Remember use the 'z' and '/' keys to respond.<br>Press the space bar to begin!</p>",
			left_key: 32,
			right_key: 32,
			block: 1
        };
		
		var ab_block2 = {
            type: "ab",
            stimuli: pairs3,
            prompt: "<p>The following two patterns will be used in the next test.<br>Remember use the 'z' and '/' keys to respond.<br>Press the space bar to begin!</p>",
			left_key: 32,
			right_key: 32,
			block: 2
        };
		
		var num_blocks1 = 10;		//  Number of reversals
		var num_blocks2 = 10;		//  Number of reversals
		function buildStimBlocks(){
			var structure = [];
			structure.push(instruction_block);
			structure.push(ab_block);
			var target = (Math.floor(Math.random() * 2) === 0);
			var error_loc1 = [];
			var error_loc2 = [];
			for (var i = 0; i < num_blocks1; i++){				// Loop for building the first block
				var n_trials = Math.floor(Math.random()*5)+10; 	// how many trials per block
				error_loc1 = getPErrors(n_trials);
				error_loc2 = getPErrorLocations(n_trials, error_loc1);
				console.log("Error Locations:  " + error_loc2[0]);
				console.log("Errors:  " + error_loc2[1]);
				var pairs = [];
				for (var j = 0; j < n_trials; j++){
					var first_stim = stimuli[0];
					var second_stim = stimuli[1];
					pairs.push([first_stim, second_stim]);
				}
				// create free-sort block for jspsych
				var plt_block = {
					type: "plt",
					stimuli: pairs,
					a_is_target: target,
					pError: error_loc2[0],
					pErrorCount: error_loc2[1],
					timing_plt_gap: 200,
					timing_x: 700,
					timing_post_trial: 1,
					left_key: 90,
					right_key: 191,
					timing_smile: smile_time,
					timing_frown: frown_time,
					subid: subId,
					ucode: uCode,
					group: group_text,
					reversals: i
				};
				structure.push(plt_block);
				console.log(structure[i]);
				target = !target;
			}
			structure.push(ab_block2);
			for (var i = 0; i < num_blocks2; i++){				//Loop for building the second block
				var n_trials = Math.floor(Math.random()*5)+10; 	// how many trials per block
				//n_trials = 2;
				error_loc1 = getPErrors(n_trials);
				error_loc2 = getPErrorLocations(n_trials, error_loc1);
				console.log("Error Locations:  " + error_loc2[0]);
				console.log("Errors:  " + error_loc2[1]);
				var pairs = [];
				for (var j = 0; j < n_trials; j++){
					var first_stim = stimuli[2];
					var second_stim = stimuli[3];
					pairs.push([first_stim, second_stim]);
				}
				// create free-sort block for jspsych
				var plt_block = {
					type: "plt",
					stimuli: pairs,
					a_is_target: target,
					pError: error_loc2[0],
					pErrorCount: error_loc2[1],
					timing_plt_gap: 200,
					timing_x: 700,
					timing_post_trial: 1,
					left_key: 90,
					right_key: 191,
					timing_smile: smile_time,
					timing_frown: frown_time,
					subid: subId,
					ucode: uCode,
					group: group_text,
					reversals: i
				};
				structure.push(plt_block);
				console.log(structure[i]);
				target = !target;
			}
			return structure;
		}
		var experiment_str = buildStimBlocks();
		
		var dropText = '';
        // preload images
        // call start() when loading is complete
        jsPsych.preloadImages(stimuli, start);
		
        // launch jspsych experiment
        function start() {
            jsPsych.init({
                display_element: $('#jspsych_target'),
                experiment_structure: experiment_str,
                on_finish: function(data) {
                    $('#jspsych_target').append($("<pre>", {
						html: goodbye_block
                    }));
                    dropText = jsPsych.dataAsCSV();
					var client = new Dropbox.Client({ 
						key: "8bjveoj43jae04p",
						secret: "ir0xw6b04wybbw6",
						token: "7jUgzVPs3qEAAAAAAAAAJyFfNkVuxViLzS5qAhISDnnabmpzQEFuZlOWcMBhE2kq"
					});
            		var options = {
            			noOverwrite: true
            		};
                    function doDropFile() {
                        client.writeFile('PRL.csv', dropText, options, function (error) {
                        });
                    }
            
                    // Try to complete OAuth flow.
                    client.authenticate({ interactive: false }, function (error, client) {
                    });
            
                    if (client.isAuthenticated()) {
                        doDropFile();
                    }
                }
            });
        }
    </script>

</html>