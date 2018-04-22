// the Ramen restaurant list
const locationList = [
        {
            "name": "Zen6",
            "lat": "40.7268239",
            "lng": "-73.9871553",
            "address": '<div id="infoBox">' +
            '<div id="subBox">' +
            '</div>' +
            '<h4 id="title" class="title">Zen6</h4>' +
            '<div id="address">' +
            '<p><b>Address : </b>328 E 6th St, New York, NY 10003</div>' +
            '</div>'
        },
        {
            "name": "Minca",
            "lat": "40.723998",
            "lng": "-73.9851377",
            "address": '<div id="infoBox">' +
            '<div id="subBox">' +
            '</div>' +
            '<h4 id="title" class="title">Minca</h4>' +
            '<div id="address">' +
            '<p><b>Address : </b>536 E 5th St, New York, NY 10009</div>' +
            '</div>'
        },
        {
            "name": "Ramen Misoya",
            "lat": "40.728511",
            "lng": "-73.9903287",
            "address": '<div id="infoBox">' +
            '<div id="subBox">' +
            '</div>' +
            '<h4 id="title" class="title">Ramen Misoya</h4>' +
            '<div id="address">' +
            '<p><b>Address : </b>129 2nd Ave, New York, NY 10003</div>' +
            '</div>'
        },
        {
            "name": "Ippudo NY",
            "lat": "40.7289698",
            "lng": "-74.0011538",
            "address": '<div id="infoBox">' +
            '<div id="subBox">' +
            '</div>' +
            '<h4 id="title" class="title">Ippudo NY</h4>' +
            '<div id="address">' +
            '<p><b>Address : </b>65 4th Ave, New York, NY 10003</div>' +
            '</div>'
        },
        {
            "name": "Ivan Ramen",
            "lat": "40.7413779",
            "lng": "-74.0081795",
            "address": '<div id="infoBox">' +
            '<div id="subBox">' +
            '</div>' +
            '<h4 id="title" class="title">Ivan Ramen</h4>' +
            '<div id="address">' +
            '<p><b>Address : </b>25 Clinton St, New York, NY 10002</div>' +
            '</div>'
        },
        {
            "name": "Ramen Setagaya",
            "lat": "40.7217585",
            "lng": "-73.9922562",
            "address": '<div id="infoBox">' +
            '<div id="subBox">' +
            '</div>' +
            '<h4 id="title" class="title">Ramen Setagaya</h4>' +
            '<div id="address">' +
            '<p><b>Address : </b>34 St Marks Pl, New York, NY 10003</div>' +
            '</div>'
        }
    ];

//The model to store all infos.
var Model = function () {
    var self = this;
    self.defaultLocations = locationList;
};

// Global variables
var model = new Model(),
    defaultLocations = model.defaultLocations,
    marker = '',
    map = '',
    infowindow = '',
    nameList = [],
    newNameList = [],
    lats = [],
    lngs = [],
    contentInfoArr = [],
    markers = [],
    infowindows = [];

var frsqClientId = "XEOFWWRTRDMDDWFTA2OUSAHQYG5T4N4XRKBHPDYWSM14YXCH\n";
var frsqClientSecret = "ONWOUXMMVWNZWQ03GDGMAD0RZDRT5K0PS1PAXY4QHCM4ZJY2";
var foursquareUrlFirst = 'https://api.foursquare.com/v2/venues/search?categoryId=4d4b7105d754a06374d81259&ll=40.730610,-73.935242&limit=10&query=ramen'
    + '&client_id='
    + frsqClientId + '&client_secret='
    + frsqClientSecret + '&v=20180421';

// Load default location list
var defaultList = function (locations) {
    for (i = 0; i < locations.length; i++) {
        nameList.push(locations[i].name);
        lats.push(locations[i].lat);
        lngs.push(locations[i].lng);
        contentInfoArr.push(locations[i].address);
    }
};

// Load other locations from 4sq API
var get4sqList = function () {
    $.getJSON(foursquareUrlFirst).done(function (data) {
        $.each(data.response.venues, function (i, venues) {
            var flag = 1;
            for (i = 0; i < nameList.length; i++) {
                //filter duplicate results
                if (venues.name.toLowerCase() == nameList[i].toLowerCase()) {
                    flag = 2;
                }
            }
            if (flag == 1) {
                var locJSON = '<div id="infoBox">' +
                    '<div id="subBox">' +
                    '</div>' +
                    '<h4 id="title" class="title">' + venues.name + '</h4>' +
                    '<div id="address">' +
                    '<p><b>Address : </b>' + venues.location.address + '</div>' +
                    '</div>';
                nameList.push(venues.name);
                lats.push(venues.location.lat.toString());
                lngs.push(venues.location.lng.toString());
                contentInfoArr.push(locJSON);
                newNameList.push(venues.name);
            }
        });

        ViewModel();
        initMap();
        createMarkers(nameList);
        createInfowindows(nameList);
        ko.applyBindings(new ViewModel());
    })
        .fail(function (error) {
            alert("Unable to load data due to " + error.status);
            console.log(error);
        });

};

var koLocationEntry = function (data) {
    this.name = data;
};

var ViewModel = function () {
    var self = this, nameLen = nameList.length, i = '';
    self.defaultListItems = [];
    self.query = ko.observable('');
    for (i = 0; i < nameLen; i++) {
        {
            self.defaultListItems.push(new koLocationEntry(nameList[i]));
        }
    }
    self.defaultKoList = ko.observableArray(self.defaultListItems);

    self.search = function () {
        var data = self.query().toLowerCase();
        self.defaultKoList.removeAll();
        for (i = 0; i < nameLen; i++) {
            if (nameList[i].toLowerCase().indexOf(data) >= 0) {
                self.defaultKoList.push(new koLocationEntry(nameList[i]));
                markers[i].setVisible(true);
            }
            else {
                markers[i].setVisible(false);
            }

        }
    };

    self.listClickAction = function (data) {
        var itemAt = data.name;
        for (i = 0; i < nameLen; i++) {
            if (itemAt.toLowerCase() == nameList[i].toLowerCase()) {
                toggleBounce(markers[i]);
                var infowindow = new google.maps.InfoWindow({
                    content: contentInfoArr[i]
                });
                infowindow.open(map, markers[i]);
                setTimeout(function () {
                    infowindow.close();
                }, 3500);
            }
        }
    };
};

function createMarkers(arr) {
    var i = 0, len = arr.length;
    for (i; i < len; i++) {
        marker = new google.maps.Marker({
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: {lat: parseFloat(lats[i]), lng: parseFloat(lngs[i])}
        });
        markers.push(marker);
    }
}

function createInfowindows(arr) {
    var i = 0, len = arr.length;
    for (i = 0; i < len; i++) {
        var marker = markers[i];
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                toggleBounce(marker);
                infowindow.setContent(contentInfoArr[i]);
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
        center: {lat: parseFloat(lats[0]), lng: parseFloat(lngs[0])}
    });
    infowindow = new google.maps.InfoWindow();
}

function googleError() {
    alert("There is an error to load page.");
}

$(document).ready(function () {
    defaultList(defaultLocations);
});

$(document).ready(function () {
    get4sqList();
});
