// TO DO
// - Notify user what the country was if they skipped it


// - Trying to figure out how to make this API more simple
// - When I figure it out, I can make a blog post about it
// - Map mode:
  // - For the maps, show a capital city on gMaps
  //    - "Guess the country!"
  //    - or "Guess the capital city!"
// - Encyclopaedic mode:
  // - Or, get the intro paragraph from Wikipedia
  //    - output the info, and ask to "Guess the country!"
  //    - or "Guess the capital city!"




//An object with the latitudes and longitudes of every country on Earth
  var countries = [
    {
      name: "Afghanistan",
      lat:33.93,
      lon:67.33,
    },
    {
      name: "Albania",
      lat:41.3375,
      lon:19.8085,
    },
    {
      name: "Algeria",
      lat:28.0339,
      lon:1.6596,
    },
    {
      name: "Canada", //MAJOR PROBLEM HERE!
      lat:45.5206,
      lon:-75.693254,
    },
    {
      name: "Italy",
      lat:41.8719,
      lon:12.5674,
    },
    {
      name: "Vietnam",
      lat:14.0583,
      lon:108.2772,
    },
    {
      name: "China",
      lat:35.8617,
      lon:104.1954,
    },
    {
      name: "Japan",
      lat:36.2048,
      lon:138.2529,
    },
    {
      name: "Sweden",
      lat:64.5763,
      lon:16.7544,
    },
    {
      name: "Iceland",
      lat:65.0152,
      lon:-18.1037,
    },
    {
      name: "Mexico",
      lat:20.0389,
      lon:-99.7586,
    },
    {
      name: "Brazil",
      lat:-8.77275,
      lon:-55.81328,
    },
    {
      name: "Chile",
      lat:-33.226314,
      lon:-70.491014,
    },
    {
      name: "Greenland",
      lat:72.859137,
      lon:-39.908492,
    },
    {
      name: "South Africa",
      lat:-30.665441,
      lon:24.270793,
    }, 
    {
      name: "Kazakhstan",
      lat:48.364995,
      lon:66.349838,
    }, 
    {
      name: "Iceland",
      lat:65.0152,
      lon:-18.1037,
    }, 
    {
      name: "Turkey",
      lat:39.507385,
      lon:36.484972,
    }, 
    {
      name: "Egypt",
      lat:28.411690,
      lon:29.126961,
    }, 
    {
      name: "Saudi Arabia",
      lat:23.946482,
      lon:44.884150,
    }, 
    {
      name: "Iraq",
      lat:33.602286,
      lon:42.328098,
    }, 
    {
      name: "Thailand",
      lat:15.615173,
      lon:101.390650,
    }, 
    {
      name: "Iran",
      lat:31.412466,
      lon:53.581526,
    }, 
    {
      name: "New Zealand",
      lat:-42.6221117,
      lon:172.321741,
    }, 
    {
      name: "Mongolia",
      lat:46.949972,
      lon:101.692300,
    }, 
    {
      name: "Norway",
      lat:60.968987,
      lon:7.320667,
    }, 
    {
      name: "Finland",
      lat:67.400690,
      lon:26.161528,
    }, 
    {
      name: "Madagascar",
      lat:-20.693206,
      lon:45.573325,
    }
  ]

//if the browser is not chrome, then disable the voice input API option
if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
 //Voice input
//we want this to start when the user presses that cool
  // new instance of speech recognition
  window.recognition = new webkitSpeechRecognition();
  // recognition settings
  window.recognition.continuous = true;
  window.recognition.interimResults = true;

} else {

  // $('#text').attr('checked','checked');
  $('.switch_to_chrome').css('display','flex');
  $('.switch_to_chrome').css('z-index','100000');
  $('#text').prop("checked", true);

  // tell the user to switch to chrome
}

//Choose a random country:
var totalCountries = countries.length;
console.log("There are a total of this many countries: "+totalCountries);
var rndCountry = (Math.floor(Math.random()*totalCountries));
var rndCountryLat = countries[rndCountry].lat;
var rndCountryLon = countries[rndCountry].lon;
var markers = [];
var userPoints = 0;
var seconds = 60;
var startSpeechInput = false;
var thingsSynthHeard = 0;
var knownCountries = [];
var countriesAnsweredArray = [];
var inArray = false;

function startTimer(){
  timex = setTimeout(function(){
    seconds--;
    $('.time').text('Time: '+seconds+' seconds');


    //Initialize speech input at 5 seconds (so synth has time to talk)
    if (seconds === 55){
      startSpeechInput = true;
      recognition.start();
    }

    if (seconds > 0){
      startTimer();
    } else {
      clearTimeout(timex);
      $('.quiz_outro').animate({top: "0vh"});
      $('.countries_right').text('You got '+userPoints+' countries right in 60 seconds!');
      if (userPoints <= 5){
        $('.personal_title').text('You need some practice!');
      } else if ((userPoints>5)&&(userPoints <= 10)){
        $('.personal_title').text('You are a champ!');
      } else if (userPoints>10){
        $('.personal_title').text('You are a scholar, and I am humbled in your presence!');
      }
      var outroUtterance = new SpeechSynthesisUtterance("You got "+userPoints+" right in 60 seconds!");
      if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
        window.synth.speak(outroUtterance);
      }


    }
  },1000);
}




//Voice output setup
  window.synth = window.speechSynthesis;

  var inputForm = document.querySelector('form');

  voices = synth.getVoices();
    var introUtterance = new SpeechSynthesisUtterance("Welcome to GeoQuiz!");
    synth.speak(introUtterance);



var map;


// console.log("This is the latitude: " + countries[rndCountry].lat);
// console.log("This is the longitude: " + countries[rndCountry].lon);
//this is what we will use to get information about where we're pointing!
//http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=false


$.ajax({
  url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + countries[rndCountry].lat + "," + countries[rndCountry].lon + "&sensor=false", 
  type: 'GET',
  data:'json',
  latlng: {rndCountryLat, rndCountryLon},
  success: function(result){
    console.log("Success", result);
  }
});


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: rndCountryLat, lng: rndCountryLon},
    zoom: 3
  });
  map.set('styles', [
    {
      featureType: 'administrative.country',
      elementType: 'labels',
      stylers: [
        {visibility: 'off'}
      ]
    },
    {
      featureType: 'administrative.city',
      elementType: 'labels',
      stylers: [
        {visibility: 'off'}
      ]
    }
  ]);
  var marker = new google.maps.Marker({
    position: {lat: rndCountryLat, lng: rndCountryLon},
    map: map,
    title: "Where am I?!?!?!?!"
  });
  markers.push(marker);
}

function assignNewCountry (){
  prvRndCountry = rndCountry;
  
  // inArray = false;
  // while ((prvRndCountry === rndCountry)&&(inArray === false)){
  //   rndCountry = (Math.floor(Math.random()*totalCountries));
  //   if ($.inArray(rndCountry, countriesAnsweredArray) !== -1){
  //     console.log("There's a country in this array.");
  //     inArray = true;
  //   }
  //   countriesAnsweredArray.push(rndCountry);
  // }
  do {
    rndCountry = (Math.floor(Math.random()*totalCountries));
    //make sure the current country isn't in the array
    if ($.inArray(rndCountry, countriesAnsweredArray) !== -1){
      console.log(rndCountry, countries[rndCountry].name, " is already in this array.");
    }
  } while ($.inArray(rndCountry, countriesAnsweredArray) !== -1);
  countriesAnsweredArray.push(rndCountry);

  rndCountryLat = countries[rndCountry].lat;
  rndCountryLon = countries[rndCountry].lon;
  var laLatLng = new google.maps.LatLng(rndCountryLat, rndCountryLon);
  map.panTo(laLatLng);

  console.log(countries[rndCountry].name + " is the random country");
}

// assignNewCountry();

//Remove successful markers
function changeAllPreviousMarkerColours(){
  for(i=0; i<markers.length; i++){
    markers[i].setMap(null);
  }
}
//Add a marker
function addCurrentMarker() {
  var marker = new google.maps.Marker({
    position: {lat: rndCountryLat, lng: rndCountryLon},
    map: map
  });
  markers.push(marker);
}


// //Voice input
// //we want this to start when the user presses that cool
//   // new instance of speech recognition
//   window.recognition = new webkitSpeechRecognition();
//   // recognition settings
//   recognition.continuous = true;
//   recognition.interimResults = true;

if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
  $('#text_answer').on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) { 
      e.preventDefault();

        //assign the text in the box to a variable
        var textGuess = $('#text_answer').val().toLowerCase();
        console.log(textGuess);
        //check if it's right
        countryNameString = countries[rndCountry].name.toString().toLowerCase();
        if (textGuess === countryNameString){
          $('.hal_response').text(textGuess + ' is correct!');
          userPoints+=1;
          $('.points').text('Points: '+userPoints);
          //add to the countries already guessed...
          // knownCountries.push(rndCountry);
          // console.log(knownCountries);

          assignNewCountry();
          changeAllPreviousMarkerColours();
          addCurrentMarker();
        } else if ((textGuess === "skip") & (textGuess != "_")){
          console.log("We heard the user say 'I don't know' or 'skip'.");
          assignNewCountry();
          changeAllPreviousMarkerColours();
          addCurrentMarker();
          $('.hal_response').text('That country was '+countryNameString);
          saidWordString = "_";
        }
      $('#text_answer').val('');
      return false;
    }
  });

  recognition.onresult = function(event){
    if (startSpeechInput === true){
      // delve into words detected results & get the latest
      // total results detected
      var resultsLength = event.results.length -1 ;
      // get length of latest results
      var ArrayLength = event.results[resultsLength].length -1;
      // get last word detected
      var saidWord = event.results[resultsLength][ArrayLength].transcript;
     

      saidWord = saidWord.substring(1); //remove the breakline char from the beginning of the string


        
        // if word matches, signal success!
        countryNameString = countries[rndCountry].name.toString().toLowerCase();
        saidWordString = saidWord.toString().toLowerCase();
        countryNameStringLength = countryNameString.length;
        saidWordStringLength = saidWordString.length;
        $('.diagnostics').html(saidWordString+'~~'+saidWordStringLength+'<br>'+countryNameString+'~~'+countryNameStringLength);

        if (saidWordString === countryNameString) {
          $('.hal_response').text(saidWord + ' is correct!');
          userPoints+=1;
          $('.points').text('Points: '+userPoints);

          assignNewCountry();
          changeAllPreviousMarkerColours();
          addCurrentMarker();

        } else if (((saidWordString === "I don't know")||(saidWordString === "know")||(saidWordString === "don't know")||(saidWordString === "skip")) & (saidWordString != "_")) {
          console.log("We heard the user say 'I don't know' or 'skip'.");
          assignNewCountry();
          changeAllPreviousMarkerColours();
          addCurrentMarker();
          $('.hal_response').text('That country was '+countryNameString);
          saidWordString = "_";
        }

    
      // append the last word to the bottom sentence
      if (thingsSynthHeard === 0){
        thingsSynthHeard++;
      } else {
        $('.last_said_word').text('I heard you say: "'+saidWord+'"');
      }

           


    }
  }
}

$('.start').on('click', function(){
  //smooth scroll the intro screen outta there!
  $('.quiz_intro').animate({top: "-100vh"});

  //load the game up!
  if ($('#voice').is(':checked')){
    var utterThis = new SpeechSynthesisUtterance("Please say the name of the country above, or say 'I dunno'.");
  } else {
    var utterThis = new SpeechSynthesisUtterance("Please type the name of the country above, or type 'skip'.");
    //make the voice input disappear
    $('.last_said_word').css('display','none');
    // $('.hal_response').css('display','none');
    $('.in-game_instructions').text('Please type the name of the country (or skip), and press enter');
    $('#text_answer').css('display','block');
    //make the text input area appear

  }
  if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
    window.synth.speak(utterThis);
  } 
  startTimer();


});

$('.restart').on('click',function(){
  //refresh the page
  //do i have to type location.reload();???
  location.reload();
});