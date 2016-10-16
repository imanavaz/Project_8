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
var c;
var ctx;
var tempParent;
var newState;
var i = 0;
var div;

$( document ).ready(function() {
    //createCanvasOverlay('rgba(0,0,0,0)');
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
			canvasArea = document.getElementById("container");
			resultDivName = createPanel(canvasArea);
			
			//== Take drawing area name to be inserted with content
			resultDiv = document.getElementById(resultDivName);
			
			//== Foreach of the data
			//resultArray.forEach(myFunction);
			resultArray.forEach(printResult);
			
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
/*
function myFunction(item, index) {
	//resultDiv.innerHTML = resultDiv.innerHTML + "<div class='panel panel-default col-sm-4'><div class='panel-body'><ul>";
	resultDiv.innerHTML = resultDiv.innerHTML + "<li role='presentation' class='draggableItem active' id='item' style='z-index:999;' >" + item + "</li> " ;
	
	$('.draggableItem').draggable({snap: true ,
		start: function( event, ui ) {
			tempParent = $(this).closest(".fixed-panel");
			tempParent.removeClass("fixed-panel");
			ax = $(this).offset().left;
			ay = $(this).offset().top;			
			c=document.getElementById("MainCanvas");
			ctx=c.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(ax,ay);
			
		},
		stop: function( event, ui ) {
			tempParent.addClass("fixed-panel");
			dx = $(this).offset().left;
			dy = $(this).offset().top;
			ctx.lineTo(dx,dy);
			ctx.stroke();
		}
	});
	
	//resultDiv.innerHTML = resultDiv.innerHTML + "</ul></div></div>";
	
}
*/
function printResult(item, index) {
	jsPlumb.ready(function() {
	jsPlumb.setContainer($('#container'));
	var connect = $('<li>').addClass('connect').text(item);
	div.append(connect);
	
	jsPlumb.makeTarget(connect, {
	  anchor: 'Continuous',
	  anchors:[
        [ "Perimeter", { shape:"Triangle" } ],
        [ "Perimeter", { shape:"Diamond" } ]
    ]
	});
	
	jsPlumb.makeSource(connect, {
	  parent: connect,
	  anchor: 'Continuous',
	  anchors:[
        [ "Perimeter", { shape:"Triangle" } ],
        [ "Perimeter", { shape:"Diamond" } ]
    ]
	});		
	
	jsPlumb.draggable(div, {
	  containment: 'parent'
	});	
	
	i++;     
	});

}
function createPanel(canvasArea) {
	var panelName = "state"+panelCount;
	newState = $('<div>').attr('id', 'state' + panelCount).addClass('item');
	var ulItem = $('<div>');
	var title = $('<div>').addClass('title').text('Panel ' + panelCount);
	newState.resizable();
	div = ulItem;
	jsPlumb.draggable(newState);
	newState.append(title);
	newState.append(ulItem);
	$('#container').append(newState);
	return panelName;
}

/*
function createPanel(canvasArea) {
	panelName = "panel-" + panelCount;
	
	canvasArea.innerHTML = canvasArea.innerHTML + "<div style='' class='panel panel-default col-sm-4 draggable resizable-" + panelCount + "'> <div class='panel-heading'> Data " + panelCount + " <button type='button' class='close clickable' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button> </div> <div class='panel-body also-" + panelCount + "'><button type='button' class='btn btn-block showSize'>Get Size & Location</button><ul id='" + panelName + "' class='nav nav-pills nav-stacked fixed-panel also-" + panelCount + "'> </ul> </div> </div> ";
	//canvasArea.innerHTML = canvasArea.innerHTML + "<div id='panel-data' class='dialog-" + panelCount + "' title='Panel " + panelCount + "'><button type='button' class='btn btn-block showSize'>Get Size</button><ul id='" + panelName + "' class='fixed-panel'> </div>";
	$(".showSize").on("click", function(){ 
		alert(
		"Height = " +
		$(this).closest(".panel").height() + "px " +
		"Width = " +
		$(this).closest(".panel").width() + "px " +
		"Location = x:" +
		$(this).closest(".panel").offset().left + " ,y:" + $(this).closest(".panel").offset().top
		
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
*/



//Create Canvas Overlay
/*
function createCanvasOverlay(color, canvasContainer)
 {
    canvasContainer = document.createElement('canvas');
        document.body.appendChild(canvasContainer);
        canvasContainer.style.position="absolute";
        canvasContainer.style.left="0px";
        canvasContainer.style.top="0px";
        canvasContainer.style.width=screen.width;
        canvasContainer.style.height=screen.height;
        canvasContainer.style.zIndex="100";
        canvasContainer.style.pointerEvents ="none";
        canvasContainer.id ="MainCanvas";
        superContainer=document.body;
		(function() {
        var canvas = document.getElementById('MainCanvas'),
                context = canvas.getContext('2d');

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                /**
                 * Your drawings need to be inside this function otherwise they will be reset when 
                 * you resize the browser window and the canvas goes will be cleared.
                 
                drawStuff(); 
        }
        resizeCanvas();
        
        function drawStuff() {
                // do your drawing stuff here
        }
})();
}
*/

jsPlumb.ready(function() {
	jsPlumb.setContainer($('#container'));
	/*
	$('#container').dblclick(function(e) {
		var newState = $('<div>').attr('id', 'state' + i).addClass('item');
		
		var title = $('<div>').addClass('title').text('State ' + i);
		var connect = $('<div>').addClass('connect');
		var listitem = $('<div>').text('Hello');
		newState.css({
		  'top': e.pageY,
		  'left': e.pageX
		});
		connect.append(listitem);
		newState.append(title);
		newState.append(connect);
		
		$('#container').append(newState);
		
		jsPlumb.makeTarget(newState, {
		  anchor: 'Continuous'
		});
		
		jsPlumb.makeSource(connect, {
		  parent: newState,
		  anchor: 'Continuous'
		});		
		
		jsPlumb.draggable(newState, {
		  containment: 'parent'
		});

		newState.dblclick(function(e) {
		  jsPlumb.detachAllConnections($(this));
		  $(this).remove();
		  e.stopPropagation();
		});		
		
		i++;    
	  });  
	  */
});



