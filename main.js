const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());

app.get('/zipcode/:zipCode', (req, res) => {

  let latLonURL = 'https://us-zipcode.api.smartystreets.com/lookup?auth-id=a149b426-aa70-2816-4a50-e3dbee7098f6&auth-token=oFoh9eI3MDam3Jl0Jrvg&zipcode=' + req.params.zipCode;
  let WEATHER_URL = 'https://api.weather.gov/points/';
  var data;
  var forecast;
  var lat, lon;
  var aForecast = {
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
  
  axios.get(latLonURL)
  .then(response => {
    
    data = JSON.stringify(response.data);
    data = JSON.parse(data);
    
    if(data[0].status !== "invalid_zipcode"){
      lat = data[0].zipcodes[0].latitude;
      lon = data[0].zipcodes[0].longitude;
      aForecast.city = data[0].city_states[0].city;
      aForecast.state = data[0].city_states[0].state;
      aForecast.status = data[0].status;

      axios.get(WEATHER_URL+lat + ','+lon)
      .then(response => {

        data = JSON.stringify(response.data);
        data = JSON.parse(data);
       

        axios.get(data.properties.forecast)
        .then(response => {

          data = JSON.stringify(response.data);
          data = JSON.parse(data);
          weather = [];
          for (i = 0; i < data.properties.periods.length; i++){
            //if(data.properties.periods[i].isDaytime){
              var segment = JSON.parse(JSON.stringify(aForecast));
              segment.temp = data.properties.periods[i].temperature;
              segment.day = data.properties.periods[i].name;
              segment.forecast = data.properties.periods[i].detailedForecast;
              segment.windSpeed = data.properties.periods[i].windSpeed;
              segment.windDirection = data.properties.periods[i].windDirection;
              hold = data.properties.periods[i].startTime.split('T');
              hold = hold[0].split('-');
              segment.date = hold[1] + '/' + hold[2];
              weather.push(segment);
            //}
            console.dir(weather);
          }
          res.json(weather);
        })
      })
    } else {
      aForecast.status = data[0].status;
      res.json(aForecast);
    }
    
  })
  .catch(error => {
    console.log(error);
  });
  
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))





