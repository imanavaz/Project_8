var contents;
var w = 500;
var h = 400;
var resultDiv;
var panelCount=1;
var ax;
var ay;
var dx;
var dy;
var jg;
$( document ).ready(function() {
    
});



function readSingleFile(eve) { //executes when a file is read by "import data" 

    var file = eve.target.files[0];

    if (!file) {
        return;
    }

    var parts = file.name.split('.');
    var fileExt = parts[parts.length - 1];
        
    switch (fileExt.toLowerCase()) {
        case ('csv'):
            processCSV(file);
            return;
        case ('txt'):
            processTXT(file);
            return;
    }
}

function processCSV(f)
{
    Papa.parse(f, {
        dynamicTyping: true,
        header: true,
        //worker: true,
        comments: "#",
        //step: function (row) {//testing features
        //    console.log("Row:", row.data);
        //},
        //step: function(results) {
        //    console.log("Row:", results.data);
        //},
		
        complete: function (results) {//Process csv results
            //console.log(results.meta.fields);
			//== Change the result data to string
			var resultData = results.meta.fields.toString();
			
			//== Split to take the data each
			var resultArray = resultData.split(",");
						
			//== Create Panel in the canvas 
			canvasArea = document.getElementById("canvas-area");
			resultDivName = createPanel(canvasArea);
			
			//== Take drawing area name to be inserted with content
			resultDiv = document.getElementById(resultDivName);
			
			//== Foreach of the data
			resultArray.forEach(myFunction);
			
			panelCount+=1;
			//document.getElementById("drawing-area").innerHTML = results.meta.fields;
        }
    });

}

function processTXT(f)
{
    var reader = new FileReader();
	
    reader.onload = function (e) {
        contents = e.target.result;
        console.log(contents);
    };

    reader.readAsText(f);
}

function myFunction(item, index) {
	//resultDiv.innerHTML = resultDiv.innerHTML + "<div class='panel panel-default col-sm-4'><div class='panel-body'><ul>";
	resultDiv.innerHTML = resultDiv.innerHTML + "<li class='draggableItem' id='item'>" + item + "</li> " ;
	$('.draggableItem').draggable({scroll:false, zIndex: 999999 , stack:"body",
		start: function( event, ui ) {
			jg = new jsGraphics($(this).parent().parent().attr('id'));
			ax = $(this).offset().left;
			ay = $(this).offset().top;
		},
		stop: function( event, ui ) {
			dx = $(this).offset().left;
			dy = $(this).offset().top;
			jg.setColor("#ff0000"); // red
			  jg.drawLine(ax, ay, dx, dy); // co-ordinates related to "myCanvas"
			  jg.paint();
		}
	});
	//resultDiv.innerHTML = resultDiv.innerHTML + "</ul></div></div>";

		
}


function createPanel(canvasArea) {
	panelName = "panel-" + panelCount;
	
	canvasArea.innerHTML = canvasArea.innerHTML + "<div style='z-index:1;' class='panel panel-default col-sm-4 draggable resizable-" + panelCount + "'> <div class='panel-heading'> Data " + panelCount + " <button type='button' class='close clickable' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button> </div> <div class='panel-body also-" + panelCount + "'><button type='button' class='btn btn-block showSize'>Get Size</button><ul id='" + panelName + "' class='fixed-panel also-" + panelCount + "'> </ul> </div> </div> ";
	//canvasArea.innerHTML = canvasArea.innerHTML + "<div id='panel-data' class='dialog-" + panelCount + "' title='Panel " + panelCount + "'><button type='button' class='btn btn-block showSize'>Get Size</button><ul id='" + panelName + "' class='fixed-panel'> </div>";
	$(".showSize").on("click", function(){ 
		alert(
		"Height = " +
		$(this).closest(".panel").height() + "px " +
		"Width = " +
		$(this).closest(".panel").width() + "px "
		
		);
	});
	
	$(".clickable").on("click", function(){ 
	   $(this).closest(".panel").remove();
	});
	$('.draggable').draggable();
	
	//$('.dialog-' + panelCount).dialog();
	
	$( ".resizable-" + panelCount ).resizable({
	  alsoResize: ".also-" + panelCount
	});

	return panelName;
}


