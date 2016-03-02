var contents;


function readSingleFile(eve) {

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
        worker: true,
        comments: "#",
        //step: function (row) {
        //    console.log("Row:", row.data);
        //},
        step: function(results) {
            console.log("Row:", results.data);
        },
        complete: function () {
            console.log("Processing file: "+ f + " is complete");
        }
    });


    //var reader = new FileReader();

    //reader.onload = function (e) {
    //    contents = e.target.result;
    //    console.log(contents);
    //};

    //reader.readAsText(f);
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