var i = 0;

var IDarray = [];
function MetCallURL(IDarray){
	var museumIDURL = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + IDarray[0][i];
	$.ajax ({
		url: museumIDURL,
		type: 'GET',
		dataType: 'json',
		error: function (err) {
			console.log ("we got problems!!!");
			console.log(err);
		},
		success: function (data){
			if (data.objectName != "Painting")
			{
				i++;
				MetCallURL(IDarray);
			}
				else{
					console.log (i);
					console.log (data.primaryImage);
				}
		}						
	});
}

function MetCall(){
	var museumURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=" + "tokyo";
	$.ajax ({
		url: museumURL,
		type: 'GET',
		dataType: 'json',
		error: function (err) {
			console.log ("we got problems!!!");
			console.log(err);
		},
		success: function (data){
			IDarray.push(data.objectIDs);
			console.log(IDarray);
			MetCallURL (IDarray);
		}						
	});
}

$(document).ready(function(){
	console.log("document is ready");
	MetCall();
});
