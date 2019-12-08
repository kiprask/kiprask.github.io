function MetCallURL(paintID){
	var museumIDURL = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + paintID;
	$.ajax ({
		url: museumIDURL,
		type: 'GET',
		dataType: 'json',
		error: function (err) {
			console.log ("we got problems!!!");
			console.log(err);
		},
		success: function (data){
			console.log(data.primaryImage)
			
		}						
	});
}

function MetCall(){
	var museumURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=" + "sun";
	$.ajax ({
		url: museumURL,
		type: 'GET',
		dataType: 'json',
		error: function (err) {
			console.log ("we got problems!!!");
			console.log(err);
		},
		success: function (data){
			console.log(data.objectIDs[4])
			MetCallURL (data.objectIDs[4]);
		}						
	});
}

$(document).ready(function(){
	MetCall();
});
