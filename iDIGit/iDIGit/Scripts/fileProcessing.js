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
var object = [];
var resultlevel0 = [];
var level0Object;
var state = 0;

//When document ready toogle
$( document ).ready(function() {
    $('[data-toggle="popover"]').popover(); //Enable popover
	$('.circleBase').center(); //center the circle
	jsPlumb.makeTarget($('.circleBase'), {
	  anchor: 'Continuous',
	  MaxConnections : 1
	}); //make target circle
	$("#checkAll").change(function () {
    $("input:checkbox").prop('checked', $(this).prop("checked"));
	}); //checkALl Function
	$(".circleBase").on("click", function(){ 
		if (confirm('Are you sure want to continue to Level 1?')) {
			level1Start();
		} else {
			// Do nothing!
		}
	});
	
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
		case ('json'):
            processJSON(file);
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

		
        complete: function (results) {//Process csv results

			//== Change the result data to string
			var resultData = results.meta.fields.toString();
			
			//== Split to take the data each
			var resultArray = resultData.split(",");
			createSideBarItem(resultArray);
			
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

function processJSON(f)
{
    var vJSONImport;
	//alert("LoadJSON Success");
	Papa.parse(f, {
        dynamicTyping: true,
        complete: function (results) {
            vJSONImport = JSON.parse(results.data[0]);
            //console.log(vJSONImport);
			vJSONImport = vJSONImport["connections"];
			//console.log(vJSONImport);
			
			for(var i=0;i<vJSONImport.length;i++){
				var data = vJSONImport[i];
				var y=0;
				var sourceDiv;
				var targetDiv;
				
				for (var k in data) {
					if (data.hasOwnProperty(k)) {
						if(y==0){
							sourceDiv = "source_" + k + "_" + data[k];
						}else if(y==1){
							targetDiv = "target_" + k + "_" + data[k];
						}
					   
					}
					y+=1;
				}
				jsPlumb.connect({
				  source: sourceDiv, 
				  target: targetDiv
				});
				
			}
			
		}
     });
    
	
}

//Detaching All Connection
function detachAllConnections()
{
	if (confirm('Are you sure want to detach all connections?')) {
		dataJSON="";
		jsPlumb.detachEveryConnection();
	} else {
		// Do nothing!
	}
	
}

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

function level1Start(){
	jsPlumb.detachEveryConnection();
	
	$(".circleBase").remove();
	
	for(var i=0;i<resultlevel0.length;i++){
		var result = resultlevel0[i];
		$("."+result['name']).remove();
		createPanel(result);
		result['items'].forEach(printResult);
		//for(var j=0;i<resultlevel0[i]['items'].length;j++){
		//	printItemLevel1(resultlevel0[i]['items'][j],resultlevel0[i]['title']);
		//}
	}
	
	state=1;
}

function printResult(item, index) {
	jsPlumb.ready(function() {
		jsPlumb.setContainer($('#container'));
		var tr = $('<tr>');
		var connect = $('<td>').addClass('connect').text(item).attr('data-content','this is the content');
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
		
		target.attr('id', "target_" + panelTitle[0] + "_" + item);
		connect.attr('id', "source_" + panelTitle[0] + "_" + item);
		
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
		
		
		
		//jsPlumb.select(target).setLabel("target_" + panelTitle[0] + "_" + item);
		//jsPlumb.select(connect).setLabel("source_" + panelTitle[0] + "_" + item);
		//jsPlumb.setId(target, panelTitle[0] + "_" + item);
		//jsPlumb.setId(connect, panelTitle[0] + "_" + item);
		//console.log("source_" + panelTitle[0] + "_" + item);
		i++;     
	});

}

function createPanel(item) {
	newState = $('<table>').attr('id', 'state' + panelCount).addClass('item').addClass('table').addClass('table-responsive').addClass('table-condensed').addClass('table-hover');
	var thead = $('<thead>');
	var title = $('<th>').attr('colspan','2').addClass('heading').text(item['title']);
	var body = $('<tbody>').addClass('').addClass('').attr('id', 'also' + item['name']).addClass('');
	div = body;
	title.append(" <button type='button' class='close clickClose' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
	title.append(" <button type='button' class='showSize-"+item['name']+" info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'><i>i</i></span></button>");
	title.append(" <button type='button' class='info' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>?</span></button>");
	thead.append(title);
	newState.append(thead);
	newState.append(body);
	$('body').append(newState);
	//body.css("height","150px");
	//body.css("overflow","auto");
	newState.css("width","250px");
	newState.css("height","250px");
	newState.css("overflow-y","scroll");
	//newState.css("z-index:-1;");

	newState.resizable();
	newState.draggable({
      drag: function() {
        jsPlumb.repaintEverything();
      }
    });
	
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
		//jsPlumb.repaintEverything();
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
	
	newState.offset({ top: item['top'], left: item['left'] });
	panelexist +=1;
	$(".footerPanel").removeClass('hide');

}

//When Connection was made , take each other parameters and process it
jsPlumb.bind('connection',function(info,ev){
	if(state==0){
		var con=info.connection;   //this is the new connection
		var items  = con.getParameter("items");
		var name  = con.getParameter("name");
		var title  = con.getParameter("title");
		var holder = $(".chooseItem-holder");
		
		
		level0Object = {
			'name' : name,
			'title' : title,
		};
		//console.log(level0Object);
		$('#checkAll').attr('checked', false)
		holder.empty();
		items.forEach(printResultLevel0);
		$("#chooseItemModal").modal('show');
	}
	if(state==1){
		
	}
});

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

// Create Side Bar Item
function createSideBarItem(items){
	
	var name = panelTitle[0]+"-"+panelCount;
	var div = $(document.createElement('div'));
	var i = $(document.createElement('i'));
	 
	div.text(panelTitle[0]);
	
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
	
	div.append(i);
	
	$('.sidebar-holder').append(div);
	
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
			'title' : panelTitle[0],
			'items' : items
		}
	});
	

}

//Jquery Custom Function make Item to Center
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}