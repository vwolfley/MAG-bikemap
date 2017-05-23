/* ========================================================================
 * MAG Bikeways
 * Maricopa Association of Governments
 * @file main.js
 * @summary JavaScript document for MAG Bikeways Viewer
 * @version 3.2.1 | 04/27/2017
 * http://ims.azmag.gov/
 * ========================================================================
 * @copyright 2017 MAG
 * @license MIT
 * ========================================================================
 */
/*! ==========================================================
 * @file main.js | @version 3.2.1 | 04/27/2017 | MAG Bikeways
 * ===========================================================
 */
require([
        "dojo/dom",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",
        "dojo/query",

        "esri/map",

        "esri/tasks/locator",
        "esri/dijit/BasemapToggle",
        "esri/dijit/HomeButton",
        "esri/dijit/Search",
        "esri/geometry/Extent",

        "esri/InfoTemplate",
        "esri/layers/FeatureLayer",
        "esri/dijit/Popup",

        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ImageParameters",

        "esri/dijit/Legend",
        "dijit/form/CheckBox",
        "dojo/_base/array",

        "esri/graphic",
        "esri/geometry/Point",

        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "dojo/_base/Color",
        "dojo/domReady!"
    ],
    function(dom, dc, on, parser, ready, query, Map, Locator, BasemapToggle, HomeButton, Search, Extent, InfoTemplate, FeatureLayer, Popup, ArcGISDynamicMapServiceLayer, ImageParameters, Legend, CheckBox, arrayUtils, Graphic, Point, PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color) {
        parser.parse();

        var map;
        var geolocation = null;
        var tocLayers = [];
        var legendLayers = [];

        ready(function() {

            // create a new symbols to highlight popup features
            var pointSymbol = new SimpleMarkerSymbol("circle", 32, null,
                new Color([0, 0, 0, 0.25]));

            var lineSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([0, 0, 0, 0.35]), 5), null);

            var popup = new Popup({
                // fillSymbol:
                // lineSymbol: lineSymbol,
                markerSymbol: pointSymbol,
                visibleWhenEmpty: false,
                hideDelay: -1
            }, dc.create("div"));

            map = new Map("mapDiv", {
                basemap: "streets", //"gray"
                center: appConfig.center,
                zoom: 1,
                minZoom: 10,
                maxZoom: 19,
                sliderPosition: "bottom-right",
                showAttribution: false,
                logo: false,
                infoWindow: popup
            });

            // create div for basemap toggle
            var toggle = new BasemapToggle({
                // theme: "basemapToggle",
                map: map,
                visible: true,
                basemap: "satellite"
            }, dc.create("div", {
                id: "BasemapToggle"
            }, "mapDiv", "last"));
            toggle.startup();

            // create div for homebutton
            var homeButton = new HomeButton({
                map: map,
                visible: true //show the button
            }, dc.create("div", {
                id: "HomeButton"
            }, "mapDiv", "after"));
            homeButton._homeNode.title = "Original Extent";
            homeButton.startup();

            var sourcesConfig = [{
                locator: new Locator(appConfig.geoCoderService),
                singleLineFieldName: "SingleLine",
                countryCode: "US",
                autoNavigate: true,
                highlightSymbol: new PictureMarkerSymbol("https://js.arcgis.com/3.17/esri/dijit/Search/images/search-pointer.png", 36, 36).setOffset(9, 18),
                enableLabel: false,
                enableInfoWindow: true,
                showInfoWindowOnSelect: false,
                enableHighlight: true,
                autoSelect: false,
                name: "Address",
                searchExtent: new Extent({
                    "xmin": -114.68,
                    "ymin": 31.29,
                    "xmax": -109.06,
                    "ymax": 36.99
                }),
                placeholder: "302 N 1st Ave, Phoenix, Arizona"
            }, {
                featureLayer: new FeatureLayer(appConfig.MainURL + "/6"),
                searchFields: ["Name"],
                displayField: "Name",
                name: "Bike Shops",
                outFields: ["Name", "Address", "City", "Phone", "Website", "Facebook"],
                highlightSymbol: new PictureMarkerSymbol("https://js.arcgis.com/3.17/esri/dijit/Search/images/search-pointer.png", 36, 36).setOffset(9, 18),
                enableLabel: false,
                enableInfoWindow: true,
                showInfoWindowOnSelect: false,
                enableHighlight: true,
                placeholder: "Bike Shops"
            }];

            // create div for search
            var search = new Search({
                map: map,
                sources: []
            }, "search");
            search.set("sources", sourcesConfig);
            search.startup();
            $("#search").hide();

            on(dom.byId("geolocationButton"), "click", getLocation);

            //add a feature layer US Bike Route 90
            //=================================================================================>
            var content8 = "<strong>${Name}</strong></br>" + "${MPA}</br>" + "${COUNTY} County</br>"  + "${MILES:NumberFormat(places:1)} miles";
            var template8 = new InfoTemplate("USBR90", content8);
            var us90 = new FeatureLayer(appConfig.MainURL + "/3", {
                id: "USBR90",
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 0.65,
                outFields: ["Name", "COUNTY", "MPA", "MILES"],
                infoTemplate: template8
            });
            // map.addLayer(us90);

            // for checkbox turns layer on and off
            $("#us90").click(function() {
                if ($(this).is(":checked")) {
                    us90.show();
                } else {
                    us90.hide();
                }
            });

            //add a feature layer Phoenix Sonoran Bikeway
            //=================================================================================>
            var content9 = "<strong>${Name}</strong></br>" + "${MPA}</br>" + "${Miles:NumberFormat(places:1)} miles";
            var template9 = new InfoTemplate("PSBikeway", content9);
            var psbikeway = new FeatureLayer(appConfig.MainURL + "/4", {
                id: "PSBikeway",
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 0.65,
                outFields: ["Name", "MPA", "Miles"],
                infoTemplate: template9
            });
            // map.addLayer(psbikeway);

            // for checkbox turns layer on and off
            $("#psbikeway").click(function() {
                if ($(this).is(":checked")) {
                    psbikeway.show();
                } else {
                    psbikeway.hide();
                }
            });

            //add a dynamic layer Bikeways Paths
            //=================================================================================>
            var bikewaysParms = new ImageParameters();
            bikewaysParms.layerIds = [0, 1, 2];
            bikewaysParms.layerOption = ImageParameters.LAYER_OPTION_SHOW;

            var content1 = "<strong>${NAME}</strong><br>${CITY}<br><small>MAGID: ${MAGID}</small>";
            var template1 = new InfoTemplate("${PATHTYPE}", content1);

            var bikeways = new ArcGISDynamicMapServiceLayer(appConfig.MainURL, {
                id: "Bike Paths",
                visible: true,
                opacity: 0.75,
                imageParameters: bikewaysParms,
                outFields: ["NAME", "CITY", "MAGID", "PATHTYPE"],
                infoTemplate: template1
            });
            bikeways.setInfoTemplates({
                0: {
                    infoTemplate: template1
                },
                1: {
                    infoTemplate: template1
                },
                2: {
                    infoTemplate: template1
                }
            });

            //add a feature layer Bikeways Crossings
            //=================================================================================>
            var content12 = "<strong>${Discript}</strong><br>${City}<br><small>MAGID: ${MAGID}</small>";
            var template12 = new InfoTemplate("Bikeways Crossing", content12);
            var crossings = new FeatureLayer(appConfig.MainURL + "/5", {
                id: "crossings",
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 0.75,
                outFields: ["Discript", "City", "MAGID"],
                infoTemplate: template12
            });
            // map.addLayer(crossings);

            // for checkbox turns layer on and off
            $("#crossings").click(function() {
                if ($(this).is(":checked")) {
                    crossings.show();
                } else {
                    crossings.hide();
                }
            });

            //add a feature layer Light Rail
            //=================================================================================>
            var content5 = "Light Rail Route</br>" + "${Route}</br>" + "${City}";
            var template5 = new InfoTemplate("Light Rail", content5);
            var lightrail = new FeatureLayer(appConfig.MainURL + "/8", {
                id: "Light Rail",
                visible: true,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["Route", "City"],
                infoTemplate: template5
            });
            // map.addLayer(lightrail);

            // // for checkbox turns layer on and off
            // $("#lightrail").click(function() {
            //     if ($(this).is(":checked")) {
            //         lightrail.show();
            //     } else {
            //         lightrail.hide();
            //     }
            // });

            //add a feature layer Public Transit Locations
            //=================================================================================>
            var content4 = "<strong>${Name}</strong><br>${Location}<br>${City}<br><a target='_blank'href=${webLink}>Transit Web Link Info</a>";
            var template4 = new InfoTemplate("${Category}", content4);
            var transit = new FeatureLayer(appConfig.MainURL + "/7", {
                id: "Transit Locations",
                visible: true,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["Name", "Location", "City", "webLink", "Category"],
                infoTemplate: template4
            });
            // map.addLayer(transit);

            // beginning status of checkbox
            $("#transit").prop("checked", true);

            // for checkbox turns layer on and off
            $("#transit").click(function() {
                if ($(this).is(":checked")) {
                    transit.show();
                    lightrail.show();
                } else {
                    transit.hide();
                    lightrail.hide();
                }
            });

            //add a feature layer Bike Shops
            //=================================================================================>
            var content3 = "<strong>${Name}</strong><br>${Address}<br>${City}<br>${Phone}<br><a target='_blank'href=https://${Website}>${Website}</a></br>" +
            "<a target='blank' href=https://${Facebook}>Facebook</a>";
            var template3 = new InfoTemplate("Bike Shop", content3);
            var bikeshops = new FeatureLayer(appConfig.MainURL + "/6", {
                id: "Bike Shops",
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["Name", "Address", "City", "Phone", "Website", "Facebook"],
                infoTemplate: template3
            });
            // map.addLayer(bikeshops);

            // for checkbox turns layer on and off
            $("#bikeshops").click(function() {
                if ($(this).is(":checked")) {
                    bikeshops.show();
                } else {
                    bikeshops.hide();
                }
            });

            //add a feature layer Bike Route Pictures
            //=================================================================================>
            var content6 = "<strong>${Name}</strong><br><img class='pics' src='img/bikepics/${urlName}.jpg'><br>${Discription}";
            var template6 = new InfoTemplate("Bike Route Pictures", content6);
            var bikepics = new FeatureLayer(appConfig.MainURL + "/9", {
                id: "Bikeways Pics",
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["Name", "urlName"],
                infoTemplate: template6
            });
            // map.addLayer(bikepics);

            // add a feature layer for Bike Youtube Videos
            var content8 = "<strong>${Name}</strong><br><iframe class='youTube' src='${Link}' frameborder='0' allowfullscreen></iframe><br>${Discription}";
            var template8 = new InfoTemplate("Bike Route Videos", content8);
            var bikevideos = new FeatureLayer(appConfig.MainURL + "/10", {
                id: "Bikeways Videos",
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["Name", "Discription", "Link"],
                infoTemplate: template8
            });
            // map.addLayer(bikevideos);

            // for checkbox turns layer on and off
            $("#bikepics").click(function() {
                if ($(this).is(":checked")) {
                    bikepics.show();
                    bikevideos.show();
                } else {
                    bikepics.hide();
                    bikevideos.hide();
                }
            });

            //add a feature layer GRID Bike Share locations
            //=================================================================================>
            var content7 = "<strong>${Station_Name}</strong><br>Location: ${Station_Location}<br>Station Number: ${Station_Number}<br><a href='https://www.gridbikes.com/' target='_blank'>www.gridbikes.com</a>";
            var template7 = new InfoTemplate("GRID Bike Share", content7);
            var GRID = new FeatureLayer(appConfig.MainURL + "/11", {
                id: "GRID Bike Share",
                visible: false,
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["Station_Name", "Station_Location", "Station_Number"],
                infoTemplate: template7
            });
            // map.addLayer(GRID);

            // for checkbox turns layer on and off
            $("#grid").click(function() {
                if ($(this).is(":checked")) {
                    GRID.show();
                } else {
                    GRID.hide();
                }
            });

            //add a feature layer MAG MPO Boundary
            //=================================================================================>
            var mpoBoundary = new FeatureLayer(appConfig.MainURL + "/12", {
                id: "MAG MPO Boundary",
                visible: true,
                mode: FeatureLayer.MODE_ONDEMAND,
            });
            // map.addLayer(mpoBoundary);

            map.addLayers([psbikeway, us90, bikeways, crossings, lightrail, transit, bikeshops, bikepics, bikevideos, GRID, mpoBoundary]);
            // map.addLayers([psbikeway, us90, bikeways0, bikeways1, bikeways2, crossings, lightrail, transit, bikeshops, bikepics, bikevideos, GRID, mpoBoundary]);

            // Map Layers
            //=================================================================================>
            tocLayers.push({
                layer: bikeshops,
                title: "Bike Shops"
            });
            tocLayers.push({
                layer: bikepics,
                title: "Bikeways Pics"
            });
            tocLayers.push({
                layer: crossings,
                title: "Bike Crossings Types"
            });
            tocLayers.push({
                layer: transit,
                title: "Transit Locations"
            });
            tocLayers.push({
                layer: lightrail,
                title: "Light Rail"
            });
            tocLayers.push({
                layer: GRID,
                title: "GRID Bike Share"
            });
            tocLayers.push({
                layer: us90,
                title: "US Bike Route 90"
            });
            tocLayers.push({
                layer: psbikeway,
                title: "Phoenix Sonoran Bikeway"
            });
            // console.log(tocLayers);

            // Legend Layers
            //=================================================================================>
            legendLayers.push({
                layer: mpoBoundary,
                title: "MAG MPO Boundary"
            });
            legendLayers.push({
                layer: GRID,
                title: "GRID Bike Share"
            });
            legendLayers.push({
                layer: bikepics,
                title: "Bikeways Pics"
            });
            legendLayers.push({
                layer: bikeshops,
                title: "Bike Shops"
            });
            legendLayers.push({
                layer: transit,
                title: "Transit Locations"
            });
            legendLayers.push({
                layer: lightrail,
                title: "Light Rail"
            });
            legendLayers.push({
                layer: crossings,
                title: "Bikeways Crossings"
            });
            legendLayers.push({
                layer: psbikeway,
                title: "Phoenix Sonoran Bikeway"
            });
            legendLayers.push({
                layer: us90,
                title: "US Bike Route 90"
            });
            legendLayers.push({
                layer: bikeways,
                title: "Bikeways Types"
            });
            // legendLayers.push({
            //     layer: bikeways1,
            //     title: "Bikeways Types"
            // });
            // legendLayers.push({
            //     layer: bikeways2,
            //     title: "Bikeways Types"
            // });
            // console.log(legendLayers);

            // create legend dijit
            var legend = new Legend({
                map: map,
                layerInfos: legendLayers
            }, "legendDiv");
            legend.startup();

            // add version control number to help
            dom.byId("version").innerHTML = appConfig.Version;

            // used to refresh map on page changes
            map.reposition();
            map.resize();

        }); // end ready function

        //use the geolocation api to get the current location
        //=================================================================================>
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(zoomToLocation, locationError, {
                    setHighAccuracy: true
                });
            }
        }

        // Create the marker symbol
        var markerSymbol = new PictureMarkerSymbol({
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriPMS",
            "url": "img/green-pin.png",
            "width": 35,
            "height": 35
        });

        function locationError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("Location not provided");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.log("Current location not available");
                    break;
                case error.TIMEOUT:
                    console.log("Timeout");
                    break;
                default:
                    console.log("unknown error");
                    break;
            }
        }

        function zoomToLocation(location) {
            var pt = esri.geometry.geographicToWebMercator(new Point(location.coords.longitude, location.coords.latitude));
            map.graphics.add(new Graphic(pt, markerSymbol));
            map.centerAndZoom(pt, 22);
        }

        // on main help page
        $("#version").html(appConfig.Version);
        // $("#legal").load

    }); // end of main function

// Page Bindings
//=================================================================================>
//
$(document).ready(function() {
    $("#Info").load("views/infoPage.html");
    $("#Safety").load("views/safteyPage.html");
    $("#OnStreet").load("views/onStreetPage.html");
    $("#OnPaths").load("views/onPathsPage.html");
    $("#Legend").load("views/legendPage.html");
    $("#Legal").load("views/legalPage.html");
    $("#Help").load("views/helpPage.html");

    // $("#Layers").load("views/layersPage.html");
});

//*** open email window ***//
//=================================================================================>
function openemailwin() {
    var emailURL = appConfig.emailLink;

    // used to center popup in dual-screen computers
    // Fixes dual-screen position               Most browsers      Firefox
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
    var w = 600;
    var h = 660;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;

    var newWindow = window.open(emailURL, "", "resizable=no,location=no,menubar=no,status=no,toolbar=no,fullscreen=no,dependent=no,directories=no,copyhistory=no,scrollbars=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}

function opensearchwin() {
    if ($("#search").is(":hidden")) {
        $("#search").show();
    } else {
        $("#search").hide();
    }
}