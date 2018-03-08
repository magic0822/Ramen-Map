var locationList = [
        {title: 'zen6', location: {lat: 40.7268239, lng: -73.9871553}},
        {title: 'Minca', location: {lat: 40.723998, lng: -73.9851377}},
        {title: 'Ramen Misoya', location: {lat: 40.728511, lng: -73.9903287}},
        {title: 'Ippudo NY', location: {lat: 40.7289698, lng: -74.0011538}},
        {title: 'Ivan Ramen', location: {lat: 40.7413779, lng: -74.0081795}},
        {title: 'Ramen Setagaya', location: {lat: 40.7217585, lng: -73.9922562}}
    ];

var styles = [
        {
            featureType: 'water',
            stylers: [
                {color: '#19a0d8'}
            ]
        },
        {
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
                {color: '#fff'},
                {weight: 6}
            ]
        },
        {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
                {color: '#e85113'}
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
                {color: '#efe9e4'},
                {lightness: -40}
            ]
        },
        {
            featureType: 'transit.station',
            stylers: [
                {weight: 9},
                {hue: '#e85113'}
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
                {visibility: 'off'}
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
                {color: '#efe9e4'},
                {lightness: -25}
            ]
        }
    ];