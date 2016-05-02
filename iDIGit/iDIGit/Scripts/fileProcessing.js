var contents;
var w = 500;
var h = 400;
var resultDiv;

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
    angular.bootstrap(mydiv, ['myApp'])
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
            console.log(results.meta.fields);
			var resultData = results.meta.fields.toString();
			var resultArray = resultData.split(",");
			//var resultArray = JSON.parse(JSONData); //Convert JSON to Array 
			resultDiv = document.getElementById("drawing-area");
			
			resultArray.forEach(myFunction);
			
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