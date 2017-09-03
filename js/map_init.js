var locations = [];
var bartUrl = "http://api.bart.gov/api/stn.aspx?cmd=stns&key=ZQZS-58I3-92RT-DWE9&json=y";
var googleUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDd6IZjJsgH8GSkk2lTa98v1cFzT8kb3uY&callback=initMap";


/* ======= Set the error View Model   ======= */

var ApiErrorViewModel = function () {
    var self = this;
    self.error = ko.observable('');
};

apiErrorViewModel = new ApiErrorViewModel();
ko.applyBindings(apiErrorViewModel, document.getElementById('error'));


/* ======= Get the Bart and  Googlemaps API  ======= */

var getBartData = function () {
    $.ajax({
        timeout: 10000,
        type: "GET",
        async: false,
        url: bartUrl,
        dataType: "json",
        success: function (data) {
            var st = data.root.stations.station;
            for (i = 0; i < st.length; i++) {
                var l = {};
                l.station = st[i].name;
                l.address = st[i].address + ',' + st[i].city;
                l.location = {};
                l.location.lat = +st[i].gtfs_latitude;
                l.location.lng = +st[i].gtfs_longitude;
                l.id = i;
                locations.push(l);
            }
            listView.init();
        },
        error: function () {
            apiErrorViewModel.error("Can't load bart information :(  ");
        }
    });
};

var googleApi = function () {
    $.ajax({
        async: false,
        timeout: 10000,
        type: "GET",
        url: googleUrl,
        dataType: "script",
        error: function () {
            apiErrorViewModel.error(" " + "Can not load Google Api :(  ");
        }
    });
};


/* ======= Create the list view  ======= */

var listView = {
    init: function () {
            var viewModel = new listView.ViewModel();
            ko.applyBindings(viewModel, document.getElementById('list'));
        },
        ViewModel: function () {
            var self = this;

            // The station list generation
            self.locationData = ko.observableArray([]);
            self.mapLocations = function () {
                self.locationData.removeAll();
                for (var i = 0; i < locations.length; i++) {
                    self.locationData.push(locations[i]);
                }
            };
            self.mapLocations();

            // The station list click callback
            self.showInfowWindow = function (data, event) {
                var i = data.id;
                populateInfoWindow(markers[i], largeInfowindow);
            };

            // The filter function
            self.searchInput = ko.observable('');
            self.listSearch = function (data, event) {
                self.locationData.removeAll();
                setmarkers(markers);
                for (var i = 0; i < locations.length; i++) {
                    var input = self.searchInput().toLowerCase();
                    var station = locations[i].station.toLowerCase();
                    if (station.toLowerCase().indexOf(input.toLowerCase()) < 0) {
                        markers[i].setMap(null);
                    } else {
                        self.locationData.push(locations[i]);
                    }
                }
            };

            // Station list wrap or not
            self.showStationList = ko.observable(true);
            if (document.body.clientWidth < 1000) {
                self.showStationList(false);
            }
            self.listWrap = function () {
                self.showStationList(!self.showStationList());
            };

        }
};


/* ======= Create the Map ======= */

var map;
var markers = [];
var largeInfowindow;
var bounds;

var initMap = function () {
    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.8332977,
            lng: -122.3588496
        },
        zoom: 12,
        styles: styles,
        mapTypeControl: false
    });

    // Create markers array;
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        console.info(position);
        var title = locations[i].address;
        var station = locations[i].station;
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            lable: station,
            animation: google.maps.Animation.DROP,
            id: i
        });
        addClickListener(marker);
        markers.push(marker);
        addClickListener(marker);

    }
    setmarkers(markers);
    map.fitBounds(bounds);

};


/* ======= Handle popup of the Information Window ======= */

var populateInfoWindow = function (marker, infowindow) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1400);
    }
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div><h2>' + marker.lable + '</h2><p>' + marker.title + '</p></div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
    }
};

var addClickListener = function (marker) {
    marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow);
    });
};

var setmarkers = function (markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
        map.fitBounds(bounds);
    }
};


/* ======= Start! ======= */

var init = function () {
    getBartData();
    googleApi()

};

init();