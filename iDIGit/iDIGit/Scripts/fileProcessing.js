var contents;
var w = 500;
var h = 400;
var resultDiv;
var panelCount=1;
var newState;
var i = 0;
var div;
var panelTitle;




function readSingleFile(eve) { //executes when a file is read by "import data" 

    var file = eve.target.files[0];

    if (!file) {
        return;
    }

    var parts = file.name.split('.');
    panelTitle = parts;

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
			canvasArea = document.getElementById("container");
			resultDivName = createPanel(canvasArea);
			
			//== Take drawing area name to be inserted with content
			resultDiv = document.getElementById(resultDivName);
			
			//== Foreach of the data
			resultArray.forEach(printResult);
			
			panelCount+=1;
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

function printResult(item, index) {
	jsPlumb.ready(function() {
	jsPlumb.setContainer($('#container'));
	var connect = $('<li>').addClass('connect').text(item);
	div.append(connect);
	
	jsPlumb.makeTarget(connect, {
	  anchor: 'Continuous'
	});
	
	jsPlumb.makeSource(connect, {
	  parent: newState,
	  anchor: 'Continuous'
	});		
	

	i++;     
	});

}
function createPanel(canvasArea) {
	var panelName = "state"+panelCount;
	newState = $('<div>').attr('id', 'state' + panelCount).addClass('item').addClass('panel').addClass('panel-default');
	var body = $('<div>').addClass('panel-body').attr('id', 'also' + panelCount);
	var ulItem = $('<div>');
	var title = $('<div>').addClass('panel-heading').text(panelTitle);
	body.append(ulItem);
	title.append(" <button type='button' class='close clickable' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
	title.append(' <button type="button" class="btn btn-primary offToggle toggleDrag-'+panelCount+'" data-toggle="button">Drag OFF</button>');
	title.append(" <button type='button' class='showSize-"+panelCount+" info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>?</span></button>");
	jsPlumb.draggable(newState);
	jsPlumb.setDraggable(newState, false);
	/*jsPlumb.setDraggable(newState, false);
	$( newState ).mousedown(function() {
	  jsPlumb.setDraggable(newState, true);
	  console.log("mouseover");
	  $( newState ).trigger( "mouseup" );
	$( newState ).trigger( "mousedown" );
	});
	$( newState ).mouseout(function() {
	  jsPlumb.setDraggable(newState, false);
	  console.log("mouseout");
	});*/
	newState.resizable({alsoResize: "#also"+panelCount});
	body.resizable({containment: "#state"+panelCount});
	
	newState.append(title);
	newState.append(body);
	newState.css("width","300px");
	body.css("overflow-y","scroll");
	body.css("height","300px");
	div = ulItem;
	$('#container').append(newState);
	
	$(".clickable").on("click", function(){ 
	   $(this).closest(".panel").remove();
	});
	$(".toggleDrag-"+panelCount).on("click", function(){ 
		//console.log("Toogle Click");
	   if( $(this).hasClass("onToggle") ){
		   $(this).removeClass("onToggle").addClass("offToggle");
		   $(this).text('Drag OFF');
		   jsPlumb.setDraggable(newState, false);
		   //console.log("Toogle OFF");
	   }else if( $(this).hasClass("offToggle") ){
		   $(this).removeClass("offToggle").addClass("onToggle");
		   jsPlumb.setDraggable(newState, true);
		   $(this).text('Drag ON');
		   //console.log("Toogle ON");
	   }
	});
	$(".showSize-"+panelCount).on("click", function(){ 
		alert(
		"Height = " +
		$(this).closest(".panel").height() + "px " +
		"Width = " +
		$(this).closest(".panel").width() + "px " +
		"Location = x:" +
		$(this).closest(".panel").offset().left + " ,y:" + $(this).closest(".panel").offset().top
		
		);
	});
	return panelName;
}



jsPlumb.ready(function() {
	jsPlumb.setContainer($('#container'));

});



