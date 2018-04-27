/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Bikeways
 * ========================================================================
 * @file        config.js
 * @summary     JavaScript config file for MAG Bikeways Viewer
 * ========================================================================
 */
var config = {
    version: "v3.3.3 | 2018-04-11",
    copyright: "2018",
    mainUrl: "https://geo.azmag.gov/gismag/rest/services/Test/BikeMap_Test/MapServer",
    geoCoderService: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
    emailLink: "http://www.azmag.gov/Contact/4788?s=geo.azmag.gov/maps/bikemap&n=Jason%20Howard&popUp=true",
    initExtent: {
        "xmin": -12621311,
        "ymin": 3879618,
        "xmax": -12327792,
        "ymax": 4031727,
        "spatialReference": {
            "wkid": 102100
        }
    },
    layers: [
        {
            id: "USBicycleRoute90",
            layerName: "US Bicycle Route 90",
            type: "feature",
            title: 'US Bicycle Route 90',
            visible: false,
            legend: {
                sort: 6
            }
        },
        {
            id: "PhoenixSonoranBikeway",
            layerName: "PhoenixSonoranBikeway",
            title: "Phoenix Sonoran Bikeway",
            type: "feature",
            visible: false,
            legend: {
                sort: 7
            }
        },
        {
            id: "Bikecrossings",
            title: "Bike Crossings",
            layerName: "Bikecrossings",
            type: "feature",
            visible: false,
            legend: {
                sort: 3
            }
        },
        {
            title: "Bike Shops",
            id: "BikeShops",
            layerName: "BikeShops",
            type: "feature",
            visible: false,
            legend: {
                sort: 1
            }
        },
        {
            layerName: "PublicTransit",
            type: "feature",
            visible: false
        },
        {
            title: "Light Rail & Transit Locations",
            id: "Lightrail",
            layerName: "Lightrail",
            type: "feature",
            visible: false,
            legend: {
                sort: 4
            }
        },
        {
            id: "BikePictures",
            title: "Bikeways Pics",
            layerName: "Bike Pictures",
            type: "feature",
            visible: false,
            legend: {
                sort: 2
            }
        },
        {
            id: "GridBikeShare",
            title: "GRID Bike Share",
            layerName: "GridBikeShare",
            type: "feature",
            visible: false,
            legend: {
                sort: 5
            }
        },
        {
            layerName: "MAG MPO Boundary",
            type: "feature",
            visible: false
        }
    ]
};