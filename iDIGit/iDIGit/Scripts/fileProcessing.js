//== Declare Variable 
var contents;
var w = 500;
var h = 400;
var resultDiv;
var panelCount=1;
var newState;
var i = 0;
var div;
var panelTitle;
var counterConnections = 0;
var dataJSON="";
var objConJSON;
var instance;
var panelexist=0;
var connUndo = [];
var sourceRedo = [];
var targetRedo = [];
var URCount=0; //Undo Redo Count

$(function () {
  $('[data-toggle="popover"]').popover()
})

jsPlumb.ready(function() {
instance = window.jsp = jsPlumb.getInstance({/*Drag options and connection overlays*/});
});

function readSingleFile(eve) { //executes when a file is read by "import data" 

    var file = eve.target.files[0];

    if (!file) {
        return;
    }

    var parts = file.name.split('.');
	//Set panelTitle Variable as FileName
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

function detachAllConnections()
{
	if (confirm('Are you sure want to detach all connections?')) {
		dataJSON="";
		jsPlumb.detachEveryConnection();
	} else {
		// Do nothing!
	}
	
}

function printResult(item, index) {
	jsPlumb.ready(function() {
	jsPlumb.setContainer($('#container'));
	var tr = $('<tr>');
	var connect = $('<td>').addClass('connect').text(item).attr('data-content','this is the content').addClass('');
	var target = $('<td>').addClass('connect').addClass('');
	var img = document.createElement("IMG");
    img.src = "Images/hashtag.png";
    $(target).html(img);
	target.css("width","50px");
	img.style.width = '17.5px';
	tr.append(target);
	tr.append(connect);
	div.append(tr);
	$(connect).popover({ trigger: "hover" });
	
	jsPlumb.makeTarget(target, {
	  parent: newState,
	  anchor: 'Continuous',
	  MaxConnections : 1,
	  parameters:{
        "titleTarget":panelTitle[0],
        "itemTarget":item
		}
	});
	
	jsPlumb.makeSource(connect, {
	  parent: newState,
	  isSource:true,
	  MaxConnections : 1,
	  anchor: 'Continuous',
	  parameters:{
        "titleSource":panelTitle[0],
        "itemSource":item
		}
	});		

	i++;     
	});

}
//When Connection was made , take each other parameters and process it
 
    
jsPlumb.bind('connection',function(info,ev){
    var con=info.connection;   //this is the new connection
	var titleSource  = con.getParameter("titleSource");
	var titleTarget  = con.getParameter("titleTarget");
	var itemsource  = con.getParameter("itemSource");
	var itemtarget  = con.getParameter("itemTarget");
	connUndo[URCount] = con.sourceId;
	sourceRedo[URCount] = con.sourceId;
	targetRedo[URCount] = con.targetId;
	
	
	if(dataJSON==""){
		dataJSON += '{ "'+ titleSource +'":"'+itemsource+'" , "'+ titleTarget +'":"'+ itemtarget +'" } ';
	}else
	{
		dataJSON += ',{ "'+ titleSource +'":"'+itemsource+'" , "'+ titleTarget +'":"'+ itemtarget +'" } ';
	}
	$('.undoButton').removeAttr('disabled');
	URCount +=1;
	//objConJSON = JSON.parse(dataJSON);
	//console.log(connUndo);
});

// When Download JSON v2
function downloadJSON(){
	var con=jsPlumb.getAllConnections();
	var dataJSON2="";
	for(var i=0;i<con.length;i++)
	{
		var titleSource  = con[i].getParameter("titleSource");
		var titleTarget  = con[i].getParameter("titleTarget");
		var itemsource  = con[i].getParameter("itemSource");
		var itemtarget  = con[i].getParameter("itemTarget");
		if(dataJSON2==""){
			dataJSON2 += '{ "'+ titleSource +'":"'+itemsource+'" , "'+ titleTarget +'":"'+ itemtarget +'" } ';
		}else
		{
			dataJSON2 += ',{ "'+ titleSource +'":"'+itemsource+'" , "'+ titleTarget +'":"'+ itemtarget +'" } ';
		}
	}
	dataJSON2 = '{ "connections" : [' + dataJSON2 + ']}';
	var element = document.createElement('a');

	element.setAttribute('href', 'data:text/text;charset=utf-8,' +      encodeURI(dataJSON2));
	element.setAttribute('download', "fileName.json");
	element.click();
	
}

function undoConnections(){
	jsPlumb.detachAllConnections(connUndo[URCount-1]);
	connUndo[URCount] = "";
	$('.redoButton').removeAttr('disabled');
	
	if(URCount<=1){
		$('.undoButton').attr('disabled','disabled');
		URCount -=1;
	}else{
		URCount -=1;
	}
	
}

function redoConnections(){
	//console.log(sourceRedo);
	//console.log(targetRedo);
	jsPlumb.connect({
	  source: sourceRedo[URCount], 
	  target: targetRedo[URCount]
	});
	//$('.redoButton').attr('disabled','disabled');
}
	


function createPanel(canvasArea) {
	var panelName = "state"+panelCount;
	newState = $('<table>').attr('id', 'state' + panelCount).addClass('item').addClass('table').addClass('table-responsive').addClass('table-condensed').addClass('table-hover');
	var thead = $('<thead>');
	var title = $('<th>').attr('colspan','2').addClass('heading').text(panelTitle[0]);
	var body = $('<tbody>').addClass('').addClass('').attr('id', 'also' + panelCount).addClass('');
	div = body;
	title.append(" <button type='button' class='close clickClose' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
	title.append(" <button type='button' class='showSize-"+panelCount+" info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'><i>i</i></span></button>");
	title.append(" <button type='button' class='info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>?</span></button>");
	thead.append(title);
	newState.append(thead);
	newState.append(body);
	$('#container').append(newState);
	//body.css("height","150px");
	//body.css("overflow","auto");
	newState.css("width","250px");
	newState.css("height","250px");
	newState.css("overflow-y","scroll");
	//newState.css("z-index:-1;");
	jsPlumb.draggable(newState,{
		filter:".ui-resizable-handle"
	});
	newState.resizable();
	
	$( newState ).resize(function() {
	   jsPlumb.repaintEverything();
	});
	
	$( body ).scroll(function() {
	  jsPlumb.repaintEverything();
	  //alert('scroll');
	});
	$(".clickClose").on("click", function(){ 
	   $(this).closest(".table").remove();
	   panelexist -=1;
	   if(panelexist <1){
		   $(".footerPanel").addClass('hide');
	   }
		
	});
	$(".showSize-"+panelCount).on("click", function(){ 
		alert(
		"Height = " +
		$(this).closest(".table").height() + "px " +
		"Width = " +
		$(this).closest(".table").width() + "px " +
		"Location = x:" +
		$(this).closest(".table").offset().left + " ,y:" + $(this).closest(".table").offset().top
		
		);
	});
	
	panelexist +=1;
	$(".footerPanel").removeClass('hide');
	return panelName;
}






