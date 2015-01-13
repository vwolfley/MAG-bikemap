/*! main.js | MAG Bikeways */

require([
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/parser",
    "dojo/ready",

    "esri/map",

    "esri/tasks/locator",
    "esri/dijit/BasemapToggle",
    "esri/dijit/HomeButton",

    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",
    "esri/dijit/Popup",

    "esri/layers/ArcGISDynamicMapServiceLayer",

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
  function(dom, dc, on, parser, ready, Map, Locator, BasemapToggle, HomeButton, InfoTemplate, FeatureLayer, Popup, ArcGISDynamicMapServiceLayer, Legend, CheckBox, arrayUtils, Graphic, Point, PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color) {
    parser.parse();

    var map;
    var geolocation = null;
    var tocLayers = [];
    var legendLayers = [];

    ready(function() {

      // create a new symbols to highlight popup features
      var pointSymbol = new SimpleMarkerSymbol("circle", 32, null,
        new Color([0, 0, 0, 0.25]));
      var popup = new Popup({
        // fillSymbol:
        // lineSymbol:
        markerSymbol: pointSymbol
      }, dc.create("div"));

      map = new Map("mapDiv", {
        basemap: "streets",
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


      on(dom.byId("geolocationButton"), "click", getLocation);


      //add a feature layer Bikeways Types
      //=================================================================================>
      var content1 = "${NAME}<br>${CITY}<br><small>MAGID: ${MAGID}</small>";
      var template1 = new InfoTemplate("${PATHTYPE}", content1);
      var bikeways = new FeatureLayer(appConfig.bikeMapURL + "/1", {
        id: "paths",
        visible: true,
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 0.75,
        outFields: ["*"],
        infoTemplate: template1
      });
      map.addLayer(bikeways);
      // var content1 = "${NAME}<br>${CITY}<br><small>MAGID: ${MAGID}</small>";
      // var template1 = new InfoTemplate("${PATHTYPE}", content1);
      // var bikeways = new ArcGISDynamicMapServiceLayer(appConfig.MainURL, {
      //   id: "paths",
      //   visible: true,
      //   opacity: .75,
      //   outFields: ["*"],
      //   infoTemplate: template1
      // });
      // bikeways.setInfoTemplates({
      //   4: {
      //     infoTemplate: template1
      //   }
      // });
      // bikeways.setVisibleLayers([4]);
      // map.addLayer(bikeways);


      //add a feature layer Bikeways Crossings Types
      //=================================================================================>
      var content2 = "${Type}<br>${Discript}<br>${City}<br><small>MAGID: ${MAGID}</small>";
      var template2 = new InfoTemplate("Bikeways Crossing", content2);
      var crossings = new FeatureLayer(appConfig.bikeMapURL + "/0", {
        id: "crossings",
        visible: true,
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 0.75,
        outFields: ["*"],
        infoTemplate: template2
      });
      map.addLayer(crossings);

      //add a feature layer Bike Shops
      //=================================================================================>
      var content3 = "${Address}<br>${City}<br>Phone: ${Phone}<br>Website: <a target='_blank'href=http://${Website}>${Website}</a>";
      var template3 = new InfoTemplate("${Name}", content3);
      var bikeshops = new FeatureLayer(appConfig.bikeShopsURL + "/0", {
        id: "Bike Shops",
        visible: false,
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        infoTemplate: template3
      });
      map.addLayer(bikeshops);

      //add a feature layer Public Transit Locations
      //=================================================================================>
      var content4 = "${Name}<br>${Location}<br>${City}";
      var template4 = new InfoTemplate("${Category}", content4);
      var transit = new FeatureLayer(appConfig.publicTransitURL + "/0", {
        id: "Transit Locations",
        visible: true,
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        infoTemplate: template4
      });
      map.addLayer(transit);

      //add a feature layer Light Rail
      //=================================================================================>
      var content5 = "${SERVICE}<br>${CITY}";
      var template5 = new InfoTemplate("Light Rail", content5);
      var lightrail = new FeatureLayer(appConfig.publicTransitURL + "/1", {
        id: "Light Rail",
        visible: true,
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        infoTemplate: template5
      });
      map.addLayer(lightrail);

      //add a feature layer Bike Shops
      //=================================================================================>
      var content6 = "${Name}<br>${Discription}<br><img src='img/bikepics/${urlName}.jpg'>";
      var template6 = new InfoTemplate("${Name}", content6);
      var bikepics = new FeatureLayer(appConfig.bikePicsURL + "/0", {
        id: "Bikeways Pics",
        visible: true,
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        infoTemplate: template6
      });
      map.addLayer(bikepics);

      //TOC Layers
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
        layer: transit,
        title: "Transit Locations"
      });
      tocLayers.push({
        layer: lightrail,
        title: "Light Rail"
      });

      // Legend Layers
      //=================================================================================>
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
        layer: bikeways,
        title: "Bikeways Types"
      });

      // create legend dijit
      var legend = new Legend({
        map: map,
        layerInfos: legendLayers
      }, "legendDiv");
      legend.startup();

      // jQuery.each(tocLayers, function(index, layer) {
      //   console.log(this.value);
      // });

      $(".check").bind("click", function(layer) {
        // alert("Found YOU!");
        var chklayer = map.getLayer(this.value);
        chklayer.setVisibility(!chklayer.visible);
        this.checked = chklayer.visible;
      });

      // //add check boxes
      // arrayUtils.forEach(tocLayers, function (layer) {
      //   var layerName = layer.title;
      //   var checkBox = new CheckBox({
      //       name    : "checkBox" + layer.layer.id,
      //       value   : layer.layer.id,
      //       checked : layer.layer.visible,
      //       onChange:function () {
      //           var clayer = map.getLayer(this.value);
      //           clayer.setVisibility(!clayer.visible);
      //           this.checked = clayer.visible;
      //       }
      //   });

      //   //add the check box and label to the toc
      //   dc.place(checkBox.domNode, dom.byId("toggleDiv"));
      //   var checkLabel = dc.create("label", {
      //       "for":checkBox.name,
      //       innerHTML:"&nbsp;&nbsp;" + layerName
      //   }, checkBox.domNode, "after");
      //   dc.place("<br>", checkLabel, "after");
      // });


      // add version control number to help
      dom.byId("version").innerHTML = appConfig.Version;

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
  $("#Help").load("views/helpPage.html");
  $("#Safety").load("views/safteyPage.html");
  $("#OnStreet").load("views/onStreetPage.html");
  $("#OnPaths").load("views/onPathsPage.html");
  $("#Legend").load("views/legendPage.html");
  $("#Legal").load("views/legalPage.html");

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