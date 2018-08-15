/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Bikeways
 * ========================================================================
 * @file        config.js
 * @summary     JavaScript config file for MAG Bikeways Viewer
 * ========================================================================
 */

window.busArrivalTimes = function (value, key, data) {
    var url = 'https://valleymetro-api.sdg-hosting.com/v1/realtime/stop/' + data["NextRide"] + '?type=stop&limit=100&lookAheadSec=7200&stopId=' + data["NextRide"];

    $.get(url, function (results) {
        var $ul = $(".arrivalTimeTarget ul");
        var $msg = $(".arrivalMessage");
        var ulHtml = "";
        if (results.data.length === 0) {
            $msg.html("No arrival times found.");
        } else {
            $msg.html("Upcoming Arrival Times:");
        }
        for (var i = 0; i < results.data.length; i++) {
            if (i < 5) {
                var row = results.data[i];
                ulHtml += "<li>" + row.departureTimeFormatted + " - " + row.headsign + "</li>";
            }
        }
        $ul.html(ulHtml);
    });

    return "<div class='arrivalTimeTarget'><span class='arrivalMessage'>Loading arrival times...</span><ul></ul></div>";
}


const config = {
    mainUrl: 'https://geo.azmag.gov/gismag/rest/services/maps/BikeMap_main/MapServer',
    geoCoderService: '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    emailLink: 'http://www.azmag.gov/Contact/4788?s=geo.azmag.gov/maps/bikemap&n=Jason%20Howard&popUp=true',
    initExtent: {
        xmax: -12440689.69436449,
        xmin: -12488186.172632946,
        ymax: 3997729.942790663,
        ymin: 3921102.2911842205,
        spatialReference: {
            wkid: 102100
        }
    },
    layers: [
        // {
        //     title: 'MAG MPO Boundary',
        //     layerName: 'MAG MPO Boundary',
        //     type: 'image',
        //     visible: true
        // },
        {
            id: 'USBicycleRoute90',
            layerName: 'US Bicycle Route 90',
            type: 'feature',
            popup: {
                title: 'US Bicycle Route 90',
                content: `
                <strong>{Name}</strong>
                </br>
                {MPA}
                </br>
                {COUNTY} County
                `
            },
            title: 'US Bicycle Route 90',
            visible: false,
            legend: {
                sort: 6
            },
            definition: "A nationally designated cycling corridor that travels through the region. For more information please visit <a class='link' href='http://www.azbikeped.org/us-bicycle-route-90.asp'>azbikeped.org</a>"

        },
        {
            id: 'PhoenixSonoranBikeway',
            layerName: 'PhoenixSonoranBikeway',
            title: 'Phoenix Sonoran Bikeway',
            type: 'feature',
            popup: {
                title: 'Phoenix Sonoran Bikeway',
                content: `
                <strong>{Name}</strong>
                </br>
                {MPA}
                `
            },
            visible: false,
            legend: {
                sort: 7
            },
            definition: "A designated cycling corridor highlighting historic districts, mountain preserves, and cultural sites in the region. <a class='link' href'http://www.azbikeped.org/downloads/SonoranBike.pdf'>PDF Map</a>"
        },
        {
            id: 'Bikecrossings',
            title: 'Bike Crossings',
            layerName: 'Bikecrossings',
            opacity: 0.9,
            type: 'feature',
            popup: {
                title: 'Bikeways Crossing',
                content: `
                <strong>{Discript}</strong>
                <br>
                {City}
                <br>
                <small>MAGID: {MAGID}</small>
                `
            },
            visible: false,
            legend: {
                sort: 3
            },
            definition: "Locations where bicycles can safely cross major thoroughfares"
        },
        {
            id: "BusStops",
            title: "Bus Stops (must be zoomed in)",
            url: "https://services2.arcgis.com/2t1927381mhTgWNC/ArcGIS/rest/services/ValleyMetroBusStops/FeatureServer/",
            index: 0,
            type: "feature",
            visible: false,
            popup: {
                title: "<strong>{Location}</strong>",
                content: "{StopId:busArrivalTimes}"
            },
            legend: {
                imageData: "data:image/png;base64,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",
                sort: 8
            },
            definition: "Designated Local Bus Stops displaying upcoming arrival times"
        },
        {
            title: 'Bike Shops',
            id: 'BikeShops',
            layerName: 'BikeShops',
            type: 'feature',
            popup: {
                title: 'Bike Shop',
                content: `
                <strong>{NAME}</strong>
                <br>
                {ADDRESS}
                <br>
                {CITY}
                <br>
                {PHONE}
                <br>
                <a target='_blank'href=https://{WEBSITE}>{WEBSITE}</a>
                </br>
                <a target='blank' href=https://{FACEBOOK}>Facebook</a>
                `
            },
            visible: false,
            legend: {
                sort: 1
            },
            definition: "Bicycle retail and service locations"
        },
        {
            id: 'BikePictures',
            title: 'Bikeways Pics',
            layerName: 'Bike Pictures',
            type: 'feature',
            visible: false,
            popup: {
                title: 'Bike Route Pictures',
                content: `
                <strong>{DESCRIPTION}</strong>
                <br>
                <span data-toggle="modal" title="Click to view full size" class="image-container"><img data-title='{DESCRIPTION}' class='bikePics' src='img/bikepics/{URL_NAME}.jpg'><div class="after"><span class="centeredContent"><i class="fa fa-search-plus" aria-hidden="true"></i></span></div></span>
                <br>
                `
            },
            legend: {
                sort: 2
            },
            definition: "Photos of bicycle infrastructure around the region"
        },
        {
            id: 'GridBikeShare',
            title: 'GRID Bike Share',
            layerName: 'GridBikeShare',
            type: 'feature',
            visible: false,
            popup: {
                title: 'GRID Bike Share',
                content: `
                <strong>{Station_Name}</strong>
                <br>
                <b>Location:</b> {Station_Location}
                <br>
                <b>Station Number:</b> {Station_Number}
                <br>
                <a class="link" href='https://www.gridbikes.com/' target='_blank'>www.gridbikes.com</a>
                `
            },
            legend: {
                sort: 5
            },
            definition: "Locations of Grid Bike Share Hubs (Note: Dockless Bikeshare programs operate throughout the region)<img class='smallImg' src='img/lime.png'><img class='smallImg' src='img/spin.jpg'><img class='smallImg' src='img/ofo.jpg'>"
        },
        {
            title: 'Light Rail',
            id: 'Lightrail',
            layerName: 'Lightrail',
            type: 'feature',
            visible: true,
            popup: {
                title: 'Light Rail',
                content: `<strong>{Route}</strong>
                        <br> City: {City}
                        <br> main
                        <a target='_blank' href={Website}>Web Site</a>`
            },
            legend: {
                sort: 4,
                group: {
                    title: 'Light Rail',
                    id: 'lightRail'
                }
            },
            definition: "Valley Metro's Light Rail Stops"
        },
        {
            title: 'Light Rail',
            id: 'LightRailStations',
            layerName: 'LightRailStations',
            type: 'feature',
            visible: true,
            popup: {
                title: '{Category}',
                content: `<strong>{Name}</strong>
                <br>
                {Location} - {City}
                <br>
                <img class="bikePics" src="{IMAGE0}" alt=""><br>
                <a target='_blank'href={webLink}>Transit Web Link Info</a>`
            },
            legend: {
                sort: 4,
                group: {
                    title: 'Light Rail',
                    id: 'lightRail'
                }
            },
            definition: "Valley Metro Light Rail Route and Station locations"
        },
        {
            id: 'PublicTransit',
            title: 'Public Transit',
            layerName: 'PublicTransit',
            type: 'feature',
            popup: {
                title: '{Category}',
                content: `<strong>{Name}</strong>
                <br>
                {Location} - {City}
                <br>
                <img class="bikePics" src="{IMAGE0}" alt=""><br>
                <a target='_blank'href={webLink}>Transit Web Link Info</a>`
            },
            definitionExpression: "Category <> 'Light Rail Station'",
            visible: true,
            legend: {
                sort: 6,
                group: {
                    title: 'Public Transit locations',
                    id: 'lightRailAndTransit'
                }
            },
            definition: "Places to park and connect to public transit"
        }
    ]
};
