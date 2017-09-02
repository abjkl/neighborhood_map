var locations=[];
var bartUrl = "http://api.bart.gov/api/stn.aspx?cmd=stns&key=ZQZS-58I3-92RT-DWE9&json=y";
var googleUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDd6IZjJsgH8GSkk2lTa98v1cFzT8kb3uY&v=3&callback=initMap";


/* ======= Get Googlemap's JS API ======= */

var googleApi = function () {
    $.ajax({
        timeout : 10000,
        type:"GET",
        url: googleUrl,
        dataType: "script",
        error: function () {
            $('#error').text("Can not load google's API :(");
        }
    });
};

/* ======= Get Bart Station's Data From API ======= */

var getBartData= function(){
    $.ajax({
        timeout : 10000,
        type:"GET",
        url: bartUrl,
        dataType: "json",
        success:function (data) {

            var st = data.root.stations.station;
            for (i=0;i<st.length;i++){
                var l = {};
                l.station = st[i].name;
                l.address = st[i].address+','+st[i].city;
                l.location = {};
                l.location.lat=+ st[i].gtfs_latitude;
                l.location.lng=+ st[i].gtfs_longitude;
                l.id = i;
                locations.push(l);
            }
         listView.init();
        },
        error: function () {
            // alert ("Cannot load data!")
            $('#error').text("Can not load BART information:(");
        }
    });
};

/* ======= View Model of the List (Use Knockoutjs)======= */

// Create the station list on the left,within the the element with the id of  "station-list"

var listView = {
    init: function () {
        ko.applyBindings(new listView.ViewModel());
        // octopus.search()
    },
    ViewModel: function () {
        var self = this;
        self.locationData = ko.observableArray(locations);

        self.showInfowWindow = function (data, event) {
            var i = data.id;
            populateInfoWindow(markers[i], largeInfowindow);
        };

        self.searchInput = ko.observable('');
        

        self.listSearch=function (data,event) {
            $("li").css("display", "block");
            setmarkers(markers);
            for (var i = 0; i < locations.length; i++) {
                var input = self.searchInput().toLowerCase();
                var station = locations[i].name.toLowerCase();
                if (station.match(input) == null) {
                    var id = '#' + i;
                    $(id).css("display", "none");
                    markers[i].setMap(null);
                }
            }
        };

        self.showStationList = ko.observable(true);

        if(document.body.clientWidth < 1000){
            self.showStationList(false);
        }
        self.listWrap= function() {
				self.showStationList(!self.showStationList());
        };
    }
};

/* ======= View Model of the Map ======= */

var map;
var markers = [];
var largeInfowindow;
var bounds;

var initMap = function(){
    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.8332977, lng: -122.3588496},
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
    }
    else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
            }, 1480);
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

var init = function() {
    getBartData();
    googleApi();
};

init();