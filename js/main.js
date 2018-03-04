var map;
var markers = [];
var polygon = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.7413549, lng: -73.9980244},
            zoom: 13,
            styles: styles,
            mapTypeControl: false
        }
    );

    var largeInfoWindow = new google.maps.InfoWindow();

    //init the drawing manager
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControleOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });

    //style the markers
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightdIcon = makeMarkerIcon('FFFF24');
    //loop the locations
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        //create marker per location
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        //put the marker in markers array
        markers.push(marker);
        //click event to open infowindow at each marker
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfoWindow)
        });
        marker.addListener('mouseover', function () {
            this.setIcon(highlightdIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        })
    }

    //get obj
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
    document.getElementById('toggle-drawing').addEventListener('click', function () {
        toggleDrawing(drawingManager);
    });

    //capture the polygon
    drawingManager.addListener('overlaycomplete', function (e) {
        if (polygon) {
            polygon.setMap(null);
            hideListings();
        }
        //switching drawing mode
        drawingManager.setDrawingMode(null);
        // create a new editable polygon
        polygon = e.overlay();
        polygon.setEditable(true);
        // searching within the polygon
        searchWithinPolygon();

    });

    //populate the infowindow when the marker is clicked
    function populateInfoWindow(marker, infoWindow) {
        if (infoWindow.marker != marker) {
            infoWindow.setContent('');
            infoWindow.marker = marker;
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
            });
            //get street view for markers
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;

            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infoWindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>No Street View Found</div>');
                }
            }

            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open the infowindow on the correct marker.
            infoWindow.open(map, marker);
        }
    }

    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    function hideListings() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    function toggleDrawing(drawingManager) {
        if (drawingManager.map) {
            drawingManager.setMap(null);
        } else {
            drawingManager.setMap(map);
        }
    }
}

