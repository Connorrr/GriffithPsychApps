<!doctype html>
<html>
  <head>
    <title>GoNoGo</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="jspsych.js"></script>
    <script type="text/javascript" src="gng-functions.js"></script>
    <script src="plugins/jspsych-text.js"></script>
    <script src="plugins/jspsych-gng.js"></script>
    <script src="plugins/jspsych-single-stim.js"></script>
    <script src="plugins/jspsych-xyzab.js"></script>
    <link href="css/jspsych.css" rel="stylesheet" type="text/css"></link>
    <style>
			#container {
				width: 1200px;
				display: block;
				margin-left: auto;
				margin-right: auto;
				font-size: 27px;
			}
			#left_div {
				float: left;
				width: max-content;
				margin-right: 15px;
				font-size: 15px;
				padding-left:7em;
			}
			#center_div {
				float: left;
				width: 100%;
				text-align: center;
				font-size: 27px;
			}
			#right_div {
				float: left;
				width: 15%;
				font-size: 27px;
			}
			#stim_p {
				width: 200px;
				height: 200px;
				border: 0px solid black;
			}
	</style>
  </head>
  <body>
  	<div id="container">
		<!-- <table align="center" id="jspsych_target_table" style="width:800px"><br><br><br><br><br><br><br><br><br><br><br><br><br></table> -->
		<!-- <div id="left_div">fff</div> -->
        <div id="left_div">
          <p></p>
        </div>
		<div id="center_div"></div>
	</div>
    <!-- This next section is used to read the total number of participants who have been through the GNG application already -->
    <?php
		$myfile = fopen("DO_NOT_EDIT/Tally.txt", "r") or die("Unable to open file!");
		$char = 'nah';
		$participants;
		while(!feof($myfile)) {
			 	 $char = fgetc($myfile);
				 if (is_numeric($char)){
					 $participants = $char;
				 }
		}
		fclose($myfile);
		//  Write the new number of Participants to the file
		$myfile = fopen("DO_NOT_EDIT/Tally.txt", "w") or die("Unable to open file!");
		if ($participants == 4){
			$txt = 1;
		}else{
			$txt = $participants + 1;
		}
		fwrite($myfile, $txt);
		fclose($myfile);
	?>
  </body>
  <script>
  
  	var tmp_num = <?php Print($participants); ?>;	
	
	//console.log(tmp_num);
	
	setNumParticipants(tmp_num);
	setInitialConditions();
  
  	function getParameterByName(name) {		//Get url parameters
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
  
  	/* Get subject ID from index */
	var subId = getParameterByName('subid');

    /* define welcome message block */
    var welcome_block = {
      type: "text",
      text: "<p>Welcome to the experiment. Press any key to begin</p>"
    };

    /* define instructions block */
    var instructions_block1 = {
      type: "text",
      text: "<div align = \"center\"><p>In this task there will be 10 two digit numbers. Some of these<br>" +
          "numbers are 'good' numbers and some are 'bad' numbers.</p>" +
		  "<p>You will have to learn by trial and error to respond<br>" + 
		  "to the 'good' numbers by pressing the 'Space' bar <br>" +
		  "and by not pressing anything at all for the 'bad' numbers.<br></p>" + 
		  "<p>Towards the start of the experiment you will either be rewarded <br>" +
		  "or punished for your choices. For example, you may be rewarded <br>" +
		  "when you respond with 'Space' to a good number or make no response to a bad number<br>" +
 		  "and at other times you may be punished for responding to <br>" +
		  "a bad number or ignoring a good number. However, <br>" +
		  "towards the final trials you will be both rewarded and punished <br>" +
		  "depending on your choices.</p>" +
		  "<p>Your task is to earn as much money as you can.<br>" +
		  "Note this is theoretical money only!!!</p>" +
		  "<p>You will begin with a bonus of $2.00 and have 18 practice trials<br>" +
		  "to get used to the task and then you will have about 100 test trials.<br>" +
		  "The 'good' and 'bad' numbers on the practice trials<br>" +
		  "are NOT the same as on the test trials.</p>" + 
		  "</div>" +
          "<p>Press any key to begin.</p></div>",
      timing_post_trial: 2000
    };
	
	/* define instructions block */
    var instructions_block2 = {
      type: "text",
      text: "<div align = \"center\"><br><br><p>Thank-you for your time in completing the behavioral task.\n Press the Space Bar when you are ready to complete the Prize Draw survey.</p></div>",
      timing_post_trial: 1000
    };
	
	/* define instructions block */
    var instructions_block3 = {
      type: "text",
      text: "<div align = \"center\"><br><br><p>Press the space bar when you are ready to continue.</p></div>",
      timing_post_trial: 1000
    };
	
	/* define instructions block */
    var instructions_block4 = {
      type: "text",
      text: "<div align = \"center\"><br><br><p>Press the space bar when you are ready to continue.</p></div>",
      timing_post_trial: 1000
    };
	
	// Text Stimuli for Griffith GNGT
	setArray();

    var post_trial_gap = function() {
      return Math.floor( Math.random() * 1500 ) + 750;
    }

    /* define debrief block */

    function getAverageResponseTime() {

      var trials = jsPsych.data.getTrialsOfType('text');

      var sum_rt = 0;
      var valid_trial_count = 0;
      for (var i = 0; i < trials.length; i++) {
        if (trials[i].response == 'go' && trials[i].rt > -1) {
          sum_rt += trials[i].rt;
          valid_trial_count++;
        }
      }
      return Math.floor(sum_rt / valid_trial_count);
    }

    var debrief_block = {
      type: "text",
      text: function() {
        return "<p>Your average response time was <strong>" +
        getAverageResponseTime() + "ms</strong>. Press " +
        "any key to complete the experiment. Thank you!</p>";
      }
    };

    /* create experiment definition array */
	var instructions1 = instructions_block1;
	var blocks = buildBlocks(instructions_block1,instructions_block2);
	var log_text = '';
	console.log(blocks);
    /* start the experiment */
    jsPsych.init({
      display_element: $('#center_div'),
      experiment_structure: blocks, 
      on_finish: function() {
		log_text = gngAsCSV();
		$.post('save_file.php', {
			csvlog: log_text,
			subid: subId
		});
		window.location.href = 'http://griffithbbh.co1.qualtrics.com/SE/?SID=SV_b9kg1hcL7cdBhQh';
      }
    });
  </script>
</html>