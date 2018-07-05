function setupWidgets() {
	require([
		'esri/widgets/BasemapToggle',
		"esri/widgets/BasemapToggle/BasemapToggleViewModel",
		'esri/widgets/Home',
		'esri/widgets/Locate',
		'esri/widgets/Zoom',
		'esri/widgets/Search',
		'dojo/domReady!'
	], function (BasemapToggle, BasemapToggleViewModel, Home, Locate, Zoom, Search) {
		let zoom = new Zoom({
			view: app.view
		});

		app.view.ui.add(zoom, 'bottom-right');
		let homeWidget = new Home({
			view: app.view
		});

		app.view.ui.add(homeWidget, 'bottom-right');
		let locate = new Locate({
			view: app.view
		});
		app.view.ui.add(locate, 'bottom-right');





		let toggleView = new BasemapToggleViewModel({
			view: app.view,
			nextBasemap: 'hybrid'
		});

		app.view.ui.add('basemapToggle', 'bottom-right');

		$("#basemapToggle").show();
		$("#basemapToggle").click(function(){
			toggleView.toggle();
		});

		let legend = $('#legend');
		app.view.ui.add('legend', 'top-right');
		$('#legend').show();

		let sidebarCollapse = $('#sidebarCollapse');
		app.view.ui.add('sidebarCollapse', 'bottom-left');

		var search = new Search({
			view: app.view
		});

		// app.view.ui.add(search, 'top-left');

		// app.view.ui.add(search, 'bottom-right');

		// let sidebarCollapse = $("#sidebarCollapse");
		// app.view.ui.add("sidebarCollapse", "bottom-left");
	});
}