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
  info;
  city;
  state;
  show = false;
  progress = false;
  readonly ROOT_URL = 'http://localhost:3000/zipcode/';

  data: Observable<object>;
  WeatherData: Observable<object>;


  constructor(private http: HttpClient) {}

  onSearch(form: NgForm) {
    if (form.value.zipCode.length === 5 && !isNaN(form.value.zipCode)) {
      this.progress = true;
      this.data = this.http.get(this.ROOT_URL + form.value.zipCode);
      this.data.subscribe((stuff) => {

         this.info = JSON.stringify(stuff);
         this.info = JSON.parse(this.info);

         console.dir(this.info);
         if (this.info.status === 'invalid_zipcode') {
          this.progress = false;
          this.show = false;
          alert('Invalid Zip Code!');
         } else {
            this.progress = false;
            this.show = true;
            this.city = this.info[0].city;
            this.state = this.info[0].state;
         }

      });

    } else if (form.value.zipCode.length !== 5) {
      alert('Invalid number of digits entered');
    } else if (isNaN(form.value.zipCode)) {
      alert('Numeric Values Only.');
    }
  }

  onWeatherClick() {
    this.show = false;
  }

}
