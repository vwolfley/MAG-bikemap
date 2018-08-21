/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Bikeways
 * ========================================================================
 * @file        config.js
 * @summary     JavaScript config file for MAG Bikeways Viewer
 * ========================================================================
 */

window.ArrivalTimes = function (value, key, data) {
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
                ulHtml += `<li>${row.departureTimeFormatted} - ${row.headsign}</li>`;
            }
        }
        $ul.html(ulHtml);
    });

    return "<div class='arrivalTimeTarget'><span class='arrivalMessage'>Loading arrival times...</span><ul></ul></div>";
}


window.YesOrNo = function (value, key, data) {
    if (value > 0) {
        return "Yes"
    } else {
        return "No";
    }
}

window.Routes = function (value, key, data) {
    var routes = [];

    for (let i = 1; i < 8; i++) {
        const e = data["ROUTE_" + i];
        if (e !== "NA") {
            routes.push(e);
        }
    }

    return routes.join(', ') || "";
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
            definition: "A nationally designated cycling corridor that travels through the region. For more information please visit <a class='link' target='_blank' href='http://www.azbikeped.org/us-bicycle-route-90.asp'>azbikeped.org</a>"

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
            definition: "A designated cycling corridor highlighting historic districts, mountain preserves, and cultural sites in the region. <a class='link' target='_blank' href='http://www.azbikeped.org/downloads/SonoranBike.pdf'>PDF Map</a>"
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
                title: "Bus Stop",
                content: "<strong>{Location}</strong><br>{StopId:ArrivalTimes}"
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
            definitionExpression: "RouteType <> 'Maintenance'",
            popup: {
                title: 'Light Rail',
                content: `<strong>{Route}</strong>
                        <br> City: {City}<br>
                        <a target='_blank' href='https://www.valleymetro.org/maps-schedules/rail'>Web Site</a>`
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
            id: 'LightRailStations',
            title: 'Light Rail',
            url: "https://services2.arcgis.com/2t1927381mhTgWNC/arcgis/rest/services/ValleyMetroRailStations/FeatureServer/",
            index: 0,
            type: 'feature',
            popup: {
                title: 'Light Rail Station',
                content: `
                <strong>{StationName}</strong> <br>
                <strong>Address</strong>:  {Address} <br>
                <br>
                <div style="display:flex;">
                <div style="flex:1;">{NextRide:ArrivalTimes}</div>
                <span style="flex:1;" data-toggle="modal" title="Click to view full size" class="image-container"><img data-title='{StationName}' class='bikePics' src='{Image}'><div class="after"><span class="centeredContent"><i class="fa fa-search-plus" aria-hidden="true"></i></span></div></span>
                </div>
                `
            },
            visible: true,
            legend: {
                sort: 6,
                group: {
                    title: 'Light Rail',
                    id: 'lightRail'
                },
                imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAqVJREFUSImlVj9oE1EY/93x4BBKiZ28VOhghxBbDYEITgWlUCTDRSkELn9cMsShHR0KUoTGTWkXERRybQIB0YvQQQgo6uBQCJFAaN269JxCCl2Cxz2HyyX35915bb/p3vvu+37f/+8RnINmHn+4LVDEAWDIodevPvoVVpYEcovNiKjT9Pj8d8ISgEVRVhets0a4fSjS4NxAoqzmoNNw5gIQdZqGrEKrZ2ohgVpElM+yoREYBmr1qQawrAcAXQ5kAnaW1eotBxhx/+AnPCRICQZdc9zx3I6g48AfDOMwkglDzTEReLoBICYYXpZg0DXwAIBDGNyWF0zNWTkzgYrNCDPxPN2zH9+WU3hw9zoA4P23Y6y/a1usGHi6B4PLe3QUmxEo0oAAo4phewIA+P7iPuZnpx3s1aU5rC7N4WvnD+SXPycyLs9EnaY1oBbURzHrY352GtGCCgD4/SaNSq2L6o9jAMDJboYp4yYmkJn4ABMCaEiQYhUImSk2E+78uKsLcFpeKSVRKSWZQKasM1czxWaCCAaNX8z28CQYNB4862z08NkXfHx+z3G3qXSwWUyEkidDnusJBl3434+vntzx3D3N3goFMuS5HukrUkeU1QUXY8eeJ6viXBWGG6VPHqWvCzGUq0eOu74idZihE3QcjDp+TCe7mTFg0F25euRtWgTvo0OM+qK9veJRCJietrdXkFz/DADI3oyg0T1lKiOAubQ808HgtqwRdO3qFV9r7LxG99TjjUa4/YlHijSA7LUYBpcHTzeiBdW346MF1fKEGTJr645Dp9UzNeYEH80u1poYJT7vFy77tiVOxlTDbyeZY8XZ8e7qcuuyn13FsKxr9ZYvWFgKscotMLDDGAok9OPEJuB+bgUBXPS5BQBQpIGGyd6/zAPyH7riFwjq/19lAAAAAElFTkSuQmCC"
            },
            definition: "Valley Metro Light Rail Route and Station locations"
        },

        {
            id: 'ParkAndRide',
            title: 'Park and Ride',
            url: "https://services2.arcgis.com/2t1927381mhTgWNC/arcgis/rest/services/ParkAndRides/FeatureServer/",
            index: 0,
            type: 'feature',
            popup: {
                title: 'Park and Ride',
                content: `
                <strong>{NAME}</strong><br>
                <strong>Bus Routes</strong>:  {ROUTE_1:Routes}<br>
                <strong>Total Bike Spaces</strong>:  {TOTAL_BIKE_SPACES} <br>
                <strong>Total Bike Lockers</strong>:  {BIKE_LOCKERS} <br>
                <strong>Total Bike Racks</strong>:  {BIKE_RACKS} <br>
                <strong>Total Parking Spaces : </strong>{TOTAL_AUTO_SPACES}<br>
                <strong>Total Covered Parking Spaces : </strong>{COVERED_SPACES}<br>
                <strong>Shelters</strong>:  {SHELTERS:YesOrNo} <br>
                <strong>Water Fountain</strong>:  {WATER_FOUNTAIN:YesOrNo}
                `
            },
            visible: true,
            legend: {
                sort: 6,
                group: {
                    title: 'Public Transit locations',
                    id: 'lightRailAndTransit'
                },
                imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAiRJREFUSImlVr9r20AU/p65wqWQkq1bp0KMwRgKaf+I5g/IYBPNbtBuMgdNXYyaWaYKZG+6dcsUAgW34CRrt2yGDBKp0eugH+hOd8qp+Sbp7t773q977wQ6IJ17IyYeAAAxraQfLV1lRavi08Mdzmi//GcAAOXfhGESesNyj3p8IaeLdWeiJPTGnLnaC3BG+0noYesoip2IOAhEun134E7RNFA+7J7TbLaxEj2XpES6fXfAQaCQCf2AVZp5DwRfXcMcRNc2MgBVGCuiJPTGFoZjAP2iBlQQ/KJEbgE60beT0BuXORNAWV1Gkq9m8gb6+Vma6Bvp6eGOnC7WAsgrxuJJR/Cx7lmhO267R/36j/wUNQ5kf37j8dtnq0wdZqI88UZkv36A3r4HvXyF3pth8wDznqlARDr3Rqyv6tVVw+NlDFzGlYcv3n3E35/fdVklV+ncG4m8d1nMd4BCYgETD1p7nQmmXLlAENOKCYZgm5F+8TqTENNKSD9a1rswgOLG2/PUBvFhjM3VmbIm/WhpDh3RdTkUumJzdda4tED7PLpF7V64hIxeD8D3N8Y9AeRDq9kd6KRDCwIA8P1Nwxvq8UVFJKeLdRKaLKZJ1VRbUHhiDFk5davQbR1FsbmDF73LMCaKxE9s4apPWyVH8mH33DqT8raiWK1Xl65LMUrRNZttOAjsZI54cpSXZAAsYXwazo+TuoD+3GrDfz+3gKpiKguf84D8B+1Y8ttABgEfAAAAAElFTkSuQmCC",
            },
            definition: "Places to park and connect to public transit"
        },
        {
            id: 'PublicTransit',
            title: 'Transit Center',
            url: "https://services2.arcgis.com/2t1927381mhTgWNC/arcgis/rest/services/TransitCenters/FeatureServer/",
            index: 0,
            type: 'feature',
            popup: {
                title: 'Transit Center',
                content: `
                <strong>{NAME}</strong><br>
                <strong>Bus Routes</strong>:  {Routes}<br>
                <strong>Total Bike Spaces</strong>:  {TOTAL_BIKE_SPACES} <br>
                <strong>Total Bike Lockers</strong>:  {BIKE_LOCKERS} <br>
                <strong>Total Bike Racks</strong>:  {BIKE_RACKS} <br>
                <strong>Shelters</strong>:  {SHELTERS:YesOrNo} <br>
                <strong>Water Fountain</strong>:  {WATER_FOUNTAIN:YesOrNo}
                `
            },
            visible: true,
            legend: {
                sort: 6,
                group: {
                    title: 'Public Transit locations',
                    id: 'lightRailAndTransit'
                },
                imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAn5JREFUSImtVkFoGlEQfas/BrYULLRIe+mtiESUQovsKfRWSO/SdVHEY/DUSwg9Jl56Sk8B2WZRQ3pICyU0V72IkIIKVnLoJac0lIAQKnR31R7c/bq7f9e16Tvtzp+Z9//M/JlPsATKuWQioPIxABiHhv3CQafr15Z4LVay62FNVzeoQAPATT8DGh+XRSFuLq2Q0Imk1AdLE8mikNF01e+GoenqhiwKyNeaVV9EJYBERCHtm4Gxwata82gL0F2JbktiIiIK6ZKNjNgV3Iwn+PMMIEWrVN/jsHrmRoa5MFIiWRQybILRNoAoO52kOMEIAM45BHfsq7IoZMycEYBWF4ukwiJnIDrBqMIhKNkXKtn1sKTUBwSYVozLSZbCBKNt+8kM31WvexRdlsjLhklkJB5rL1/juWjN/9fSJn5+/4Z8tWWRy5kUtWUVCCnnkgloDnERAHqnh+idHlKnpjP+3iMAQPvzB7SP95HKvrHbWnJVziUTJKDyMbOt+EX6/acp0fE+AKClvPPUD6h8zLPX/U+QcWjYD2h8fLHqDL8Hv3An/MC3/jg07JPCQac734Wn0PecXWCGj5uvkK+2LAVh5u9p9i3ayq5Fv3DQ6TJDx2H1zLjxFifzkDMp3H34GJEnCfxofKHytrLruLSA9zw6x4K7dHN5gZvLC/p/f+0FrnsNpi4BpkPL3h04BHeWaEEAgOtew3GaFRI6oUSSUh/IouAw5BCUZk3VHcZJmCEzpy4NXb7WrLI6uNm7WGPCSLzkFq48a0wAwFWteeQ2k4y2Ytm1vbrsvub/LURbgF7yIPOLhaPcJINLGP3A9+Nk3sDx3PLAPz+3AFoxdIe3eUD+BSghDXEHrhqXAAAAAElFTkSuQmCC",
            },
            definition: "Places to park and connect to public transit"
        }
    ]
};
