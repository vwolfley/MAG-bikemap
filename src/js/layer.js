require([
    "esri/layers/FeatureLayer",
    "esri/layers/MapImageLayer",
    "esri/PopupTemplate",
    "dojo/topic"
], function (FeatureLayer, MapImageLayer, PopupTemplate, tp) {

    tp.subscribe("map-loaded", addLayers);

    function addLayers() {
        for (var i = 0; i < config.layers.length; i++) {
            var layer = config.layers[i];

            var layerToAdd;
            var url = config.mainUrl;
            if (layer.type === "feature") {
                if (layer.popup) {
                    var popupTemplate = new PopupTemplate({
                        title: layer.popup.title,
                        content: layer.popup.content,
                        actions: layer.popup.actions
                    });
                }
                if (layer.url) {
                    url = layer.url;
                }
                layerToAdd = new FeatureLayer({
                    id: layer.id,
                    url: url,
                    title: layer.title,
                    definitionExpression: layer.definitionExpression,
                    layerId: layer.index,
                    visible: layer.visible,
                    popupTemplate: popupTemplate,
                    outFields: layer.outFields || ["*"],
                    opacity: layer.opacity
                });
                app.map.layers.add(layerToAdd);
            } else if (layer.type === "image") {
                if (layer.url) {
                    url = layer.url;
                }
                var imgLayer = new MapImageLayer({
                    url: url,
                    id: layer.id,
                    opacity: layer.opacity || 1,
                    title: layer.title,
                    visible: layer.visible,
                    labelsVisible: false,
                    labelingInfo: [{}],
                    sublayers: [{
                        id: layer.index,
                        opacity: 1
                    }]
                });
                app.map.layers.add(imgLayer);
            }
        }
    };
});
