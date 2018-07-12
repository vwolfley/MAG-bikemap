/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Bikeways
 * ========================================================================
 * @file        config.js
 * @summary     JavaScript config file for MAG Bikeways Viewer
 * ========================================================================
 */
const config = {
    version: 'v3.3.3 | 2018-04-11',
    copyright: '2018',
    mainUrl: 'https://geo.azmag.gov/gismag/rest/services/Test/BikeMap_Test/MapServer',
    geoCoderService: '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    emailLink: 'http://www.azmag.gov/Contact/4788?s=geo.azmag.gov/maps/bikemap&n=Jason%20Howard&popUp=true',
    // xmin: -12621311,
    // ymin: 3879618,
    // xmax: -12327792,
    // ymax: 4031727,
    initExtent: {
        // xmax: -12387044.132197801,
        // xmin: -12563155.5321978,
        // ymax: 4006586.7573076915,
        // ymin: 3914950.7706043944,
        // spatialReference: {
        //     wkid: 102100
        // }
        // {
        xmax: -12452894.875480982,
        xmin: -12474870.52111294,
        ymax: 3967552.5502163423,
        ymin: 3951538.99279062,
        spatialReference: {
            wkid: 102100
        }
        // }
    },
    layers: [{
            title: 'MAG MPO Boundary',
            layerName: 'MAG MPO Boundary',
            type: 'image',
            visible: true
        },
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
            }
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
            }
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
            }
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
            }
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
                <strong>{NAME}</strong>
                <br>
                <img class='pics' src='img/bikepics/{URL_NAME}.jpg'>
                <br>
                {DESCRIPTION}
                `
            },
            legend: {
                sort: 2
            }
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
            }
        },
        {
            title: 'Light Rail',
            id: 'Lightrail',
            layerName: 'Lightrail',
            type: 'feature',
            visible: true,
            legend: {
                sort: 4,
                group: {
                    title: 'Light Rail & Transit Locations',
                    id: 'lightRailAndTransit'
                }
            }
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
                {Location}
                <br>
                {City}
                <br>
                <a target='_blank'href={webLink}>Transit Web Link Info</a>`
            },
            visible: true,
            legend: {
                sort: 6,
                group: {
                    title: 'Light Rail & Transit Locations',
                    id: 'lightRailAndTransit'
                }
            }
        }
    ]
};
