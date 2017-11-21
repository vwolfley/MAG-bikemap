/* ========================================================================
 * MAG Bikeways
 * Maricopa Association of Governments
 * @file plugins.js
 * @summary JavaScript document for MAG Bikeways Viewer
 * @version 3.3.1 | 11/21/2017
 * http://ims.azmag.gov/
 * ========================================================================
 * @copyright 2017 MAG
 * @license MIT
 * ========================================================================
 */
/*! =============================================================
 * @file plugins.js | @version 3.3.1 | 11/21/2017 | MAG Bikeways
 * ==============================================================
 */
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        "assert", "clear", "count", "debug", "dir", "dirxml", "error",
        "exception", "group", "groupCollapsed", "groupEnd", "info", "log",
        "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd",
        "timeStamp", "trace", "warn"
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
