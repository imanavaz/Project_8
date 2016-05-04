var contents;
var w = 500;
var h = 400;
var resultDiv;
var panelCount=1;



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
			$( ".resizable" ).resizable({
			  alsoResize: ".also-" + panelCount
			});
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
	resultDiv.innerHTML = resultDiv.innerHTML + "<li>" + item + "</li> " ;
	//resultDiv.innerHTML = resultDiv.innerHTML + "</ul></div></div>";
	$('.draggable').draggable();
		
}

function createPanel(canvasArea) {
	panelName = "panel-" + panelCount;
	
	canvasArea.innerHTML = canvasArea.innerHTML + "<div class='panel panel-default col-sm-4 draggable resizable'> <div class='panel-heading'> Data " + panelCount + " <button type='button' class='close clickable' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button> </div> <div class='panel-body also-" + panelCount + "'> <ul id='" + panelName + "' class='fixed-panel also-" + panelCount + "'> </ul> </div> </div> ";
	$(".clickable").on("click", function(){ 
	   $(this).closest(".panel").remove();
	});
	
	return panelName;
}


