import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { InternalFormsSharedModule } from '@angular/forms/src/directives';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = 'Weather-App';
  info;                                                                       // Variables to store data
  city;
  state;
  zipCode;
  show = false;                                                               // bool flags for displaying Weather info and progress bar
  progress = false;
  readonly ROOT_URL = 'http://localhost:3000/zipcode/';                       // The URL for main.js backend server

  data: Observable<object>;                                                   // objects to recieve response data
  WeatherData: Observable<object>;


  constructor(private http: HttpClient) {}

  //////////////////////////////////////////////////
  // Function for when user hits enter on zipcode.//
  // Takes the user form as an argument           //
  //////////////////////////////////////////////////
  onSearch(form: NgForm) {

    if (form.value.zipCode.length === 5 && !isNaN(form.value.zipCode)) {      // Error checking on the zip code
      this.progress = true;                                                   // Set true before api call. Displays spinning loading symbol
      this.data = this.http.get(this.ROOT_URL + form.value.zipCode);          // Send get request to back end with zip code.
      this.data.subscribe((stuff) => {

         this.info = JSON.stringify(stuff);
         this.info = JSON.parse(this.info);                                   // Get JSON object from response body

         if (this.info.status === 'invalid_zipcode') {                        // status check for if zip code is invalid
          this.progress = false;                                              // clear spinning circle flag
          this.show = false;                                                  // clear show weather data flag
          alert('Invalid Zip Code!');
         } else {
            this.progress = false;
            this.show = true;
            this.city = this.info[0].city;                                    // Store the city name for zip code
            this.state = this.info[0].state;                                  // Store the state name for zip code
            this.zipCode = form.value.zipCode;
         }

      });

    } else if (form.value.zipCode.length !== 5) {
      alert('Invalid number of digits entered');
    } else if (isNaN(form.value.zipCode)) {
      alert('Numeric Values Only.');
    }
  }

  /////////////////////////////////////////////////
  // This toggles displaying the zip code prompt //
  /////////////////////////////////////////////////
  onWeatherClick() {
    this.show = false;
  }

}
