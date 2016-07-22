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

// When Download JSON V1
function downloadJSON()
{
	dataJSON = '{ "connections" : [' + dataJSON + ']}';
	var element = document.createElement('a');

	element.setAttribute('href', 'data:text/text;charset=utf-8,' +      encodeURI(dataJSON));
	element.setAttribute('download', "fileName.json");
	element.click();
}
