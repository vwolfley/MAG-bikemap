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
            locateVM.locate().then(function () {});
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
                $(this).attr("title", "Return to original basemap");
            } else {
                $(this).attr("title", "Switch to Satellite Imagery");
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
        }
    }
});
