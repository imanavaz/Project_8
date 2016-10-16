// ----------- LIST OF Function ---------------
/*
	1. Connection Event
	2. Undo Connection (Level1)
	3. Redo Connection (Level1)
	4. Detach Connection (Level1)
	5. Print Connection (Level1)
	6. Connection Arrow (Global)
*/


// 1. Connection Event
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
		var con=info.connection;   //this is the new connection
		var titleSource  = con.getParameter("titleSource");
		var titleTarget  = con.getParameter("titleTarget");
		var itemsource  = con.getParameter("itemSource");
		var itemtarget  = con.getParameter("itemTarget");
		connUndo[URCount] = con.sourceId;
		sourceRedo[URCount] = con.sourceId;
		targetRedo[URCount] = con.targetId;
		
		printToRoundedRect();
		$('.undoButton').removeAttr('disabled');
		URCount +=1;
		//console.log(jsPlumb.select("source_Population_AreaCode").getParameter("titleSource"));
		console.log(connUndo);
	}
});


// 2. Undo Connection (Level 1)
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

// 3. Redo Connection (Level 1)
function redoConnections(){
	//console.log(sourceRedo);
	//console.log(targetRedo);
	jsPlumb.connect({
	  source: sourceRedo[URCount],
	  target: targetRedo[URCount]
	});
	//$('.redoButton').attr('disabled','disabled');
}

// 4. Detach Connection (Level 1)
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

// 5. Print Connection List (Level 1)
function printToRoundedRect(){
	var con=jsPlumb.getAllConnections();
	var data="";
	$(".rectText-TBODY").empty();
	
	
	for(var i=0;i<con.length;i++)
	{	
		var titleSource  = con[i].getParameter("titleSource");
		var titleTarget  = con[i].getParameter("titleTarget");
		var itemsource  = con[i].getParameter("itemSource");
		var itemtarget  = con[i].getParameter("itemTarget");
		
		var tr = $(document.createElement('tr'));
		
		var sourcetd1 = $(document.createElement('td')).addClass("primary").text(titleSource);
		var sourcetd2 = $(document.createElement('td')).addClass("info").text(itemsource);
		var targettd1 = $(document.createElement('td')).addClass("danger").text(titleTarget);
		var targettd2 = $(document.createElement('td')).addClass("warning").text(itemtarget);
		
		
		
		tr.append(sourcetd1);
		tr.append(sourcetd2);
		tr.append(targettd1);
		tr.append(targettd2);
		$(".rectText-TBODY").append(tr);
	}
}

// 6. Connection Arrow (Global)
// Create Arrow on the Connection Line
jsPlumb.Defaults.Overlays = [
            [ "Arrow", { 
                location:1,
                id:"arrow",
                length:25,
                foldback:0.8
            } ]
];	
