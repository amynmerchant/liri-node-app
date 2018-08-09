//Imports
var fs = require("fs");
var Spotify = require("node-spotify-api");
var request = require("request");

//Spotify
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//Environmental variables
require("dotenv").config();

//Liri
var commands = process.argv;
var action = commands[2];
var argument = "";
for (var i = 3; i < commands.length; i++) {
    argument += commands[i] + ' ';
}

function liri(action, argument) {
    switch (action) {
        
        case "spotify-this-song": 
            var songTitle = argument; 
            if (songTitle === "") {
                defaultSong();
            } else {
                getSongInfo(songTitle);
            }
            break;

        case "movie-this":
            var movieTitle = argument;
            if (movieTitle === "") {
                getMovieInfo("The Lion King");
            } else {
                getMovieInfo(movieTitle);
            }
            break;
            
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

function getMovieInfo(movieTitle) {
    var queryURL = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log(movie); 

            console.log("\n------------------------");
            console.log("Compiling Movie Information:");
            console.log("\nMovie Title: " + movie.Title);
            console.log("Release Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value)
            console.log("Country Produced In: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
            console.log("------------------------");


            var movieData = [
                "\nMovie Title: " + movie.Title,
                "Release Year: " + movie.Year,
                "IMDB Rating: " + movie.imdbRating,
                "Rotten Tomatoes Rating: " + movie.Ratings[1].Value,
                "Country Produced In: " + movie.Country,
                "Language: " + movie.Language,
                "Plot: " + movie.Plot,
                "Actors: " + movie.Actors

            ].join("\n\n");

            fs.appendFile("log.txt", movieData, function (err) {
                if (err) throw (err);
            })
        }
    })
}


function getSongInfo(songTitle) {
    spotify.search({
        type: 'track',
        query: songTitle
    }, function (err, data) {
        if (err) {
            console.log("Error occured:" + err);
            return;
        }

        var data = data.tracks.items[0];


        console.log("\n------------------------")
        console.log("Compiling Track Information:");
        console.log("\nArtist: " + data.artists[0].name);
        console.log("Song: " + data.name);
        console.log("Spotify Preview URL: " + data.external_urls.spotify);
        console.log("Album name: " + data.album.name);
        console.log("------------------------");


        var songData = [
            "Artist: " + data.artists[0].name,
            "Song: " + data.name,
            "Spotify Preview URL: " + data.external_urls.spotify,
            "Album name: " + data.album.name
        ].join("\n\n");


        fs.appendFile("log.txt", songData, function (err) {
            if (err) throw (err);
        })

    })
};


function defaultSong() {
    spotify.search({
        type: 'track',
        query: 'Bad day - Daniel Powter',
        limit: 10
    }, function (err, data) {
        if (err) {
            console.log("Error occured:" + err);
            return;
        }
        var data = data.tracks.items[5];

        console.log("\n------------------------")
        console.log("Compiling Track Information:");
        console.log("\nArtist: " + data.artists[0].name);
        console.log("Song: " + data.name);
        console.log("Spotify Preview URL: " + data.external_urls.spotify);
        console.log("Album name: " + data.album.name);

        var songData = [
            "Artist: " + data.artists[0].name,
            "Song: " + data.name,
            "Spotify Preview URL: " + data.external_urls.spotify,
            "Album name: " + data.album.name
        ].join("\n\n");

        fs.appendFile("log.txt", songData, function (err) {
            if (err) throw (err);
        })
    })
}


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log(err);
        } else {

            console.log(data); 
            var randomArray = data.split(",");

            action = randomArray[0];
            console.log("\nAction: " + action);
            argument = randomArray[1];
            console.log("\nArgument: " + argument)
 
            liri(action, argument);
        }
    });
}

liri(action, argument);
