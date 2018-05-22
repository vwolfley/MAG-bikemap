let app = {};
require([
	'esri/Map',
	'esri/views/MapView',
	'esri/layers/MapImageLayer',
    'esri/geometry/Extent',
	'dojo/domReady!'
], function(Map, MapView, MapImageLayer, Extent) {
	let $sidebar = $('#sidebar');
	let $sidebarCollapse = $('#sidebarCollapse');

	$('.sidebarCollapse').on('click', function() {
		$sidebar.toggleClass('active');
		$sidebarCollapse.toggleClass('active');
	});

	let $links = $('.components li');
	let $arrows = $('.arrow-left');
	let $panelDivs = $('.panelDiv');
	let $content = $('#content');
	let $legendToggle = $('#legendToggle');

	$links.on('click', function(e) {
		let target = $(this).attr('panel-target');
		if (target === 'legend') {
			toggleLegend();
		} else {
			let isActive = $(this).hasClass('active');
			$links.removeClass('active');
			$arrows.hide();
			$panelDivs.hide();

			if (isActive) {
				$content.hide();
			} else {
				$content.show();
				$(this).addClass('active');
				$(this).find('.arrow-left').show();

				$(`div[panel-id=${target}`).fadeIn(400);
			}
		}
	});

	$legendToggle.click(function(e) {
		return false;
    });
    var colorCnt = 0;
    $('body').keyup(function (e) {
        if (e.keyCode == 32) {
            var colors = config.colors[colorCnt];
            
            document.documentElement.style.setProperty('--mainColor', colors[0]);
            document.documentElement.style.setProperty('--secondaryColor', colors[1]);
            document.documentElement.style.setProperty('--textColor', colors[2]);
			document.documentElement.style.setProperty('--hoverColor', colors[3]);
			document.documentElement.style.setProperty('--hoverText', colors[4]);
            colorCnt++;

            if (colorCnt === config.colors.length) {
                colorCnt = 0;
            }
            
        }
    });


	$('#closePanel').click(function() {
		$links.removeClass('active');
		$arrows.hide();
		$panelDivs.hide();
		$content.hide();
	});

	function toggleLegend() {
		$('#legend').fadeToggle();
		$legendToggle.prop('checked', !$legendToggle.prop('checked'));
	}

	app.map = new Map({
		basemap: 'streets'
	});

	app.view = new MapView({
		container: 'viewDiv',
		map: app.map,
        extent: config.initExtent,
        constraints: {
            rotationEnabled: false,
            minZoom: 7,
            snapToZoom: false
        },
	});
	app.view.ui.remove('attribution');

	app.view.when(function() {
		$.get(config.mainUrl + '/?f=json', function(data) {
			$.each(JSON.parse(data).layers, function(key, layer) {
				for (var i = 0; i < config.layers.length; i++) {
					var conf = config.layers[i];
					if (conf.layerName === layer.name) {
						conf.index = layer.id;
						break;
					}
				}
			});
			addLayersToMap();
			startLegend();
			setupHoverEvents();
			setupWidgets();
			setupConstrainedExtent();
		});
		$('div[panel-id="about"]').load('views/about.html');
		$('div[panel-id="help"]').load('views/help.html');
		$('div[panel-id="safety"]').load('views/safety.html');
	});

	function setupConstrainedExtent() {
        var maxExtent = new Extent({
            xmax: -12326456.407013275,
            xmin: -12619974.595628463,
            ymax: 4014557.5992311286,
            ymin: 3873301.9709600685,
            spatialReference: 102100
        });
		var oldExtentHeight = 0;
		app.view.watch('extent', function(extent) {
            var currentCenter = extent.center;
			if (!maxExtent.contains(currentCenter)) {
				var newCenter = extent.center;
				if (currentCenter.x < maxExtent.xmin) {
					newCenter.x = maxExtent.xmin;
				}
				if (currentCenter.x > maxExtent.xmax) {
					newCenter.x = maxExtent.xmax;
				}
				if (currentCenter.y < maxExtent.ymin) {
					newCenter.y = maxExtent.ymin;
				}
				if (currentCenter.y > maxExtent.ymax) {
					newCenter.y = maxExtent.ymax;
				}

				var newExtent = app.view.extent.clone();
				newExtent.centerAt(newCenter);
				app.view.extent = newExtent;
			}
			oldExtentHeight = extent.height;
		});
	}

	function setupHoverEvents() {
		let $container = $('#container');
		let tt = $('.iconTooltip');
		let text = $('.iconTooltiptext');

		app.view.on('pointer-move', function(event) {
			tt.hide();
			$('body').css('cursor', 'default');
			try {
				if (event.x && event.y) {
					app.view
						.hitTest({
							x: event.x,
							y: event.y
						})
						.then(function(response) {
							if (!app.view.popup.visible) {
								// removeGraphics();
							}
							let resultGraphic = response.results[0].graphic;

							if (resultGraphic) {
								let confObj = config.layers[resultGraphic.layer.id];
								if (resultGraphic.geometry.type === 'point') {
									let tooltipHtml = resultGraphic.attributes.Name;

									if (resultGraphic.attributes.NAME) {
										tooltipHtml = resultGraphic.attributes.NAME;
									} else if (resultGraphic.attributes.Discript) {
										tooltipHtml = resultGraphic.attributes.Discript;
									} else if (resultGraphic.attributes.Station_Number) {
										tooltipHtml = `Station Number: ${resultGraphic.attributes.Station_Number}`;
									}
									if (tooltipHtml) {
										text.html(tooltipHtml);

										let pos = $container.position();

										tt.css({
											display: 'block',
											left: response.screenPoint.x + pos.left + 20,
											top: response.screenPoint.y - 10
										});
									}
								}
							}
						});
				}
			} catch (err) {}
		});
	}

	var bikeRenderer = {
		type: 'unique-value',
		field: 'PathType',
		defaultSymbol: {
			type: 'simple-line',
			width: 20
		},
		uniqueValueInfos: [
			{
				value: 'Bike Lane',
				symbol: {
					type: 'simple-line',
					color: 'blue',
					width: 2,
					style: 'solid'
				}
			},
			{
				value: 'Bike Route',
				symbol: {
					type: 'simple-line',
					color: 'green',
					width: 2,
					style: 'solid'
				}
			},
			{
				value: 'Paved Shoulder',
				symbol: {
					type: 'simple-line',
					color: 'purple',
					width: 2,
					style: 'solid'
				}
			},
			{
				value: 'Multi-Use Path - Paved',
				symbol: {
					type: 'simple-line',
					color: 'red',
					width: 2,
					style: 'solid'
				}
			},
			{
				value: 'Multi-Use Path - Unpaved',
				symbol: {
					type: 'simple-line',
					color: 'orange',
					width: 2,
					style: 'solid'
				}
			},
			{
				value: 'Recreational Trail',
				symbol: {
					type: 'simple-line',
					color: 'brown',
					width: 2,
					style: 'solid'
				}
			}
		]
	};

	window.popupSetup = function(value, key, data) {
		var html = '';
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
		title: '{PATHTYPE}',
		content: `<span style='display:none;'>{PATHTYPE}{NAME}{CITY}{SURFACE}</span>{PATHTYPE:popupSetup}`
	};
	var mainLayer = new MapImageLayer({
		url: config.mainUrl,
		opacity: 0.8,
		sublayers: [
			{
				id: 0,
				visible: true,
				popupTemplate: pTemplate,
				renderer: bikeRenderer,
				minScale: 0,
				maxScale: 144447
			},
			{
				id: 1,
				visible: true,
				popupTemplate: pTemplate,
				renderer: bikeRenderer,
				minScale: 144447.01,
				maxScale: 40001
			},
			{
				id: 2,
				visible: true,
				popupTemplate: pTemplate,
				renderer: bikeRenderer,
				minScale: 40000,
				maxScale: 0
			}
		]
	});
	app.map.add(mainLayer);
});
//# sourceMappingURL=main.min.js.map
//# sourceMappingURL=main.js.map
