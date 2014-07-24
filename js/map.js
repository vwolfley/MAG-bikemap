//*** JavaScript Document  ***//

//*** DOJO REQUIRES ***//
dojo.require("esri.map");
dojo.require("esri.tasks.query");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.dijit.PopupMobile");

//*** VARIABLES ***//
var map;
var trackMyLocation = false;
var graphic;
var updatedNum = 0;
var currLocation;
var watchId;
var loading;
var basemapsteetsURL = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";
var basemapimageryURL = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";

//*** MAG Map Services ***//
var bikeMapURL = "http://geo.azmag.gov/GISMAG/rest/services/maps/bikepathinfo/MapServer";
var bikePointsURL = "http://geo.azmag.gov/GISMAG/rest/services/maps/bikepoints/MapServer";
var maricopaURL = "http://geo.azmag.gov/GISMAG/rest/services/maps/MaricopaCountyBoundary/MapServer";
var jasonemail = "https://www.azmag.gov/EmailPages/JasonHoward.asp";

var lods = [ {"level" : 9, "resolution" : 305.748113140558, "scale" : 1155581.108577},
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

//**********************************************************************************
function init() {
	$(document).ready(jQueryReady)

        //onorientationchange doesn't always fire in a timely manner in Android so check for both orientationchange and resize
        var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

        window.addEventListener(orientationEvent, function() {
                orientationChanged();
        }, false);
}
//*********************************************************************************
function jQueryReady() {
    var initialExtent =  new esri.geometry.Extent({
            "xmin": -12543622,
			"ymin": 3923894,
			"xmax": -12396863,
			"ymax": 3996586,
				"spatialReference": {
					"wkid": 102100
				}
		});

    map = new esri.Map("map", {
        extent: initialExtent,
		lods: lods,
        logo: false
    });

    //*** Base Maps ***//
	//********************************************************************************
    STREETMAP = new esri.layers.ArcGISTiledMapServiceLayer(basemapsteetsURL, {
        id: "Map"
    });
    map.addLayer(STREETMAP);

    AERIAL = new esri.layers.ArcGISTiledMapServiceLayer(basemapimageryURL, {
       id: "Aerial"
    });
    map.addLayer(AERIAL);
    AERIAL.hide();

	//*** Layers and Query Tasks ***//
	//********************************************************************************
	//**************** Bike Paths ***************//
    dojo.connect(map, "onLoad", function (evt) {
            //add a feature layer
            var content = "${NameAlt}";
            var infoTemplate = new esri.InfoTemplate("<b>${PathType}</b>", content);
            var featureLayer = new esri.layers.FeatureLayer(bikeMapURL + "/1", {
                mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
                outFields : ["*"],
                infoTemplate : infoTemplate
            });

            var symbol = new esri.symbol.SimpleLineSymbol().setColor([0, 255, 255]).setWidth(10);

            //Create the graphics layer for a highligted on street parking line
                // var symbolOnstreetHighlight = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 255, 0, 0.25]), 30);
                // var rendererOnstreetHighlights = new esri.renderer.SimpleRenderer(symbolOnstreetHighlight);
                // graphicsLayerOnstreetHighlight = new esri.layers.GraphicsLayer();
                // graphicsLayerOnstreetHighlight.setRenderer(rendererOnstreetHighlights);
                // map.addLayer(graphicsLayerOnstreetHighlight);



             dojo.connect(featureLayer, 'onClick', function (evt) {
                    map.graphics.clear();
                    var graphic = new esri.Graphic(evt.mapPoint, symbol);
                    map.graphics.add(graphic);

                    //select the clicked feature
                    var query = new esri.tasks.Query();
                    query.geometry = evt.mapPoint;
                    featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);
            });

            dojo.connect(map.infoWindow, "onHide", function () {
                    map.graphics.clear();
            });
            map.addLayer(featureLayer);
    });
	//**************** Light Rail Path***************//
    dojo.connect(map, "onLoad", function (evt) {
            //add a feature layer
            var content = "${SERVICE}<br>${CITY}";
            var infoTemplate = new esri.InfoTemplate("<b>Light Rail</b>", content);
            var featureLayer = new esri.layers.FeatureLayer(bikeMapURL + "/2", {
                    mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
                    outFields : ["*"],
                    infoTemplate : infoTemplate
            });

            var symbol = new esri.symbol.SimpleLineSymbol().setColor([0, 255, 255]).setWidth(10);

             dojo.connect(featureLayer, 'onClick', function (evt) {
                    map.graphics.clear();
                    var graphic = new esri.Graphic(evt.mapPoint, symbol);
                    map.graphics.add(graphic);

                    //select the clicked feature
                    var query = new esri.tasks.Query();
                    query.geometry = evt.mapPoint;
                    featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);
            });

            dojo.connect(map.infoWindow, "onHide", function () {
                    map.graphics.clear();
            });
            map.addLayer(featureLayer);
    });
	//**************** Bike Path Crossings Info ***************//
    dojo.connect(map, "onLoad", function (evt) {
            //add a feature layer
            var content = "${Type}<br>${City}";
            var info = new esri.InfoTemplate("<b>Bike Path Crossing</b>", content);
            var featureLayer = new esri.layers.FeatureLayer(bikeMapURL + "/0", {
                    mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
                    outFields : ["*"],
                    infoTemplate : info
            });

             var symbol = new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE).setSize(20).setColor([0, 0, 0, 0.35]);
                symbol.outline.setWidth("0").setColor([0, 0, 0]);

             dojo.connect(featureLayer, 'onClick', function(evt) {
                    map.graphics.clear();
                    var graphic = new esri.Graphic(evt.mapPoint, symbol);
                    map.graphics.add(graphic);

                    //select the clicked feature
                    var query = new esri.tasks.Query();
                    query.geometry = evt.mapPoint;
                    featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);
            });

            dojo.connect(map.infoWindow, "onHide", function () {
                    map.graphics.clear();
            });
            map.addLayer(featureLayer);
    });
	//**************** Bike Shops ***************//
    dojo.connect(map, "onLoad", function (evt) {
            //add a feature layer
            var content = "${Address}<br>${City}<br>Phone: ${Phone}<br>Website: <a target='_blank'href=http://${Website}>${Website}</a>";
            var info = new esri.InfoTemplate("<b>${Name}</b>", content);
            var featureLayer = new esri.layers.FeatureLayer(bikePointsURL + "/0", {
                    mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
                    outFields : ["*"],
                    infoTemplate : info
            });

             var symbol = new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE).setSize(20).setColor([0, 0, 0, 0.35]);
                symbol.outline.setWidth("0").setColor([0, 0, 0]);

             dojo.connect(featureLayer, 'onClick', function (evt) {
                    map.graphics.clear();
                    var graphic = new esri.Graphic(evt.mapPoint, symbol);
                    map.graphics.add(graphic);

                    //select the clicked feature
                    var query = new esri.tasks.Query();
                    query.geometry = evt.mapPoint;
                    featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);
            });

            dojo.connect(map.infoWindow, "onHide", function () {
                    map.graphics.clear();
            });
            map.addLayer(featureLayer);
    });
	//**************** Public Transit Info ***************//
    dojo.connect(map, "onLoad", function (evt) {
            //add a feature layer
            var content = "${Name}<br>${Location}<br>${City}";
            var info = new esri.InfoTemplate("<b>${Category}</b>", content);
            var featureLayer = new esri.layers.FeatureLayer(bikePointsURL + "/1", {
                    mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
                    outFields : ["*"],
                    infoTemplate : info
            });

             var symbol = new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE).setSize(20).setColor([0, 0, 0, 0.35]);
                symbol.outline.setWidth("0").setColor([0, 0, 0]);

             dojo.connect(featureLayer, 'onClick', function (evt) {
                    map.graphics.clear();
                    var graphic = new esri.Graphic(evt.mapPoint, symbol);
                    map.graphics.add(graphic);

                    //select the clicked feature
                    var query = new esri.tasks.Query();
                    query.geometry = evt.mapPoint;
                    featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);
            });

            dojo.connect(map.infoWindow, "onHide", function () {
                    map.graphics.clear();
            });
            map.addLayer(featureLayer);
    });
	//**************************************************************************************
    //*** Maricopa County Boundary ***//
    maricopa = new esri.layers.ArcGISDynamicMapServiceLayer(maricopaURL, {
        id: "maricopa"
    });
    map.addLayer(maricopa);
	map.infoWindow.resize(230, 100);


	$('#mapPage').bind('pageshow', function (event, ui) {
	            orientationChanged()
	        })

    $('[type="radio"]').change(function () {
        $('[type="radio"]').each(function () {
            if (this.checked) {
                changeBaseMap(this.value);
                $('#Layers').dialog('close');
                return false;
            }
        })
    });


	initFunc();
}


function changeBaseMap(baselayer) {
    map.infoWindow.hide();
    switch (baselayer) {
    case STREETMAP:
    case "Map":
    case "map":
    default:
    	STREETMAP.show();
        AERIAL.hide();
        break;
    case AERIAL:
    case "Aerial":
    case "aerial":
        AERIAL.show();
        STREETMAP.hide();
        break;
    }
}

//***********************************************************************
//*** Geo Location ***//
function initFunc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(zoomToLocation, locationError, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 8700
        })
        navigator.geolocation.watchPosition(showLocation, locationError, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 8700
        })
    }
    if (navigator.userAgent.match(/Mobile/i)) {
        window.scrollTo(0, 1)
    }
}

function findMe() {
    console.log("Find me");
    navigator.geolocation.getCurrentPosition(zoomToLocation, locationError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 8700
    })
    navigator.geolocation.watchPosition(showLocation, locationError, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 8700
        })
}

function locationError(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
        alert("Location not provided");
        break;
    case error.POSITION_UNAVAILABLE:
        alert("Current location not available");
        break;
    case error.TIMEOUT:
        alert("Timeout");
        break;
    default:
        alert("unknown error");
        break
    }
}

function zoomToLocation(location) {
    var ptLL = new esri.geometry.Point(location.coords.longitude, location.coords.latitude);
    ptLL = esri.geometry.geographicToWebMercator(ptLL);
    if (!graphic && map.graphics) {
        var symbol = new esri.symbol.PictureMarkerSymbol('images/bluedot.png', 40, 40);
        graphic = new esri.Graphic(ptLL, symbol);
        map.graphics.add(graphic);
        map.centerAndZoom(ptLL, 16)
    } else if (graphic && map.graphics) {
        graphic.setGeometry(ptLL);
        map.centerAndZoom(ptLL, 16)
    }
}

function showLocation(location) {
    //zoom to the users location and add a graphic
    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
    if (!graphic) {
      addGraphic(pt);
    }
    else { //move the graphic if it already exists
      graphic.setGeometry(pt);
    }
    map.centerAt(pt);
}
//*** /Geo Location ***//
//*********************************************************************************
function orientationChanged() {
    console.log("Orientation changed: " + window.orientation);
    if(map) {
            map.reposition();
            map.resize();
    }
}
//************************
//*** open email window ***//
function openemailwin() {
    var emailURL = href=jasonemail;
    win = window.open(emailURL,'', 'resizable=no,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,fullscreen=no,dependent=no,width=600px,height=660px');
}
//*** /open email window ***//

dojo.addOnLoad(init);