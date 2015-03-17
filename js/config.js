/*! config.js | MAG Bikeways */

var appConfig = new function() {

    this.Version = "v3.0.0 | 06/24/2014";

    // layers
    this.MainURL = "http://geo.azmag.gov/gismag/rest/services/maps/BikeMap_New/MapServer";

    // email link
    this.emailLink = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

    this.initExtent = {
        "xmin": -12621311,
        "ymin": 3879618,
        "xmax": -12327792,
        "ymax": 4031727,
        "spatialReference": {
            "wkid": 102100
        }
    };

    this.center = [-112.061, 33.454];

}; // end appConfig