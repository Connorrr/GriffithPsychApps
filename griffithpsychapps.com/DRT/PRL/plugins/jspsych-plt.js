/*  jspsych-plt.js
 *	Josh de Leeuw
 *  updated Oct 2013
 *
 *  This plugin runs a single plt trial, where X is an image presented in isolation, and A and B are choices, with A or B being equal to X. 
 *	The subject's goal is to identify whether A or B is identical to X.
 *
 *  parameters:
 *      stimuli: array of arrays. each interior array represents the stimuli for a single trial.
 *                  each interior array can be two or three elements. if two elements, then the plugin
 *                  will show the first one as the target (X). if three elements, then the first is X
 *                  the second is A and the third is B. the second is considered the target and the third
 *                  is the foil. this is useful if X and A are not identical, but A is still the correct
 *                  choice (e.g. a categorization experiment where the goal is to pick the item that is 
 *                  in the same category). stimuli can be paths to images, or html strings.
 *      left_key: key code for response associated with image on the left side of the screen.
 *      right_key: key code for right side
 *      timing_x: how long to display X for in ms
 *      timing_plt_gap: how long to show a blank screen in between X and AB in ms.
 *      timing_ab: how long to show the screen with AB in ms. -1 will display until a response is given.
 *      timing_post_trial: how long to show a blank screen after the trial is complete.
 *      is_html: must set to TRUE if the stimuli are HTML strings instead of images.
 *      prompt: an HTML string to display under the AB stimuli, e.g. to remind the subject which keys to use
 *      data: the optional data object
 *
 */

(function($) {
	var this_pError = false;	//This error value copies the trial.pError value and applies it unless the PError trial was incorrectly answered.  This ensures a max of 4 pErrors even with incorrect repeats.
    jsPsych.plt = (function() {
        var plugin = {};
		var a_is_target;
		var block_count = 0;// number of blocks
		var target = "";	//Target Image
		var flanker = "";	//Non Target Image
		var rt = 0;			//Response Time
		var perror = 0;		//number of Probabilistic Errors
        plugin.create = function(params) {

            // the number of trials is determined by how many entries the params.stimuli array has
            var trials = new Array(params.stimuli.length);

            for (var i = 0; i < trials.length; i++) {
                trials[i] = {};
                trials[i].type = "plt";
				trials[i].a_target = params.a_is_target;
				trials[i].pError = params.pError[i];	//Boolean probability array with matching length to stimuli
                trials[i].x_path = params.stimuli[i][0];
				trials[i].pErrorCount = params.pErrorCount;	//Number of Errors per reversal
                // if there is only a pair of stimuli, then the first is the target and is shown twice.
                // if there is a triplet, then the first is X, the second is the target, and the third is foil (useful for non-exact-match plt).
                if (params.stimuli[i].length == 2) {
                    trials[i].a_path = params.stimuli[i][0];
                    trials[i].b_path = params.stimuli[i][1];
                }
                else {
                    trials[i].a_path = params.stimuli[i][1];
                    trials[i].b_path = params.stimuli[i][2];
                }
                trials[i].left_key = params.left_key || 81; // defaults to 'q'
                trials[i].right_key = params.right_key || 80; // defaults to 'p'
                // timing parameters
                trials[i].timing_x = params.timing_x || 1000; // defaults to 1000msec.
                trials[i].timing_plt_gap = params.timing_plt_gap || 1000; // defaults to 1000msec.
                trials[i].timing_ab = params.timing_ab || -1; // defaults to -1, meaning infinite time on AB. If a positive number is used, then AB will only be displayed for that length.
                trials[i].timing_post_trial = params.timing_post_trial || 1000; // defaults to 1000msec.
				trials[i].timing_smile = params.timing_smile || 5000;	//5000 for timeout and any other value to wait for keypress
				trials[i].timing_frown = params.timing_frown || 5000;	//5000 for timeout and any other value to wait for keypress
				//Subject Parameters
				trials[i].subid = params.subid || 0;		//Subject ID
				trials[i].group = params.group;				//Subject group pool
				trials[i].ucode = params.ucode || 0;
                // optional parameters
                trials[i].is_html = (typeof params.is_html === 'undefined') ? false : params.is_html;
                trials[i].prompt = (typeof params.prompt === 'undefined') ? "" : params.prompt;
                trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
				trials[i].reversals = params.reversals;
            }
            return trials;
        };

		var total_incorrect = 0;
        var plt_trial_complete = false;
		var count = 0;
		var corr_count = 0;
		var correct = false; // true when the correct response is chosen
		var prnt_correct = 0;// correct value for data file
		var errors_per_reversal = 0;
		var prob_errors_per_reversal = 0;
		var repeat_flag = false;
		var button_side_text = "";	//String for logfile outlining which side the target is
		
        plugin.trial = function(display_element, block, trial, part) {
            switch (part) {
				
                // the first part of the trial is to show the X stimulus.    
            case 1:
			
				button_side_text = "";
				// start measuring response time
                var startTime = (new Date()).getTime();
				if (repeat_flag){
					this_pError = false;
				}else{
					this_pError = trial.pError;
				}
				if (a_is_target != trial.a_target){
					block_count++;
					errors_per_reversal = 0;
				}
				a_is_target = trial.a_target;
				target = "";
				flanker = "";
				if (a_is_target){
					target = trial.a_path;
					flanker = trial.b_path;
				}else{
					target = trial.b_path;
					flanker = trial.a_path;
				}
				perror = 0;	//printable pError value
				if (this_pError == true){
					perror = 1;
				}
                // randomize whether the target is on the left or the right
                var images = [trial.a_path, trial.b_path];
                var a_left = (Math.floor(Math.random() * 2) === 0); // 50% chance A is on left.
                if (!a_left) {
                    images = [trial.b_path, trial.a_path];
                }
				var l_loaded = false;
				var r_loaded = false;
                // show the options
				
				var onLoaded = function() {
					if (trial.prompt !== "") {
						display_element.append(trial.prompt);
					}
				}

				var r_onload = function(){
                    display_element.append($('<img>', {
                        "src": images[1],
                        "class": 'plt'
                    }));
					r_loaded = true;
				}
				
				var l_onload = function(){
					display_element.append($('<img>', {
                        "src": images[0],
                        "class": 'plt'
                    }));
					l_loaded = true;
				}
				onLoaded();
				r_onload();
				l_onload();

                // if timing_ab is > 0, then we hide the stimuli after timing_ab milliseconds
                if (trial.timing_ab > 0) {
                    setTimeout(function() {
                        if (!plt_trial_complete) {
                            $('.plt').css('visibility', 'hidden');
                        }
                    }, trial.timing_ab);
                }

                // create the function that triggers when a key is pressed.
                var resp_func = function(e) {
                    var flag = false; // true when a valid key is chosen
                    if (e.which == trial.left_key) // 'q' key by default
                    {
						button_side_text = "Left";
                        flag = true;
                        if (a_left && a_is_target) {
							correct = true;
							prnt_correct = 1;
							corr_count++;
						}else if(!a_left && !a_is_target){
							correct = true;
							prnt_correct = 1;
							corr_count++;
                        }else{
							total_incorrect++;
							errors_per_reversal++;
							correct = false;
							prnt_correct = 0;
						}
                    }
                    else if (e.which == trial.right_key) // 'p' key by default
                    {
						button_side_text = "Right";
                        flag = true;
                        if (!a_left && a_is_target) {
                            correct = true;
							prnt_correct = 1;
							corr_count++;
						}else if(a_left && !a_is_target){
							correct = true;
							prnt_correct = 1;
							corr_count++;
                        }else{
							total_incorrect++;
							errors_per_reversal++;
							correct = false;
							prnt_correct = 0;
						}
                    }
                    if (flag) {
                        var endTime = (new Date()).getTime();
                        rt = (endTime - startTime);
                        $(document).unbind('keyup', resp_func); // remove response function from keys
                        display_element.html(''); // remove all
                        plt_trial_complete = true;
                        // move on to the next trial after timing_post_trial milliseconds
                        setTimeout(function() {
							plugin.trial(display_element, block, trial, part + 1);  
                        }, trial.timing_post_trial);
                    }
                };
                $(document).keyup(resp_func);
                break;
				
            case 2:
				count = count + 1;
				// reset this variable to false
                plt_trial_complete = false;
				var is_smiley = false;
				display_element.append("<br><br>");
				var startTime = (new Date()).getTime();
                // how we display the content depends on whether the content is 
                // HTML code or an image path.
                if (!trial.is_html) {
					if (correct && this_pError == false) {
						is_smiley = true;
						display_element.append($('<img>', {
							src: "img/s.jpg",
							"class": 'plt'
						}));
					}else{
						display_element.append($('<img>', {
							src: "img/f.jpg",
							"class": 'plt'
						}));
                    }
                }
                else {
					if (correct && this_pError == false){
						is_smiley = true;
						display_element.append($('<div>', {
							"class": 'plt',
							html: "img/s.jpg"
						}));
					}else{
						display_element.append($('<div>', {
							"class": 'plt',
							html: "img/f.jpg"
						}));
                    }
                }
				
				var frt = 5000;
				var resp_func = function(e) {		// Called on any Key press
					$(document).unbind('keyup', resp_func); // remove response function from keys
					var endTime = (new Date()).getTime();
					frt = endTime - startTime;
					var feedback_data = {
						"Trial Type": "PRLT",
                        "Trial Index": block.data_count,
						"Reversal": trial.reversals,
						"Target": target,
						"Flanker": flanker,
                        "Response Time": rt,
						"PError": perror,								
                        "Correct": prnt_correct,
						"Total Correct": corr_count,
						"Total Incorrect": total_incorrect,
						"Inncorrects/Reversal": errors_per_reversal,
						"Prob Errors/Reversal": trial.pErrorCount,
                        "Key Press": button_side_text,
						"Feedback RT(ms)": frt,
						"Subject ID": trial.subid,
						"Unique Code": trial.ucode,
						"Feedback": trial.group
					};
					block.writeData($.extend({}, feedback_data, trial.data));
					// start a timer of length trial.timing_x to move to the next part of the trial
					setTimeout(function() {
						display_element.html(''); // remove all
						plugin.trial(display_element, block, trial, part + 1);
					}, 1);	//replaced trial.timing_x with 1
				}
				var timeout = 5000;
				var do_timeout = false;
				if (is_smiley){
					if (trial.timing_smile != 5000){
						console.log("Keypress");
						$(document).keyup(resp_func);
					}else{
						console.log("Timer");
						do_timeout = true;
					}
				}else{
					if (trial.timing_frown != 5000){
						console.log("Keypress");
						$(document).keyup(resp_func);
					}else{
						console.log("Timer");
						do_timeout = true;
					}
				}
				if (do_timeout){
					var endTime = (new Date()).getTime();
					frt = 5000;
					var feedback_data = {
						"Trial Type": "PRLT",
                        "Trial Index": block.data_count,
						"Reversal": trial.reversals,
						"Target": target,
						"Flanker": flanker,
                        "Response Time": rt,
						"PError": perror,								
                        "Correct": prnt_correct,
						"Total Correct": corr_count,
						"Total Incorrect": total_incorrect,
						"Inncorrects/Reversal": errors_per_reversal,
						"Prob Errors/Reversal": trial.pErrorCount,
                        "Key Press": button_side_text,
						"Feedback RT(ms)": frt,
						"Subject ID": trial.subid,
						"Unique Code": trial.ucode,
						"Feedback": trial.group
					};
					block.writeData($.extend({}, feedback_data, trial.data));
					// start a timer of length trial.timing_x to move to the next part of the trial
					setTimeout(function() {
						display_element.html(''); // remove all
						plugin.trial(display_element, block, trial, part + 1);
					}, timeout);	//replaced trial.timing_x with timeout
				}
                break;

                // the second part of the trial is the gap between X and AB.
			
			case 3:
                // remove the x stimulus
                $('.plt').remove();
				display_element.html(''); // remove all
                // start timer
                setTimeout(function() {
					if(correct){
						repeat_flag = false;
						block.next();
					}else{
						repeat_flag = true;
						block.repeat();
					}
                }, trial.timing_plt_gap);
                break;

                // the third part of the trial is to display A and B, and get the subject's response

            }
        };

        return plugin;
    })();
})(jQuery);