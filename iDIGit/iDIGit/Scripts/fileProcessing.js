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
			resultDivName = createPanel2(canvasArea);
			
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
	var connect = $('<td>').addClass('connect').text(item).attr('data-content','this is the content');
	var target = $('<td>').addClass('connect');
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
	
	if(dataJSON==""){
		dataJSON += '{ "'+ titleSource +'":"'+itemtarget+'" , "'+ titleTarget +'":"'+ itemtarget +'" } ';
	}else
	{
		dataJSON += ',{ "'+ titleSource +'":"'+itemtarget+'" , "'+ titleTarget +'":"'+ itemtarget +'" } ';
	}
	//objConJSON = JSON.parse(dataJSON);
	console.log(dataJSON);
});
// When Download JSON
function downloadJSON()
{
	dataJSON = '{ "connections" : [' + dataJSON + ']}';
var element = document.createElement('a');
element.setAttribute('href', 'data:text/text;charset=utf-8,' +      encodeURI(dataJSON));
element.setAttribute('download', "fileName.json");
element.click();
}
	
function createPanel(canvasArea) {
	var panelName = "state"+panelCount;
	newState = $('<div>').attr('id', 'state' + panelCount).addClass('item').addClass('panel').addClass('panel-default');
	var body = $('<div>').addClass('panel-body').attr('id', 'also' + panelCount);
	var ulItem = $('<div>');
	var title = $('<div>').addClass('panel-heading').text(panelTitle[0]);
	body.append(ulItem);
	title.append(" <button type='button' class='close clickable' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
	title.append(' <button type="button" class="btn btn-primary offToggle toggleDrag-'+panelCount+'" data-toggle="button">Drag OFF</button>');
	title.append(" <button type='button' class='showSize-"+panelCount+" info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>?</span></button>");
	jsPlumb.draggable(newState);
	jsPlumb.setDraggable(newState, false);
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

function createPanel2(canvasArea) {
	var panelName = "state"+panelCount;
	newState = $('<table>').attr('id', 'state' + panelCount).addClass('item').addClass('panel').addClass('table').addClass('table-responsive').addClass('table-condensed');
	var thead = $('<thead>');
	var title = $('<th>').attr('colspan','2').addClass('heading').text(panelTitle[0]);
	var body = $('<tbody>').addClass('').addClass('').attr('id', 'also' + panelCount).addClass('table-hover');
	div = body;
	title.append(" <button type='button' class='close clickClose' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
	title.append(" <button type='button' class='showSize-"+panelCount+" info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'><i>i</i></span></button>");
	title.append(" <button type='button' class='info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>?</span></button>");
	thead.append(title);
	newState.append(thead);
	newState.append(body);
	$('#container').append(newState);
	newState.css("width","300px");
	newState.css("overflow","auto");
	newState.css("max-height","300px");
	newState.css("z-index:-1;");
	jsPlumb.draggable(newState);
	
	$(".clickClose").on("click", function(){ 
	   $(this).closest(".panel").remove();
	   panelexist -=1;
	   if(panelexist <1){
		   $(".footerPanel").addClass('hide');
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
	
	panelexist +=1;
	$(".footerPanel").removeClass('hide');
	return panelName;
}





