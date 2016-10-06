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
var dataCollection = [];

//When document ready toggle
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

function importDataClick() {
    $("#popUpInput").show();
 };

function textOrCSVClicked(e) {
    //$("#baseDiv").html($("#popupSelect").val() + ' clicked. Click again to change.');
    $("#popUpInput").hide();
    document.getElementById('import_file').click();//$("#import_file").trigger('click');

 }

function readSingleFile(eve) { //executes when a file is read by "import data"

    var file = eve.target.files[0];

    if (!file) {
        return;
    }

    var parts = file.name.split('.');
	//Set panelTitle Variable as FileName
    panelTitle = parts[0].replace(/\s+/g, '');
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
			
			dataCollection[panelTitle] = {
				'title' : panelTitle,
				'items' : resultArray
			};
			
			//createSideBarItem(resultArray);
			createSideBarItem2(panelTitle);

			
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



//Jquery Custom Function make Item to Center
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return this;
}
