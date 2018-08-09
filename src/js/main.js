let app = {};

require([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/MapImageLayer',
        'esri/geometry/Extent',
        "esri/tasks/QueryTask",
        'dojo/topic',
        'dojo/domReady!'
    ],
    function (Map, MapView, MapImageLayer, Extent, QueryTask, tp) {
        let $sidebar = $('#sidebar');
        let $sidebarCollapse = $('#sidebarCollapse');

        $('.sidebarCollapse').on('click', function () {
            $sidebar.toggleClass('active');
            $sidebarCollapse.toggleClass('active');
        });

        let $links = $('.components li');
        let $arrows = $('.arrow-left');
        let $panelDivs = $('.panelDiv');
        let $content = $('#content');
        let $legendToggle = $('.legendToggle');

        let loadedLayers = ["layers"];

        $links.on('click', function (e) {
            let target = $(this).attr('panel-target');
            // <!-- comments:uncomment // -->
            // ga("send", "event", "Click", "Panel Opened", target);
            // <!-- endcomments -->
            $("#viewDiv").css("visibility", "visible");
            $("#container").css("flex", "1");
            if (target === 'legend') {
                toggleLegend();
            } else if (target === 'share') {
                if ($content.is(":visible") && window.outerWidth < 780) {
                    $("#container").css("flex", "none");
                    $("#viewDiv").css("visibility", "hidden");
                }
            } else {

                let isActive = $(this).hasClass('active');
                $links.removeClass('active');
                $arrows.hide();
                $panelDivs.hide();

                if (isActive) {
                    $content.hide();
                } else {
                    $(".shareWidget").popover('hide');
                    $content.show();
                    $(this).addClass('active');
                    $(this).find('.arrow-left').show();

                    if (window.outerWidth < 780) {
                        $("#viewDiv").css("visibility", "hidden");
                        $("#container").css("flex", "none");
                    }

                    if (loadedLayers.indexOf(target) === -1) {
                        $(`div[panel-id="${target}"]`).load(`views/${target}.html`);
                        loadedLayers.push(target);
                    }

                    $(`div[panel-id=${target}]`).fadeIn(400);
                }
            }
        });

        $legendToggle.click(function (e) {
            return false;
        });

        $('#content').on('click', '.closePanel', function () {
            $("#viewDiv").css("visibility", "visible");
            $("#container").css("flex", 1);
            $links.removeClass('active');
            $arrows.hide();
            $panelDivs.hide();
            $content.hide();
        });

        function toggleLegend() {
            if (window.innerWidth < 768) {
                $("#content").hide();
                $(".components li").removeClass("active");
            }
            $('#legend').fadeToggle();
            $legendToggle.prop('checked', !$legendToggle.prop('checked'));
            // <!-- comments:uncomment // -->
            // ga("send", "event", "Click", "Legend Click", "Legend Menu");
            // <!-- endcomments -->
        }

        app.map = new Map({
            basemap: 'gray'
        });

        app.view = new MapView({
            container: 'viewDiv',
            map: app.map,
            extent: config.initExtent,
            constraints: {
                rotationEnabled: false,
                minZoom: 10,
                snapToZoom: false
            },
        });
        app.view.ui.remove('attribution');
        app.view.ui.remove('zoom');

        app.view.when(function () {
            $.get(config.mainUrl + '/?f=json', function (data) {
                var lays = JSON.parse(data).layers;
                for (var i = 0; i < lays.length; i++) {
                    var layer = lays[i];

                    for (var j = 0; j < config.layers.length; j++) {
                        var conf = config.layers[j];

                        if (conf.layerName === layer.name) {
                            conf.index = layer.id;
                            break;
                        }
                    }
                }
                tp.publish("map-loaded");
            });
        });
        var maxExtent = new Extent({
            xmax: -12326456.407013275,
            xmin: -12619974.595628463,
            ymax: 4014557.5992311286,
            ymin: 3873301.9709600685,
            spatialReference: 102100
        });

        // app.view.watch('scale', updatePopupEnabled)


        app.view.watch('extent', function (extent) {
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
        });

        app.view.popup.actions.push({
            title: "Improve this data",
            id: "contactUs",
            className: "esri-icon-comment"
        })

        app.view.popup.on("trigger-action", function (event) {
            if (event.action.id === "contactUs") {
                if (event && event.target && event.target.features[0]) {
                    OpenContactWindow(event.target.features[0]);
                }
            }
        });

        app.view.popup.watch('visible', function (vis) {
            var gfxLay = app.map.findLayerById("gfxLayer");
            if (!vis) {
                gfxLay.removeAll();
            } else {
                if (gfxLay.graphics.length === 0) {
                    HighlightFeature(app.view.popup.selectedFeature);
                }
            }
        });
        var $contactModal = $("#contactModal");
        var $contactForm = $contactModal.find('#contact-form');

        function OpenContactWindow(feature) {
            $contactModal.modal('show');
            var objID = feature.attributes["OBJECTID"];
            var srcLayerID = feature.sourceLayer.id;

            $contactForm.attr('data-obj-id', objID);
            $contactForm.attr('data-layer', srcLayerID);
        }

        var form = $contactForm.validate({
            rules: {
                nameInput: {
                    minlength: 2,
                    required: true
                },
                emailInput: {
                    required: true,
                    email: true
                },
                commentInput: {
                    minlength: 2,
                    required: true
                }
            },
            highlight: function (el) {
                $(el).closest('.form-group').removeClass('success').addClass('error');
            },
            success: function (el) {
                el.closest('.form-group').removeClass('error').addClass('success');
            }
        });

        function SubmitComment() {

            var layerID = $contactForm.data("layer");

            if (layerID == 0) {
                layerID = "Bikeways";
            }

            var data = {
                objID: $contactForm.data("obj-id").toString(),
                layerId: layerID,
                name: $contactForm.find("#nameInput").val(),
                email: $contactForm.find("#emailInput").val(),
                comment: $contactForm.find("#commentInput").val()
            }

            $(".successMessage").fadeIn(300, function () {
                var message = this;
                setTimeout(function () {
                    $(message).fadeOut(500);
                }, 3000);
            });

            $contactModal.modal('hide');

            ResetContactForm();

            $.post("https://geo.azmag.gov/services/BikewaysEmail/Email/SendNew", data);
        }

        $contactForm.submit(function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (form.numberOfInvalids() === 0) {
                SubmitComment();
            }
        });

        function ResetContactForm() {
            $contactForm.trigger("reset");
            $contactForm.find(".form-group").removeClass('success').removeClass('error');
            form.resetForm();
        }

        $('button[type="reset"]').click(ResetContactForm);

        function HighlightFeature(selectedFeature) {
            var gfxLay = app.map.findLayerById("gfxLayer");
            gfxLay.removeAll();
            var f = $.extend({}, selectedFeature);

            if (f.geometry) {
                var symbol = {
                    type: "simple-line",
                    color: "cyan",
                    width: "5px",
                    style: "solid"
                }

                if (f.geometry.type === "point") {
                    symbol.type = "simple-marker";
                    symbol.size = 16;
                    symbol.color = [0, 255, 255, .65];
                    symbol.outline = {
                        width: "0px"
                    }
                }

                var gfx = {
                    geometry: f.geometry,
                    symbol: symbol
                };
                gfxLay.add(gfx);
            }
        }

        app.view.popup.watch('selectedFeature', HighlightFeature);


        let $container = $('#container');
        let tt = $('.iconTooltip');
        let text = $('.iconTooltiptext');

        app.view.on('pointer-move', function (event) {
            tt.hide();
            $('body').css('cursor', 'default');
            try {
                if (event.x && event.y) {
                    app.view
                        .hitTest({
                            x: event.x,
                            y: event.y
                        })
                        .then(function (response) {
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

        let pTemplate = {
            title: '{PATHTYPE}',
            content: `<span style='display:none;'>{PATHTYPE}{NAME}{CITY}{SURFACE}</span>{OBJECTID:popupSetup}`
        };
        window.popupSetup = function (value, key, data) {

            let html = '';
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

        let mainLayer = new MapImageLayer({
            url: config.mainUrl,
            opacity: 1,
            sublayers: [{
                    id: 0,
                    visible: true,
                    popupTemplate: pTemplate
                },
                {
                    id: 1,
                    visible: true,
                    popupTemplate: pTemplate,
                    popupEnabled: false
                },
                {
                    id: 2,
                    visible: true,
                    popupTemplate: pTemplate,
                    popupEnabled: false
                }
            ]
        });

        app.map.add(mainLayer);

        var $outBtn = $('div[data-id="Out"]');
        app.view.watch('zoom', function (zoom) {
            if (Math.round(zoom) <= app.view.constraints.minZoom) {
                $outBtn.addClass('disabled');
            } else {
                $outBtn.removeClass('disabled');
            }
        });

        mainLayer.when(function () {
            var bikeLay0 = mainLayer.findSublayerById(0);
            var bikeLay1 = mainLayer.findSublayerById(1);
            var bikeLay2 = mainLayer.findSublayerById(2);

            app.view.watch("scale", function (scale) {
                bikeLay0.popupEnabled = false;
                bikeLay1.popupEnabled = false;
                bikeLay2.popupEnabled = false;
                if (scale <= 40000) {
                    bikeLay2.popupEnabled = true;
                } else if (scale <= 144448) {
                    bikeLay1.popupEnabled = true;
                } else {
                    bikeLay0.popupEnabled = true;
                }
            })
        })

    });
//# sourceMappingURL=main.min.js.map
//# sourceMappingURL=main.js.map
