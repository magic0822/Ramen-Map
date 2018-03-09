//Get default locations from static data
var Model = function () {
    var self = this;
    self.defaultLocations = locationList;
};

//init all global vars
var model = new Model(), defaultLocations = model.defaultLocations, marker, map, infowindow;
var pointsArr = [], pointsArr2 = [], latArr = [], lngArr = [], pointInfoArr = [], markers = [],
    infowindows = [];

//foursquare credentials
var Client_id = "XEOFWWRTRDMDDWFTA2OUSAHQYG5T4N4XRKBHPDYWSM14YXCH";
var Client_secret = "ONWOUXMMVWNZWQ03GDGMAD0RZDRT5K0PS1PAXY4QHCM4ZJY2";
var foursquareLink = 'https://api.foursquare.com/v2/venues/explore' + '&client_id=' + Client_id + '&client_secret=' + Client_secret + '&v=20180308';

//push data to location array
var defaultList = function (location) {
    var i = 0;
    for (i = 0; i < location.length; i++) {
        pointsArr.push(location[i].name);
        latArr.push(location[i].lat);
        lngArr.push(location[i].lng);
        pointInfoArr.push(location[i].address);
    }
};

//get info from foursquare
var foursquareList = function () {
    $.getJSON(foursquareLink).done(function (data) {
        $.each(data.response.venues, function (i, venues) {
            var flag = 1;
            for (i = 0; i < pointsArr.length; i++) {
                if (venues.name.toLowerCase() == pointsArr[i].toLowerCase()) {
                    flag = 2;
                }
            }
            if (flag == 1) {
                var locJSON = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">' + venues.name + '</h1>' +
                    '<div id="bodyContent">' +
                    '<p><b>Address : </b>' + venues.location.address + '</div>' +
                    '</div>';
                pointsArr.push(venues.name);
                latArr.push(venues.location.lat.toString());
                lngArr.push(venues.location.lng.toString());
                pointInfoArr.push(locJSON);
                pointsArr2.push(venues.name);
            }
        });

        ViewModel();
        initMap();
        createMarkers(pointsArr);
        createInfowindows(pointsArr);
        ko.applyBindings(new ViewModel());

    })
        .fail(function (error) {
            alert("Error has occurred : " + error.status);
            console.log(error);
        });

};

var koLocationEntry = function (data) {
    this.name = data;
};


var ViewModel = function () {
    var self = this;
    var i;

    self.defaultListItems = [];
    self.query = ko.observable('');

    for (i = 0; i < pointsArr.length; i++) {
        {
            self.defaultListItems.push(new koLocationEntry(pointsArr[i]));
        }
    }

    self.defaultKoList = ko.observableArray(self.defaultListItems);

    self.search = function () {
        var str = "this is in search";
        var data = self.query().toLowerCase();

        self.defaultKoList.removeAll();

        for (i = 0; i < pointsArr.length; i++) {
            if (pointsArr[i].toLowerCase().indexOf(data) >= 0) {
                self.defaultKoList.push(new koLocationEntry(pointsArr[i]));
                markers[i].setVisible(true);
            }
            else {
                markers[i].setVisible(false);
            }

        }
    };

    self.listClickAction = function (data) {

        var itemAt = data.name;
        for (i = 0; i < pointsArr.length; i++) {
            if (itemAt.toLowerCase() == pointsArr[i].toLowerCase()) {
                toggleBounce(markers[i]);
                var infowindow = new google.maps.InfoWindow({
                    content: pointInfoArr[i]
                });
                infowindow.open(map, markers[i]);
                setTimeout(function () {
                    infowindow.close();
                }, 3500);
            }

        }
    };
};

function createMarkers(listArr) {
    var i;
    for (i = 0; i < listArr.length; i++) {
        marker = new google.maps.Marker({
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: {lat: parseFloat(latArr[i]), lng: parseFloat(lngArr[i])}
        });
        markers.push(marker);
    }
}

function createInfowindows(listArr) {
    for (i = 0; i < listArr.length; i++) {
        var marker = markers[i];
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                toggleBounce(marker);
                infowindow.setContent(pointInfoArr[i]);
                infowindows.push(infowindow);
                infowindow.open(map, marker);
                setTimeout(function () {
                    infowindow.close();
                }, 3500);
            };
        })(marker, i));
    }
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 3500);
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: parseFloat(latArr[0]), lng: parseFloat(lngArr[0])}
    });
    infowindow = new google.maps.InfoWindow();
}

function googleError() {
    alert("failed to load page ");
}

$(document).ready(function () {
    defaultList(defaultLocations);
});

$(document).ready(function () {
    foursquareList();

});

