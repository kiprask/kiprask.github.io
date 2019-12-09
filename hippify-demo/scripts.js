//to show that html is loading js
console.log ("Loading 1");


//musixmatchURLs
var mainmusixmatchURL = "https://api.musixmatch.com/ws/1.1/";
var musixmatchAPIKey = "&apikey=" + "bf9e1e9669d9227d46054b992f7fddc6";
var id = 0;
var musixmatchSnippetURL = mainmusixmatchURL + "track.snippet.get?track_id=" + id + musixmatchAPIKey + "&format=jsonp";
var topTracksURL = mainmusixmatchURL + "chart.tracks.get?chart_name=top&page=1&page_size=5&country=us&f_has_lyrics=1" + musixmatchAPIKey + "&format=jsonp";
console.log(topTracksURL);
var arrayNum = 0;

//function that puts the painting on the webpage

function makeHTML (painting, snippet){
	var imagePainting = "";
	imagePainting += "<div class='artwork'>";
	imagePainting += "<img class='painting' id='lowerHeight' src='" + painting + "'/>";
	imagePainting += "<div class='phrase'>" + snippet + "</div>";
	imagePainting += "</div>";
	
	$('.paintingBox').html(imagePainting);

	$('#lowerHeight').load(function(){
		//Access painting height
		var textOffset	= $('#lowerHeight').height()/3 + "px";
		//Update h2 position
		//$('.phrase').css('top', textOffset);
		$('footer').css('bottom', 0);
		$('body').animate({ scrollTop: $('.painting').offset().top}, 400);
	});
}
	console.log ("before first function");
function paintingSearch(array, snippet, num) {
	var museumAPIKey;
	var museumSearchTerm = array[num];
	var basicWords = ["the","a","you","me","and","I","The","A","You","Me","And","I","No","no","What","what","That","that","When","when","It's","it's"];
	
	var museumURL;
	function checkTheWords(){
		var tryAgain = false;
		basicWords.forEach(function(word){
			if (array[num]=== word){
				tryAgain = true;
			}
		});
		if (tryAgain){
			num++;
			checkTheWords();
		}
		else{
			museumSearchTerm = array[num].replace ("'","");
			var museumURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=" + museumSearchTerm;
			MetCall(museumURL, arrayNum);
		}
	}


	console.log ("after first function");

	checkTheWords();

	console.log ("after second function");



var i = 0;

var IDarray = [];
function MetCallURL(IDarray,arrayNum){
	console.log(arrayNum);
	var museumIDURL = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + IDarray[arrayNum][i];
	console.log(museumIDURL);
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
				MetCallURL(IDarray, arrayNum);
			}
				else{
					console.log (i);
					console.log (data.primaryImage);
					var paintingURL = data.primaryImage;
					var upperCaseSnippet = snippet.toUpperCase();
					var noCommasSnippet = upperCaseSnippet.replace (/\,/g,"<br>");
					var noDotSnippet = noCommasSnippet.replace(/\./g,"");
					makeHTML (paintingURL, noDotSnippet);
					console.log(num);
					console.log(museumSearchTerm);
					console.log(museumIDURL);
					console.log("painting loaded");
				}
		}						
	});
}



function MetCall(museumURL, arrayNum){

	
	
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
			if (IDarray==0){
				var museumURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=" + "box";
				arrayNum = 1;
				MetCall(museumURL, arrayNum);

				

			}
			else{
			MetCallURL (IDarray, arrayNum);
			console.log (arrayNum);
			
			}
		}						
	});
}
}



//function to get musixmatch snippet data for the track searched
function musixmatchSnippet (id) {
	
	var musixmatchSnippetURL = mainmusixmatchURL + "track.snippet.get?track_id=" + id + musixmatchAPIKey + "&format=jsonp";
	
	$.ajax({
		url:musixmatchSnippetURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(err){
			console.log("we got problems!");
			console.log (err);
		},
		success: function(data){
			var num = 0;
			if(data.message.body.snippet.snippet_body === 0){
				alert ("This does not have enough lyrics to hippify art!!!");
			}
			else{
				var lyricSnippet = data.message.body.snippet.snippet_body;
				var snippetArray = lyricSnippet.split (" ");
				paintingSearch (snippetArray, lyricSnippet, num);
			}
		}

	});
}


//function to get musixmatch search data
function musixmatchSearch (track, artist) {
	
	var musixmatchSearchURL = mainmusixmatchURL + "track.search?q_track=" + track + "&q_artist=" + artist + 
	musixmatchAPIKey + "&format=jsonp";
	
	$.ajax({
		url:musixmatchSearchURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(err){
			console.log("we got problems!");
			console.log (err);
		},
		success: function(data){
			
			if(data.message.header.available === 0){
				alert ("This track does not exist!!!");
			}
			else if (data.message.body.track_list[0].track.has_lyrics === 0) { 
				alert ("This track does not have lyrics and can't hippify art!!! Please try again with a track that has lyrics");
			}
			else{
			var trackID = data.message.body.track_list[0].track.track_id;

			//running snippet function from before
			musixmatchSnippet (trackID);
			}
		}
	});
}

//document ready function
$(document).ready(function(){

	$('#theButton').click( function(){
		//Do this stuff when a click occurs
		var trackName = $('#trackInput').val();
		var trackNameURLInput = escape(trackName);
		console.log ("button is pressed");

		var artistName = $('#artistInput').val();
		var artistNameURLInput = escape(artistName);

		//running track search function which finds the track id and executes the snippet function which logs the snippet
		musixmatchSearch (trackNameURLInput, artistNameURLInput);	
	});
});