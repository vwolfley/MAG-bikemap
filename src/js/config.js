/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Bikeways
 * ========================================================================
 * @file        config.js
 * @summary     JavaScript config file for MAG Bikeways Viewer
 * ========================================================================
 */
var appConfig = new function() {

    this.Version = "v3.3.4 | 2018-07-02";
    this.copyright = "2017";

    // layers
    this.MainURL = "https://geo.azmag.gov/gismag/rest/services/maps/BikeMap/MapServer";

    this.geoCoderService = "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
    // http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer

    // email link
    // this.emailLink = "https://www.azmag.gov/EmailPages/JasonHoward.asp";
    this.emailLink = "http://www.azmag.gov/Contact/4788?s=geo.azmag.gov/maps/bikemap&n=Jason%20Howard&popUp=true";

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
