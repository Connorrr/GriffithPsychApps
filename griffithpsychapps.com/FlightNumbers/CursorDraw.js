/* In HTML create a canvas with the id 'can'.  This canvas will be used as the drawing canvas.
The following HTML code should be used to to place an erasor icon:
	<div style="position:absolute;top:20%;left:43%;">Eraser</div>
    <div style="position:absolute;top:22%;left:45%;width:15px;height:15px;background:white;border:2px solid;" id="white" onclick="color(this)"></div>
*/
var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "red",
    y = 2;
	
var dataURL;

var base_image = new Image();

var subId = "eh";

function init() {
    canvas = document.getElementById('can');
	subId = getParameterByName('subid');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
	
	base_image.src = 'A2.png';
	base_image.id = 'canvasImg';
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0);
	}
	
	addListeners();
}

var mouseDownFunc = function(e){
	e.preventDefault();
	findxy('down', e);
}

var mouseMoveFunc = function(e){
	findxy('move', e)
}

var mouseUpFunc = function(e){
	findxy('up', e)
}

var mouseOutFunc = function(e){
	findxy('out', e)
}

function addListeners() {
	canvas.addEventListener("mousemove", mouseMoveFunc, false);
	canvas.addEventListener("mousedown", mouseDownFunc, false);
	canvas.addEventListener("mouseup", mouseUpFunc, false);
	canvas.addEventListener("mouseout", mouseOutFunc, false);
}

function removeListeners() {
	canvas.removeEventListener("mousemove", mouseMoveFunc, false);
	canvas.removeEventListener("mousedown", mouseDownFunc, false);
	canvas.removeEventListener("mouseup", mouseUpFunc, false);
	canvas.removeEventListener("mouseout", mouseOutFunc, false);
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 2;

}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft - 10;
        currY = e.layerY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft - 10;
            currY = e.layerY - canvas.offsetTop;
            draw();
        }
    }
}// JavaScript Document

function saveImg(counter) {
	dataURL = canvas.toDataURL();
	$.ajax({
	  type: "POST",
	  url: "canvas-upload.php",
	  data: { 
		 img: dataURL,
		 subid: subId,
		 count: counter
	  }
	}).done(function(o) {
	  //console.log('saved'); 
	  // If you want the file to be visible in the browser 
	  // - please modify the callback in javascript. All you
	  // need is to return the url to the file, you just saved 
	  // and than put the image in your browser.
	});

}

function setDrawBackground(){
	base_image.src = dataURL;
	base_image.id = 'canvasImg';
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0);
	}
}

function getParameterByName(name) {		//Get url parameters
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}