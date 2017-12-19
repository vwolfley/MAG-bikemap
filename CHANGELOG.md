# CHANGELOG #
###  MAG Bikeways Website ###

[![Semver](http://img.shields.io/SemVer/2.0.0.png)](http://semver.org/spec/v2.0.0.html)

All notable changes to this project will be documented in this file.

Releases will be numbered with the following format:

**`<major>.<minor>.<patch>`**

And constructed with the following guidelines:

1. **MAJOR** version when you make incompatible API changes **bumps the major** resets minor and patch
2. **MINOR** version when you add functionality in a backwards-compatible manner **bumps the minor** resets patch
3. **PATCH** version when you make backwards-compatible bug fixes and misc changes **bumps only the patch**

=========================================================================================================

## Outstanding Items

#### Items to Add
* Application Cache Manifest - http://www.html5rocks.com/en/tutorials/appcache/beginner/
* geo tracking

===========================================================================================================

## Version 3.3.2 | 12/06/2017

* fixed link to pdf bikeways map
* fixed light rail popup issues
* added "addtohomescreen" info tab 
* [addtohomescreen](https://github.com/cubiq/add-to-homescreen)

## Version 3.3.1 | 11/21/2017

* updates to popup info - schema changes were made!
* fixed copyright issue

## Version 3.3.0 | 05/23/2017

* made changes to file structure only!
* untracked node_modules
* updated .gitignore file
* added src folder
* moved files to src folder
* added build folder

## Version 3.2.1 | 04/27/2017

* update bikeways to use three different levels
* main URL from [http://geo.azmag.gov/gismag/rest/services/maps/BikeMap_v2/MapServer]
* main URL to [http://geo.azmag.gov/gismag/rest/services/maps/BikeMap/MapServer]

## Version 3.2.0 | 01/12/2017

* added Phoenix Sonoran Bikeway to map
* updates to Bikeways data
* updates to GRIDshare data
* update to [ArcGIS API for JavaScript 3.19compact] (https://developers.arcgis.com/javascript/index.html)

## Version 3.1.3 | 06/23/2016

* added a help page
* added a search function
* changed menu icon from Gear to Info
* added USBR90 to map
* Updated Light Rail Line
* Updated Transit Locations
* updated Bike Shop info

## Version 3.1.2 | 06/08/2016

* add Google site verification doc
* updated Google Analytics
* Updated to force https to enable location
* Updated pdf link to 2015 bike map

## Version 3.1.0 | 03/27/2015

* production release
* minified CSS and JS files
* Concatenated CSS and JS files

### Version 3.0.0 (03/27/2015)

* added icon for bike safety no earphones
* added link to ARS documents
* made changes to onPathsPage text
* made changes to onStreetPage text
* made changes to saftyPage text
* added pdf link to paper map
* added facebook link
* added youtube videos
* added new pics
* adjusted center point of map
* added GRID Bike Share Points to the map
* update to [ArcGIS API for JavaScript 3.13compact] (https://developers.arcgis.com/javascript/index.html)
* added checkboxes to legend - checkboxes turn layers on and off
* update to [jQuery mobile v1.4.5] (http://jquerymobile.com/)
* added home button
* update email link
* update mainifest file
* update to [ArcGIS API for JavaScript 3.12compact] (https://developers.arcgis.com/javascript/index.html)
* update to [jQuery mobile v1.4.4] (http://jquerymobile.com/)
* update to [Normalize.css 3.0.2] (http://necolas.github.io/normalize.css/)
* added layer checkboxes
* added dynamic legend/TOC
* changed page layouts and button styles
* moved map toggles to bottom right
* updated geolocation function
* added menu buttons to each page
* changed size of menu buttons
* changed menu icons
* changed theme colors
* update to ArcGIS JavaScript API v3.9compact
* updates to [jQuery mobile v1.4.2] (http://jquerymobile.com/)
* added the [HTML5 Boilerplate v4.3.0] (https://github.com/h5bp/html5-boilerplate)
* use `<!doctype html>` instead of `<!DOCTYPE html>`
* remove IE conditional classes per HTML5 Boilerplate
* update to [Modernizr 2.8.0] (http://modernizr.com/)
* update to [Normalize.css 3.0.1] (http://necolas.github.io/normalize.css/)
* changed image file to img
* move to AMD Style
* added Grunt files
* added views file - moved info from index.html to individual pages
* added new item to apple meta tag `<meta name="viewport" content="minimal-ui">` new for ios7
* update started `05/06/2014`

* use? [ESRI/jquery-mobile-map-js] (https://github.com/Esri/jquery-mobile-map-js)
* example [ESRI-Mobile 1] (https://developers.arcgis.com/javascript/jssamples/mobile_citizenrequest.html)
* example [ESRI-Mobile 2] (https://developers.arcgis.com/javascript/jssamples/mobile_arcgis.html)

### Version 2.0.1 (03/17/2014)

* added apple-touch-icons to the index page

### Version 2.0.0 (12/23/2013)

* updated icons for bike shops
* added recreational trails to the map this was a subset of Multi-Use Path - Unpaved
* updated legend

### Version 1.2.0 (11/08/2012)

* Added Beta to title - to indicate we are still in development
* Added lods to the map - to restrict zoom levels
* Changed the initial extent to start more zoomed in (metro area)

### Version 1.0.1 (10/11/2012)

* Uploaded change files to the server

### Version 1.0.0 (08/03/2012)

* ArcGIS API for JavaScript - Version 3.2 compact
* jquery-1.8.1.min.js
* jquery.mobile-1.0a3.min.js

## Resources

* http://www.azbikeped.org/index.asp
* http://www.azleg.gov/ArizonaRevisedStatutes.asp?Title=28
* http://www.azmag.gov/Documents/MAG_2012-10-19_Bike-Pathways-Map.pdf

#### ***Reference Example Sites***

    * http://www.bicyclela.org/fullscreenmap.html

    * http://bikesy.com/mobile.html
    * http://www5.kingcounty.gov/mobile/bikemapMobile/
    * http://www.iowadot.gov/iowabikes/bikemap/home.html
    * http://www.nycbikemaps.com/maps/manhattan-bike-map/
    * http://geocommons.com/maps/48825
    * http://trailmap.mapc.org/
    * http://www.ridethecity.com/#
    * http://36cs.maps.arcgis.com/apps/OnePane/basicviewer/index.html?appid=60dbc11f3f214506b85fb3d9ecd91034
    * http://web6.seattle.gov/SDOT/BikeMap/
    * http://cyclodeo.com/#/
    * http://gis.drcog.org/bikeroutes/

#### ***Bike Shop Data Base App Reference***

    * http://www.chicagobikeshops.info/

#### Notes:
* http://stackoverflow.com/questions/21127529/maps-and-tw-bootstrap-navbar-100-height-without-scrolling
