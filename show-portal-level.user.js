// ==UserScript==
// @id             iitc-plugin-show-portal-level@CyBot
// @name           iitc: show portal level
// @version        0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://raw.github.com/CyBot/iitc-show-portal-level/master/show-portal-level.user.js
// @downloadURL    https://raw.github.com/CyBot/iitc-show-portal-level/master/show-portal-level.user.js
// @description    Shows portal level
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// ==/UserScript==

function wrapper() {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};
    
    
    // PLUGIN START ////////////////////////////////////////////////////////
    
    // use own namespace for plugin
    window.plugin.portalLevel = function() {};

    window.plugin.portalLevel.layer = null;

    window.plugin.portalLevel.portalAdded = function(data) {
        if (window.plugin.portalOwner.layer === null)
            return;

        var d = data.portal.options.details;
        var portal_level = 0;
        if(getTeam(d) != 0)
        {
            portal_level = window.getPortalLevel(d);
            var level_color = COLORS_LVL[parseInt(portal_level)];
            var params = {fillColor: level_color, fillOpacity: 0.80};
            data.portal.setStyle(params);
            
            var levelIcon = L.icon({
                iconUrl: 'https://raw.github.com/CyBot/iitc-show-portal-level/master/images/'+parseInt(portal_level)+'.png',
                iconSize:     [8, 12], // size of the icon
            });
            var portalID = data.portal.options.guid;
            var levelMarker = L.marker(data.portal.getLatLng(), {icon: levelIcon, portalGUID: portalID});
            
           
            //Issue: Cannot remove yet...
            levelMarker.on('click', function() { window.renderPortalDetails(portalID); });
            levelMarker.addTo(window.plugin.portalLevel.layer);
        }
    }
    
    var setup =  function() {
        window.plugin.portalLevel.layer = L.layerGroup([]);
//        window.map.on('layeradd', function(e) {
//            if (e.layer === window.plugin.portalLevel.layer)
//                window.plugin.portalLevel.updateLayer();
//        });
        window.addHook('portalAdded', window.plugin.portalLevel.portalAdded);
        window.layerChooser.addOverlay(window.plugin.portalLevel.layer, 'Portal level');
        map.addLayer(window.plugin.portalLevel.layer);
    }
    
    // PLUGIN END //////////////////////////////////////////////////////////
    
    if(window.iitcLoaded && typeof setup === 'function') {
        setup();
    } else {
        if(window.bootPlugins)
            window.bootPlugins.push(setup);
        else
            window.bootPlugins = [setup];
    }
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
