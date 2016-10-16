
//Saving Level 0 Result
function saveLevel0Result(){
	var checked = $("input:checkbox:checked.level0Item").map(function(){
      return $(this).val();
    }).get(); // <----

	var name  = level0Object['name'];
	var title  = level0Object['title'];
	var position = $("."+name).offset();

	var result = {
		'name' : name,
		'title' : title,
		'items' : checked,
		'top' : position.top,
		'left' : position.left
	};
	resultlevel0.push(result);
	//console.log(resultlevel0);
}

//Level 0 Start Function
function level0Start(){
	jsPlumb.detachEveryConnection();
	$(".footerPanel").addClass('hide');
	$(".rectText").addClass('hide');
	$(".circleBase").removeClass('hide');
	$(".level0paging").addClass('active');
	$(".level1paging").removeClass('active');
	panelCount=1;
	//console.log(resultlevel0);
	for(var i=0;i<resultlevel0.length;i++){
		var result = resultlevel0[i];
		$("#state"+i).remove();
		createLevel0Item(result['title'],result['left'],result['top']);
	}
	state=0;
}

//Level 1 Start Function
function level1Start(){
	jsPlumb.detachEveryConnection();
	$(".footerPanel").removeClass('hide');
	$(".rectText").removeClass('hide');
	$(".circleBase").addClass('hide');
	$(".level0paging").removeClass('active');
	$(".level1paging").addClass('active');
	
	for(var i=0;i<resultlevel0.length;i++){
		var result = resultlevel0[i];
		$("."+result['name']).remove();
		createPanel(result,i);
	}
	
	state=1;
}

// Create Level 1 Panel
function createPanel(item,stateCounter){
	var table = $(document.createElement('table')).attr('id', 'state' + stateCounter).addClass('table').addClass('table-responsive').addClass('table-condensed').addClass('table-hover');
	var thead = $(document.createElement('thead'));
	var title = $(document.createElement('th')).attr('colspan','2').addClass('heading').text(item['title']);
	var body = $(document.createElement('tbody')).addClass('').addClass('').attr('id', 'also' + item['name']).addClass('');
	title.append(" <button type='button' class='close clickClose' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
	title.append(" <button type='button' class='showSize-"+item['name']+" info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'><i>i</i></span></button>");
	title.append(" <button type='button' class='info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>?</span></button>");
	table.append(title);
	table.append(thead);
	table.append(body);
	$('.mainbar').append(table);
	
	
	body.css("height","250px");
	body.css("overflow","scroll");
	
	table.addClass("noselect");
	table.css('background-color','#d3d3d3');
	table.css("height","250px");
	table.css("width","250px");
	table.css("padding","5px");
	table.css("max-height","250px");
	table.css("overflow-y","scroll");
	table.css("position","absolute");
	//table.css("z-index:-1;");
	
	//Loop Items
	for(var i=0;i<item['items'].length;i++){
		var individualItem = item['items'][i];
		var tr = $(document.createElement('tr'));
		var connect = $(document.createElement('td')).addClass('connect').text(individualItem).attr('data-content','this is the content');
		var target = $(document.createElement('td')).addClass('connect').addClass('');
		var img = document.createElement("IMG");
		img.src = "Images/hashtag.png";
		$(target).html(img);
		target.css("width","50px");
		img.style.width = '17.5px';
		tr.append(target);
		tr.append(connect);
		body.append(tr);
		$(connect).popover({ trigger: "hover" });

		target.attr('id', "target_" + item['title'] + "_" + individualItem);
		connect.attr('id', "source_" + item['title'] + "_" + individualItem);

		jsPlumb.makeTarget(target, {
		  anchor: 'Continuous',
		  MaxConnections : 1,
		  parameters:{
			"titleTarget":item['title'],
			"itemTarget":individualItem
			}
		});

		jsPlumb.makeSource(connect, {
		  isSource:true,
		  MaxConnections : 1,
		  anchor: 'Continuous',
		  parameters:{
			"titleSource":item['title'],
			"itemSource":individualItem
			}
		});
		
	}//EOL
	
	table.resizable();
	table.draggable({
      drag: function() {
        jsPlumb.repaintEverything();
      }
    });

	$( table ).resize(function() {
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
		//jsPlumb.repaintEverything();
	});
	$(".showSize-"+item['name']).on("click", function(){
		alert(
		"Height = " +
		$(this).closest(".table").height() + "px " +
		"Width = " +
		$(this).closest(".table").width() + "px " +
		"Location = x:" +
		$(this).closest(".table").offset().left + " ,y:" + $(this).closest(".table").offset().top
		);
	});

	table.offset({ top: item['top'], left: item['left'] });
	panelexist +=1;
	$(".footerPanel").removeClass('hide');
	
}




function printResultLevel0(item, index) {

	var holder = $(".chooseItem-holder");
	var tr = $(document.createElement('tr'));
	var checkboxTD = $(document.createElement('td'));
	var checkbox = $(document.createElement('input'));
	var itemTD = $(document.createElement('td'));

	checkbox.addClass('level0Item');
	checkbox.attr('type','checkbox');
	checkbox.attr('value',item);
	itemTD.text(item);

	checkboxTD.append(checkbox);
	tr.append(checkboxTD);
	tr.append(itemTD);
	holder.append(tr);


	//console.log(item);
}

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



// Create Side Bar Item
function createLevel0Item(name,x,y){
	
	console.log(name);
	var div = $(document.createElement('div'));
	var i = $(document.createElement('i'));
	var items = dataCollection[name]['items'];
	var title = dataCollection[name]['title'];
	name += "-" + panelCount;
	
	div.text(title);

	i.addClass('level0-handle');
	i.attr('id','i' + name);
	i.addClass('glyphicon');
	i.addClass('glyphicon-triangle-right');

	div.addClass('nameContainer');
	div.attr('id',name);
	div.addClass(name);
	div.css('border-top','1px solid');
	div.css('border-bottom','1px solid');
	div.css('z-index','999');
	div.css('cursor','pointer');
	div.css('float','left');
	div.css('max-width','200px');

	div.append(i);
	div.offset({ top: y, left: x });
	$('.mainbar').append(div);

	div.draggable({
      drag: function() {
        jsPlumb.repaintEverything();
      }
    });
	
	jsPlumb.makeSource(i, {
		parent: div,
		isSource:true,
		anchor: 'Continuous',
		parameters : {
			'name' : name,
			'title' : title,
			'items' : items
		}
	});
	panelCount+=1;
}

function createSideBarItem(name){

	var div = $(document.createElement('a'));
	var i = $(document.createElement('i'));

	div.text(panelTitle);

	div.addClass('sidebar-item');
	div.addClass('noselect');
	div.attr('id',name);
	div.addClass(name);

	div.attr('draggable','true');
	div.attr('ondragstart','drag(event)');
	
	$('.sidebar-holder').append(div);



}

function hideRect(){
	$(".rectText").addClass('hide');
}

function showRect(){
	$(".rectText").removeClass('hide');
}