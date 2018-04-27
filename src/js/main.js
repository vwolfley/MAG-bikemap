var app = {};
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "esri/widgets/Legend",
    "esri/widgets/BasemapToggle",
    "dojo/domReady!"
], function (Map, MapView, MapImageLayer, Legend, BasemapToggle) {

    app.map = new Map({
        basemap: "streets"
    });

    app.view = new MapView({
        container: "viewDiv",
        map: app.map,
        extent: config.initExtent
    });

    app.view.ui.remove("attribution");

    var toggle = new BasemapToggle({
        view: app.view,
        nextBasemap: "hybrid"
    });
    app.view.ui.add(toggle, "top-left");

    app.view.when(function () {
        $.get(config.mainUrl + "/?f=json", function (data) {
            $.each(JSON.parse(data).layers, function (key, layer) {
                for (const conf of config.layers) {
                    if (conf.layerName === layer.name) {
                        conf.index = layer.id;
                        break;
                    }
                }
            });
            addLayersToMap();
            startLegend();
        });
    });
    var bikeRenderer = {
        type: "unique-value",
        field: "PathType",
        defaultSymbol: {
            type: "simple-line",
            width: 20,
        },
        uniqueValueInfos: [{
            value: "Bike Lane",
            symbol: {
                type: "simple-line",
                color: "blue",
                width: 2,
                style: "solid"
            }
        }, {
            value: "Bike Route",
            symbol: {
                type: "simple-line",
                color: "green",
                width: 2,
                style: "solid"
            }
        }, {
            value: "Paved Shoulder",
            symbol: {
                type: "simple-line",
                color: "purple",
                width: 2,
                style: "solid"
            }
        }, {
            value: "Multi-Use Path - Paved",
            symbol: {
                type: "simple-line",
                color: "red",
                width: 2,
                style: "solid"
            }
        }, {
            value: "Multi-Use Path - Unpaved",
            symbol: {
                type: "simple-line",
                color: "orange",
                width: 2,
                style: "solid"
            }
        }, {
            value: "Recreational Trail",
            symbol: {
                type: "simple-line",
                color: "brown",
                width: 2,
                style: "solid"
            }
        }]
    };

    app.popupSetup = function (value, key, data) {
        var html = "";

        if (data.PATHTYPE) {
            html += `<span class="popupItem"><span class="popupLabel">Type:</span> <span>${data.PATHTYPE}</span></span>`;
        }
        if (data.NAME) {
            html += `<span class="popupItem"><span class="popupLabel">Location:</span> <span>${data.NAME}</span></span>`;
        }
        if (data.CITY) {
            html += `<span class="popupItem"><span class="popupLabel">City:</span> <span>${data.CITY}</span></span>`;
        }
        if (data.SURFACE) {
            html += `<span class="popupItem"><span class="popupLabel">Surface Type:</span> <span>${data.SURFACE}</span></span>`;
        }

        return html;
    };

    var pTemplate = {
        title: "{PATHTYPE}",
        content: `<span style='display:none;'>{PATHTYPE}{NAME}{CITY}{SURFACE}</span>{PATHTYPE: app.popupSetup}`
    }

    var mainLayer = new MapImageLayer({
        url: config.mainUrl,
        opacity: .8,
        sublayers: [{
            id: 0,
            visible: true,
            popupTemplate: pTemplate,
            renderer: bikeRenderer,
            minScale: 0,
            maxScale: 144447,
        }, {
            id: 1,
            visible: true,
            popupTemplate: pTemplate,
            renderer: bikeRenderer,
            minScale: 144447.01,
            maxScale: 40001
        }, {
            id: 2,
            visible: true,
            popupTemplate: pTemplate,
            renderer: bikeRenderer,
            minScale: 40000,
            maxScale: 0
        }]
    });

    $("#legal").load("views/legalPage.html");


    // function watchScale() {
    //     app.view.watch("scale", function (scale) {
    //         // console.log(scale);
    //     });
    // }



    // var legend = new Legend({
    //     view: app.view,
    //     layerInfos: [{
    //         layer: mainLayer,
    //         title: "Legend"
    //     }]
    // });
    // app.view.ui.add(legend, "bottom-right");

    app.map.add(mainLayer);


    $("#testBtn").click(function () {
        $("#sidePanel").fadeToggle(200);
    });



});