function startLegend() {
    $.getJSON(config.mainUrl + "/legend?f=pjson", function (data) {
        var $layerList = $("#layerList");
        var $legendDiv = $("#legendDiv");
        var legendLayers = config.layers.filter(conf => conf.legend);

        var sort = function (a, b) {
            return a.legend.sort - b.legend.sort
        }

        var conf = {
            id: "bikeways",
            layerName: "Bikeways"
        }
        
        $legendDiv.append(`<div class="legendDiv" id="l-${conf.id}">${getLegendHtml(conf)}</div>`)


        for (const conf of legendLayers.sort(sort)) {
            
            var html = `
            <div>
                <div class="checkbox-div">
                    <input type="checkbox" id="c-${conf.id}" ${conf.visible ? 'checked' : ''} data-layer-id="${conf.id}" class="regular-checkbox big-checkbox" />
                    <label></label>
                    <label class="layerLabel">${conf.title}</label>
                </div>
            </div>
            `

            $layerList.append(html);

            var legendHTML = getLegendHtml(conf);
            var legend = `<div class="legendDiv ${conf.visible ? '' : 'hiddenLegend'}" id="l-${conf.id}">${legendHTML}</div>`;
            $legendDiv.append(legend);

        }
        $("#legend").show();

        $layerList.find(".checkbox-div").click(toggleLayerItem);

        function toggleLayerItem(e) {

            //Toggle Checkbox
            var $cbox = $(this).find(".big-checkbox");
            $cbox.prop("checked", !$cbox.prop("checked"));

            //Toggle Layer
            var layer = app.map.findLayerById($cbox.data('layer-id'));;
            layer.visible = !layer.visible;

            //Toggle Legend Div
            var $legend = $("#l-" + $cbox.data('layer-id'));
            $legend.slideToggle(50);
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