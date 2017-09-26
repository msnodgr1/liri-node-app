
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');

var api = process.argv[2];

var input = process.argv

var query = "";

function getInput(){
	query = "";

	for (var i = 3; i < input.length; i++) {
		query = query + " " + input[i];
	}

}


switch (api){
	case "spotify-this-song":
	runSpotify();
	break;

	case "my-tweets":
	runTwitter();
	break;

	case "movie-this":
	runImdb();
	break;

	case "do-what-it-says":
	runDoIt();
	break;
}


function runSpotify(){
	getInput();
	
	if (query === "") {
		query = "The Sign Ace of Base"
	};


	var spotify = new Spotify({
  		id: "409567e053004e358268b6b71e444b84",
  		secret: "4041dfdb28fb4c9aa2b30b1409cd0e61"
	});
 
	spotify.search({ type: 'track', query: query, limit: 1}, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		};
 
    console.log("Artist: " + data.tracks.items[0].artists[0].name + "\n" + "Track: " + data.tracks.items[0].name + "\n"
     + "Link: " + data.tracks.items[0].external_urls.spotify + "\n" + "Album: " + data.tracks.items[0].album.name); 
	});
};


function runTwitter(){
	var client = new Twitter({
	  consumer_key: keys.consumer_key,
	  consumer_secret: keys.consumer_secret,
	  access_token_key: keys.access_token_key,
	  access_token_secret: keys.access_token_secret
	});


	client.get('statuses/user_timeline', 'screen_name: @TwoHouseCats', function(error, tweets, response) {
	  if(error) throw error;

	  for (var tweet in tweets) {
	  	console.log("@"+ tweets[tweet].user.screen_name + ":"+ "\n" + tweets[tweet].text +"\n" + tweets[tweet].created_at +"\n\n");
	  };
	});
};

function runImdb(){
	getInput();

	if (query === "") {
		query = "Mr. Nobody"
	};


	request("http://www.omdbapi.com/?apikey=40e9cece&t=" + query.trim(), function(error, response, body) {
 		if (error) {
 			return console.log('Error occurred: ' + error);
 		};

 		if (!error && response.statusCode === 200) {
 			var newBody = JSON.parse(body);
 			console.log("Title: " + newBody.Title + "\n" + "Year: " + newBody.Year + "\n" + "IMDB Rating: " + newBody.Ratings[0].Value
 				+ "\n" + "Rotten Tomatoes Rating: " + newBody.Ratings[1].Value + "\n" + "Country: " + newBody.Country + "\n" 
 			    + "Language: " + newBody.Language + "\n" + "Plot: " + newBody.Plot + "\n" + "Actors: " + newBody.Actors);
 		}
	});

};



function runDoIt(){
	fs.readFile("random.txt", "utf8", function(err, data){
		var dataArr = [];
		 dataArr = data.split(",");
		 query = "";
		 query = dataArr[1];

		

		 if (dataArr[0] === "spotify-this-song") {

			var spotify = new Spotify({
		  		id: "409567e053004e358268b6b71e444b84",
		  		secret: "4041dfdb28fb4c9aa2b30b1409cd0e61"
			});
		 
			spotify.search({ type: 'track', query: query, limit: 1}, function(err, data) {
		  		if (err) {
		    		return console.log('Error occurred: ' + err);
		  		};
		 
		    console.log("Artist: " + data.tracks.items[0].artists[0].name + "\n" + "Track: " + data.tracks.items[0].name + "\n"
		     + "Link: " + data.tracks.items[0].external_urls.spotify + "\n" + "Album: " + data.tracks.items[0].album.name); 
			});

		 

		 };

		 if (dataArr[0] === "movie-this") {

		 	runImdb();

		 };

		 if (dataArr[0] === "my-tweets") {

			var client = new Twitter({
			  consumer_key: keys.consumer_key,
			  consumer_secret: keys.consumer_secret,
			  access_token_key: keys.access_token_key,
			  access_token_secret: keys.access_token_secret
			});


				client.get('statuses/user_timeline', 'screen_name: @TwoHouseCats', function(error, tweets, response) {
				  if(error) throw error;

				  for (var tweet in tweets) {
				  	console.log("@"+ tweets[tweet].user.screen_name + ":"+ "\n" + tweets[tweet].text +"\n" + tweets[tweet].created_at +"\n\n");
				  };
				});

		};
	});
}

