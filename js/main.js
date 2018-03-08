var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.7413549, lng: -73.9980244},
            zoom: 13,
            styles: styles,
            mapTypeControl: false
        }
    );
}

function ViewModel() {
    var self = this;
    self.initMap = new initMap();
    window.map = self.initMap.map;

    self.location = function (name, lat, lng) {
        this.name = name;
        this.lat = ko.observable(lat);
        this.lng = ko.observable(lng);
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            title: name,
            map: self.initMap.map
        });
    };

    self.locations = ko.observableArray([
        new self.location('zen6', 40.7268239, -73.9871553),
        new self.location('Minca', 40.723998, -73.9851377),
        new self.location('Ramen Misoya', 40.728511, -73.9903287),
        new self.location('Ippudo NY', 40.7289698, -74.0011538),
        new self.location('Ivan Ramen', 40.7413779, -74.0081795),
        new self.location('Ramen Setagaya', 40.7217585, -73.9922562)
    ]);

    self.currentLocation = ko.observable();
    self.locationFilter = ko.observable('');
    self.showLocations = ko.computed(function () {
        return ko.utils.arrayFilter(self.locations(), function (location) {
            return location.name.toLowerCase().indexOf(self.locationFilter().toLowerCase()) !== -1;
        });
    }, self);
    self.showLocations.subscribe(function(){
        self.toggleMarkers();
        if(self.infowindow.isOpen === true) {
            self.infowindow.close();
            self.infowindow.isOpen = false;
            self.infowindowClosed();
        }
    });


}

