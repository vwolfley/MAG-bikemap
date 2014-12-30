/*! config.js | MAG Bikeways */

var appConfig = new function() {

    this.Version = "v3.0.0 | 06/24/2014";

    // layers
    this.bikeMapURL = "http://geo.azmag.gov/gismag/rest/services/maps/BikePaths/MapServer";
    this.bikePointsURL = "http://geo.azmag.gov/gismag/rest/services/maps/BikePaths/MapServer";
    this.maricopaURL = "http://geo.azmag.gov/GISMAG/rest/services/maps/MaricopaCountyBoundary/MapServer";
    this.publicTransitURL = "http://geo.azmag.gov/gismag/rest/services/maps/PublicTransit/MapServer";
    this.bikeShopsURL = "http://geo.azmag.gov/gismag/rest/services/maps/BikeShops/MapServer";
    this.bikePicsURL = "http://geo.azmag.gov/gismag/rest/services/maps/BikePics/MapServer";

    this.MainURL = "http://geo.azmag.gov/gismag/rest/services/maps/BikeMap_New/MapServer";

    // email link
    this.emailLink = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

    this.initExtent = {
        "xmin": -12642942,
        "ymin": 3873732,
        "xmax": -12349424,
        "ymax": 4025842,
        "spatialReference": {
            "wkid": 102100
        }
    };

    this.center = [-112.255, 33.410];

}; // end appConfig