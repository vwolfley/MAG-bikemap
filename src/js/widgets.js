function setupWidgets() {
    require([
            "esri/widgets/BasemapToggle",
            "esri/widgets/Home",
            "esri/widgets/Locate",
            "dojo/domReady!"
        ], function (BasemapToggle, Home, Locate) {
            let homeWidget = new Home({
                view: app.view
            });

            app.view.ui.add(homeWidget, "top-left");
            let locate = new Locate({
                view: app.view
            });
            app.view.ui.add(locate, "top-left");

            let toggle = new BasemapToggle({
                view: app.view,
                nextBasemap: "hybrid"
            });

            app.view.ui.add(toggle, "top-left");

            let legend = $("#legend");
            app.view.ui.add("legend", "top-right");
            $("#legend").show();

            let sidebarCollapse = $("#sidebarCollapse");
            app.view.ui.add("sidebarCollapse", "bottom-left");
        }
    )
}