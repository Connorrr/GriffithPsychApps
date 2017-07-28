<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Progress</title>
</head>
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<body>
	<div id="chart_div"></div>
    
    <script>		//  Get the url parameters
	
		function CSVtoArr (csv) {
			rows  = csv.split('\n');
			fullArr =  rows.map(function (row) {
				return row.split(",").map(Number);
			});
			
			for (i = 0; i < fullArr.length; i++){
				if (fullArr[i].length != fullArr[0].length) {
					fullArr.splice(i);	// remove any rows that arent equal length
				}
			}
			
			return fullArr;
		};
		
		function getParameterByName(name) {		//Get url parameters
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		
		function saveToCSV(day, currPro, planPro, subID) {
			//  If it exists append the new stuff, if not create it
			$.post('save_file.php', {
				csvData: day + ',' + currPro + ',' + planPro + '\n',
				subid: subID
			});	
		}
		
		function drawGraphWithData(graphData) {
		
			//  Display Data
			google.charts.load('current', {packages: ['corechart', 'line']});
			google.charts.setOnLoadCallback(drawCurveTypes);
	
			function drawCurveTypes() {
				  var data = new google.visualization.DataTable();
				  data.addColumn('number', 'X');
				  data.addColumn('number', 'Current Progress');
				  data.addColumn('number', 'Planned Progress');
				  			
				  data.addRows(graphData);
			
				  var options = {
						hAxis: {
						  title: 'Days'
						},
						vAxis: {
						  title: 'Percentage Complete (%)'
						}
				  };
		
				 var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
				 chart.draw(data, options);
			}
			
		}
		
		//  Convert CSV to array
		function csvFileToArray(url){
			//  Get CSV File
			var csv;
			var csvArray;
			$.get(url, function (response) {
				csv = response;
				csvArray = CSVtoArr(csv);
				saveToCSV(csvArray.length/2, currentProgress, plannedProgress, subId)
			})
			.done(function(){
				drawGraphWithData(csvArray);
			});
		}
	  	
		//  Get URL Parameters
		var subId = getParameterByName('subid');
		var currentProgress = getParameterByName('curr');
		var plannedProgress = getParameterByName('plan');
		console.log('SubID = ' + subId + '\n Current Progress = ' + currentProgress + '\n Planned Progress = ' + plannedProgress);
		
		//  Check if csv exists
		$.get(subId + '.csv')
		.done(function() { 		//  Found csv
			console.log('found csv');
			csvFileToArray(subId + '.csv');
		}).fail(function() { 	//  Couldn't find csv
			console.log('creating new csv');
			saveToCSV('0', currentProgress, plannedProgress, subId)
		})
		
		// (Create and) Save new data to the end of the csv
		
		
	</script>
    
</body>
</html>
