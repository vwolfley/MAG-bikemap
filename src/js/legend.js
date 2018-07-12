function startLegend() {

    function getLayersByGroupId(id) {
        return config.layers.filter(function (conf) {
            if (conf.legend && conf.legend.group && conf.legend.group.id === id) {
                return true;
            }
        });
    }

    function getCheckBoxHTML(conf) {
        var c = $.extend({}, conf);

        if (c.legend.group) {
            c.id = c.legend.group.id;
            c.title = c.legend.group.title;
        }

        return `
            <div>
                <div class="checkbox-div">
                    <input type="checkbox" id="c-${c.id}" ${c.visible ? 'checked' : ''} data-layer-id="${c.id}" class="regular-checkbox big-checkbox" />
                    <label></label>
                    <label class="layerLabel">${c.title}</label>
                </div>
            </div>
            `
    }

    $.getJSON(config.mainUrl + "/legend?f=pjson", function (data) {
        var $layerList = $("#layerList");
        var $legendDiv = $("#legendDiv");

        $("#legend").draggable({
            handle: "#legendHeader",
            // scroll: false,
            containment: "#container",
            cursor: "move"
        });

        $(window).resize(function () {
            $('#legend').css({
                left: '',
                top: ''
            });
        });

        var legendLayers = config.layers.filter(conf => conf.legend && !conf.legend.group);

        var sort = function (a, b) {
            return a.legend.sort - b.legend.sort
        }

        var conf = {
            id: "bikeways",
            layerName: "Bikeways"
        }

        function getBikeDefHTML() {
            return `
                <b>Bike Lane</b> - A portion of the roadway designated for preferential or exclusive use by bicyclists special pavement markings and signs identifying the lanes.<br>
                <b>Bike Route </b> - A roadway open to both bicycle and motor vehicle travel and recognized as bicycle friendly. Often indicated by signage.<br>
                <b>Paved Shoulder</b> - The portion of the roadway contiguous with the traveled way that accommodates stopped vehicles.<br>
                <b>Multi-Use Path - Paved</b> -  A bikeway physically separated from motor vehicle traffic by an open space or barrier and either within the right of way or within an independent right of way. Trails may be used by pedestrians, skaters, wheelchair users, and joggers.<br>
                <b>Multi-Use Path - Unpaved</b> -  A bikeway physically separated from motor vehicle traffic by an open space or barrier and either within the right of way or within an independent right of way. Trails may be used by pedestrians, skaters, wheelchair users, and joggers.<br>
                <b>Recreational Trail</b> -  A bikeway or Trail, typically unpaved, that may be used by both hikers and bikers in recreational areas.
            `
        }

        $legendDiv.append(
            `
            <div class="legendDiv" id="l-${conf.id}">
                <div class='legendItem'>
                ${getLegendHtml(conf)}
                </div>
                <a
                style="height: 25px;"
                tabindex="0"
                role="button"
                data-html="true" 
                data-toggle="popover"
                data-placement="left"
                data-trigger="hover"
                title="Bikeway Types"
                data-content="${getBikeDefHTML()}"><i id="bikeDefIcon" class="glyphicon glyphicon glyphicon-info-sign"></i>
                </a>
            </div>
            `)
        $("[data-toggle=popover]").popover({
            offset: 100,
            template: '<div class="popover popover--topright" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        });
        var arr = legendLayers.sort(sort);
        for (var i = 0; i < arr.length; i++) {
            var conf = arr[i];
            $layerList.append(getCheckBoxHTML(conf));
            let legend = `<div class="legendDiv ${conf.visible ? '' : 'hiddenLegend'}" id="l-${conf.id}">${getLegendHtml(conf)}</div>`;
            $legendDiv.append(legend);
        }

        let groupLayers = config.layers.filter(conf => conf.legend && conf.legend.group);

        for (var i = 0; i < groupLayers.length; i++) {
            var groupLayer = groupLayers[i];
            if ($(`#c-${groupLayer.legend.group.id}`).length === 0) {
                $layerList.append(getCheckBoxHTML(groupLayer));
                let grpLayers = getLayersByGroupId(groupLayer.legend.group.id);
                let html = `<div class="legendDiv ${groupLayer.visible ? '' : 'hiddenLegend'}" id="l-${groupLayer.legend.group.id}">`;
                html += "<div class='legendItem'>";
                for (var j = 0; j < grpLayers.length; j++) {
                    var lay = grpLayers[j];
                    html += getLegendHtml(lay);
                }
                html += "</div>";
                $legendDiv.append(html)
            }
        }

        $layerList.find(".checkbox-div").click(toggleLayerItem);

        function toggleLayerItem(e) {

            //Toggle Checkbox
            let $cbox = $(this).find(".big-checkbox");
            $cbox.prop("checked", !$cbox.prop("checked"));

            let layerId = $cbox.data('layer-id');

            //Toggle Layer
            let layer = app.map.findLayerById(layerId);
            if (layer) {
                layer.visible = !layer.visible;
            } else {
                let grpLayers = getLayersByGroupId(layerId);

                for (var i = 0; i < grpLayers.length; i++) {
                    var grpLayer = grpLayers[i];

                    let lay = app.map.findLayerById(grpLayer.id);
                    if (lay) {
                        lay.visible = !lay.visible;
                    }
                }
            }

            //Toggle Legend Div
            let $legend = $("#l-" + $cbox.data('layer-id'));
            $legend.slideToggle(50);
        }

        function getLegendHtml(confObj) {
            let legendHtml = "";
            let header = "<div class='legendItem'>";

            for (var i = 0; i < data.layers.length; i++) {
                var val = data.layers[i];
                if (val.layerName === confObj.layerName) {
                    let legend = val.legend;
                    let label = confObj.title;
                    for (var j = 0; j < legend.length; j++) {
                        var legendItem = legend[j];

                        if (legend.length > 1) {
                            label = legendItem.label;
                        }
                        legendHtml += `
                            <img src='data:${legendItem.contentType};base64,${legendItem.imageData}'</img>
                            <span class='legendItemLabel'>${label}</span><br>
                            `
                    }
                    break;
                }
            }
            return legendHtml;
        }
    })
}