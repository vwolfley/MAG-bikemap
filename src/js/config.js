/* ========================================================================
 * MAG Bikeways
 * Maricopa Association of Governments
 * @file config.js
 * @summary JavaScript config file for MAG Bikeways Viewer
 * @version 3.3.1 | 11/21/2017
 * http://ims.azmag.gov/
 * ========================================================================
 * @copyright 2017 MAG
 * @license MIT
 * ========================================================================
 */
/*! ============================================================
 * @file config.js | @version 3.3.1 | 11/21/2017 | MAG Bikeways
 * =============================================================
 */
var appConfig = new function() {

    this.Version = "v3.3.1 | 11/21/2017";
    this.copyright = "2017";

    // layers
    this.MainURL = "https://geo.azmag.gov/gismag/rest/services/maps/BikeMap/MapServer";

    this.geoCoderService = "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
    // http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer

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
