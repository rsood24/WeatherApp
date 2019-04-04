# WeatherApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Author

Ritesh Sood

## Description

This is a basic Angular app, which prompts the user for a zip code and displays weather information for the provided zip code.
The front-end JavaScript does error checking on if there are 5 digits and if all are numeric values. The app makes a single API call to the node.js server in the main.js file. This server in turn makes all the outside api calls to gather weather data and send back to the front end. To check for invalid zipcode, the app has to wait for the API calls to return. This error check is done when back-end server sends a response to the front end. The response includes a status flag which identifies if the zip code is valid. I seperated the front end from outgoing api calls because, in order to get basic weather info, the app has to make multiple calls and parse all the data returned. I wanted to seperate this data cleaning process from the front end. This way when the front end makes a request it gets clean data back, which is ready to use.

The app is rendered entirely on one page. I did not build out multiple components for different parts of the UI. This was a small scale app, so all UI elements exist within a single component, the app component.

All the Angular code files are within src/app.
The back-end server is main.js.

## Development server

Run `node main.js`to start node backend server. This runs on `http://localhost:3000/`. The front end makes calls to this node server. The node server then takes the zip code parameter and makes appropriate outgoing api calls to gather the weather information. Then the server constructs a response object with basic info about the weather and sends it to the Angular front end.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
