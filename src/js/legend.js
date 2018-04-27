function startLegend() {
    $.getJSON(config.mainUrl + "/legend?f=pjson", function (data) {
        var $layerList = $("#layerList");
        var legendLayers = config.layers.filter(conf => conf.legend);
        var sort = function (a, b) {
            return a.legend.sort - b.legend.sort
        }

        for (const conf of legendLayers.sort(sort)) {
            var legendHTML = getLegendHtml(conf);
            var html = `
            <div>
                <div class="checkbox-div">
                    <input type="checkbox" id="c-${conf.id}" ${conf.visible ? 'checked' : ''} data-layer-id="${conf.id}" class="regular-checkbox big-checkbox" />
                    <label></label>
                    <label class="layerLabel">${conf.title}</label>
                </div>
                <div class="legendDiv ${conf.visible ? '' : 'hiddenLegend'}" id="l-${conf.id}">${legendHTML}</div>
            </div>
            `
            $layerList.append(html);
        }

        $layerList.find(".checkbox-div").click(toggleLayerItem);

        function toggleLayerItem(e) {

            //Toggle Checkbox
            var $cbox = $(this).find(".big-checkbox");
            $cbox.prop("checked", !$cbox.prop("checked"));

            //Toggle Legend Div
            var $legend = $(this).siblings(".legendDiv");
            $legend.slideToggle(50);

            //Toggle Layer
            var layer = app.map.findLayerById($cbox.data('layer-id'));;
            layer.visible = !layer.visible;
        }

        function getLegendHtml(confObj) {
            var legendHtml = "";
            var header = "<div class='legendItem'>";

            $.each(data.layers, function (i, val) {
                if (val.layerName === confObj.layerName) {
                    var legend = val.legend;
                    legendHtml += header;
                    var label = confObj.title;

                    $.each(legend, function (j, legendItem) {
                        if (legend.length > 1) {
                            label = legendItem.label;
                        }

                        legendHtml += `
                            <img src='data:${legendItem.contentType};base64,${legendItem.imageData}'</img>
                            <span class='legendItemLabel'>${label}</span><br>
                        `
                    });
                    legendHtml += "</div>";
                    return false;
                }
                if (legendHtml !== "") {
                    return false;
                }
            });
            return legendHtml;
        }
    })
}