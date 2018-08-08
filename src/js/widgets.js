require([
    "esri/widgets/BasemapToggle/BasemapToggleViewModel",
    'esri/widgets/Home',
    'esri/widgets/Home/HomeViewModel',
    'esri/widgets/Locate',
    'esri/widgets/Locate/LocateViewModel',
    'esri/widgets/Zoom',
    'esri/widgets/Zoom/ZoomViewModel',
    'dojo/topic',
    'dojo/domReady!'
], function (BasemapToggleViewModel, Home, HomeViewModel, Locate, LocateViewModel, Zoom, ZoomViewModel, tp) {

    tp.subscribe("map-loaded", setupWidgets);

    function setupWidgets() {
        //Zoom
        const zoomId = "zoomWidget";
        let zoomVM = new ZoomViewModel({
            view: app.view
        });

        app.view.ui.add(zoomId, 'bottom-right');

        $("#" + zoomId).on("click", ".esri-widget-button", function () {
            const direction = $(this).data("id");
            if (direction === "In") {
                zoomVM.zoomIn();
            } else {
                zoomVM.zoomOut();
            }
        });

        //Home
        const homeId = "homeWidget";
        let homeVM = new HomeViewModel({
            view: app.view
        });

        app.view.ui.add(homeId, 'bottom-right');

        $("#" + homeId).click(function () {
            homeVM.go();
        });

        //Locate

        const locateId = "locateWidget";
        let locateVM = new LocateViewModel({
            view: app.view
        });
        app.view.ui.add(locateId, 'bottom-right');

        $("#" + locateId).click(function () {
            locateVM.locate().then(function () {
                // <!-- comments:uncomment // -->
                // ga("send", "event", "Click", "Geo Location Click", "geolocationButton");
                // <!-- endcomments -->
            });
        });

        //Basemap
        const basemapId = "basemapToggle";

        let toggleVM = new BasemapToggleViewModel({
            view: app.view,
            nextBasemap: 'hybrid'
        });

        app.view.ui.add(basemapId, 'bottom-right');
        let toggled = true;

        $("#" + basemapId).click(function () {
            if (toggled) {
                $(this).attr("title", "Map");
            } else {
                $(this).attr("title", "Satellite");
            }
            toggled = !toggled;
            toggleVM.toggle();
        });

        //Legend
        let legend = $('#legend');
        app.view.ui.add('legend', 'top-right');

        $(".customWidget").show();
        if (window.innerWidth < 800) {
            $("#legend").hide();
            $(".legendToggle").removeAttr('checked');
        }

        let $share = $(".shareWidget");

        var baseUrl = 'https://twitter.com/intent/tweet';
        var text = "MAG%20%7C%20Bikeways";
        var thisPageUrl = "https://geo.azmag.gov/maps/bikemap";
        var hashTag = "MAGmaps";
        var via = "MAGregion";

        var twitterHref = (baseUrl + "?text=" + text + "&url=" + thisPageUrl + "&hashtag=" + hashTag + "&via=" + via);

        $share.attr('data-content', `
        <div id="sharePopup">
            <div class="shareLinks">
                <ul>
                    <li>
                        <a id="EMshareButton" href="mailto:?subject=MAG Bikeways&amp;body=%0A%0ACheck out this website.%0A%0AMAG Bikeways - #MAGmaps%0Ahttps://geo.azmag.gov/maps/bikemap"
                            title="MAG|Bikeways">
                            <em class="fa fa-envelope"></em>
                        </a>
                    </li>
                    <li>
                        <a id="FBshareButton" title="Share on Facebook">
                            <em class="fab fa-facebook-f"></em>
                        </a>
                    </li>
                    <li>
                        <a href="${twitterHref}" id="TWshareButton" title="Share on Twitter">
                            <em class="fab fa-twitter"></em>
                        </a>
                    </li>
                    <li>
                        <a id="INshareButton" title="Share on LinkedIn">
                            <em class="fab fa-linkedin"></em>
                        </a>
                    </li>
                    <li>
                        <a id="GPlusShareButton" title="Share on Google Plus">
                            <em class="fab fa-google-plus"></em>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        `);

        $share.popover({
            html: true
        });

        ! function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                p = /^http:/.test(d.location) ? "http" : "https";
            if (!d.getElementById(id)) {
                js = d.createElement(s);
                js.id = id;
                js.src = p + "://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
            }
        }(document, "script", "twitter-wjs");

        //LinkedIn
        $(document).on('click', '#INshareButton', function () {
            window.open("https://www.linkedin.com/shareArticle?url=https://geo.azmag.gov/maps/bikemap", "shareLinkedIn", 'width=650, height=700');
        });

        // google +1
        (function () {
            var po = document.createElement("script");
            po.type = "text/javascript";
            po.async = true;
            po.src = "https://apis.google.com/js/platform.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(po, s);
        })();

        $(document).on('click', '#GPlusShareButton', function () {
            window.open("//plus.google.com/share?url=https%3A%2F%2Fgeo.azmag.gov%2Fmaps%2Fbikemap", 'shareGooglePlus', 'width=400, height=700');
        });

        // facebook
        //share dialog - use on('click') for it to work afte loading html
        $(document).on('click', '#FBshareButton', function () {
            FB.ui({
                method: 'share',
                mobile_iframe: true,
                href: 'https://geo.azmag.gov/maps/bikemap',
            }, function (response) {});
        });

        window.fbAsyncInit = function () {
            FB.init({
                appId: "929950963769905",
                cookie: true,
                xfbml: true,
                version: "v2.12"
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
});
