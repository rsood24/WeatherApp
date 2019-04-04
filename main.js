//////////////////////////////////////////////////////////////////////////
// Author: Ritesh Sood                                                  //
// This server takes a get request with a zip code parameter.           //
// It uses axios and the zip code provided to make an API call          //
// and gets back the latitude and longitude. With the new lat and lon   //
// values, it makes another API call and recieves back a set of links.  //
// From there it chooses the forecast link and makes an API call to it. //
// This returns all the forecast data for the original zip code.        //
// This data is then parsed for basic weather info which is then sent   //
// within the respose object, back to the original caller.              //
//////////////////////////////////////////////////////////////////////////
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());                              // Was running into an access origin error, so using cors

app.get('/zipcode/:zipCode', (req, res) => {      // recieve get request with zip code parameter.

  // URLs for the outside API calls.
  let latLonURL = 'https://us-zipcode.api.smartystreets.com/lookup?auth-id=a149b426-aa70-2816-4a50-e3dbee7098f6&auth-token=oFoh9eI3MDam3Jl0Jrvg&zipcode=' + req.params.zipCode;
  let WEATHER_URL = 'https://api.weather.gov/points/';
  var data;
  var forecast;
  var lat, lon;
  var aForecast = {                             // This is to format in which data will be sent in the response.
    'city':'',
    'state':'',
    'temp':'',
    'day':'',
    'forecast':'',
    'windSpeed':'',
    'windDirection':'',
    'date':'',
    'status': ''
  }

  axios.get(latLonURL)                        // First outside API call
  .then(response => {

    data = JSON.stringify(response.data);
    data = JSON.parse(data);                  // Turn response data into JSON object

    if(data[0].status !== "invalid_zipcode"){     // Check to see if zip code is invalid

      lat = data[0].zipcodes[0].latitude;             // if valid store the lattitude, longitude, state and city of zip code
      lon = data[0].zipcodes[0].longitude;
      aForecast.city = data[0].city_states[0].city;
      aForecast.state = data[0].city_states[0].state;
      aForecast.status = data[0].status;

      axios.get(WEATHER_URL+lat + ','+lon)                // Second API call with latitude and longitude passed in
      .then(response => {

        data = JSON.stringify(response.data);
        data = JSON.parse(data);                          // Get JSON object from response data


        axios.get(data.properties.forecast)               // Make final API call with forecast link from previous response
        .then(response => {

          data = JSON.stringify(response.data);
          data = JSON.parse(data);                                // Weather forecast data for zipcode
          weather = [];                                           // weather array stores forecast objects for different days
          for (i = 0; i < data.properties.periods.length; i++){   // Store only the data we care about
            //if(data.properties.periods[i].isDaytime){
              var segment = JSON.parse(JSON.stringify(aForecast));
              segment.temp = data.properties.periods[i].temperature;
              segment.day = data.properties.periods[i].name;
              segment.forecast = data.properties.periods[i].detailedForecast;
              segment.windSpeed = data.properties.periods[i].windSpeed;
              segment.windDirection = data.properties.periods[i].windDirection;
              aDate = data.properties.periods[i].startTime.split('T');
              aDate = aDate[0].split('-');
              segment.date = aDate[1] + '/' + aDate[2];
              weather.push(segment);
            //}
            console.dir(weather);
          }
          res.json(weather);
        })
      })
    } else {
      aForecast.status = data[0].status;                      // if zip code is invalid, send just the status.
      res.json(aForecast);
    }

  })
  .catch(error => {
    console.log(error);
  });

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))





