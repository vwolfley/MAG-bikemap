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


    this.jasonemail = "https://www.azmag.gov/EmailPages/JasonHoward.asp";



    this.lods = [ {"level" : 9, "resolution" : 305.748113140558, "scale" : 1155581.108577},
                {"level" : 10, "resolution" : 152.874056570411, "scale" : 577790.554289},
                {"level" : 11, "resolution" : 76.4370282850732, "scale" : 288895.277144},
                {"level" : 12, "resolution" : 38.2185141425366, "scale" : 144447.638572},
                {"level" : 13, "resolution" : 19.1092570712683, "scale" : 72223.819286},
                {"level" : 14, "resolution" : 9.55462853563415, "scale" : 36111.909643},
                {"level" : 15, "resolution" : 4.77731426794937, "scale" : 18055.954822},
                {"level" : 16, "resolution" : 2.38865713397468, "scale" : 9027.977411},
                {"level" : 17, "resolution" : 1.19432856685505, "scale" : 4513.988705},
                {"level" : 18, "resolution" : 0.597164283559817, "scale" : 2256.994353},
                {"level" : 19, "resolution" : 0.298582141647617, "scale" : 1128.497176} ];

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