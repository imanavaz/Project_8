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

$( document ).ready(function() {
    $('[data-toggle="popover"]').popover();
	$('.circleBase').center();
	jsPlumb.makeTarget($('.circleBase'), {
	  anchor: 'Continuous',
	  MaxConnections : 1
	});
	$("#checkAll").change(function () {
    $("input:checkbox").prop('checked', $(this).prop("checked"));
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

function detachAllConnections()
{
	if (confirm('Are you sure want to detach all connections?')) {
		dataJSON="";
		jsPlumb.detachEveryConnection();
	} else {
		// Do nothing!
	}
	
}

function saveLevel0Result(){
	var checked = $("input:checkbox:checked.level0Item").map(function(){
      return $(this).val();
    }).get(); // <----
	console.log(checked);
}

//When Connection was made , take each other parameters and process it
jsPlumb.bind('connection',function(info,ev){
    var con=info.connection;   //this is the new connection
	var items  = con.getParameter("items");
	var holder = $(".chooseItem-holder");
	
	$('#checkAll').attr('checked', false)
	holder.empty();
	items.forEach(printResult);
	$("#chooseItemModal").modal('show');
});

function printResult(item, index) {
	
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


function createSideBarItem(items){
	
	var name = "name"+panelCount;
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
		parent: i,
		isSource:true,
		anchor: 'Continuous',
		parameters : {
			'items' : items
		}
	});
	

}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}


