var map;
var markers = [];
// var polygon = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.7413549, lng: -73.9980244},
            zoom: 13,
            styles: styles,
            mapTypeControl: false
        }
    );

    var largeInfoWindow = new google.maps.InfoWindow();
    ko.applyBindings(new ViewModel());

    }

    function ViewModel() {
        var self = this;
        this.locations = ko.observableArray([]);
        locationList.forEach(function (location) {
            self.locations.push(new Location(location))
        });
    }

    function errorHandler() {
        alert("Unknown error, please try again.");
    }

    //get obj
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);

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
}

