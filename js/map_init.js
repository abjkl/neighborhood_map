
/* ======= Get Bart Station's Data From API ======= */

var locations=[];
var bartUrl = "http://api.bart.gov/api/stn.aspx?cmd=stns&key=ZQZS-58I3-92RT-DWE9&json=y";

$.ajax({
    timeout : 5000,
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
            locations.push(l);
        }
        init();
    },
    error: function () {
        // alert ("Cannot load data!")
        $('#error').text("Can not load BART information");
    }
});


/* ======= View Model of the List (Use Knockoutjs)======= */

// Create the station list on the left,within the the element with the id of  "station-list"

var listView = {
    init: function () {
        ko.applyBindings(new listView.ViewModel());
        // octopus.search()
    },
    ViewModel: function () {
        var self = this;
        self.locationData = locations;
        console.info(self.locationData[1].station);
        self.id = function (station) {
			    var stations = [];
			    for (i=0;i<self.locationData.length;i++){
			        var s = self.locationData[i].station;
			        stations.push(s);
                }
                var id = stations.indexOf(station);
                return id;

            };

        self.showInfowWindow = function (data, event) {
            var s = data.station;
            var i = self.id(s);
            populateInfoWindow(markers[i], largeInfowindow);
        };

        self. listSearch=function(data,event){
            // set every stations be visible first before start the search.
            $("li").css("display", "block");


            // get input's value
            var input = $('#station-search').val();

            // filter the <li> element without input's value;
            var arry = $("li:not(:contains('" + input + "'))");

            // var arry = $("li:not(:contains('" + self.inputSearch + "'))");
            arry.css("display", "none");
            var list = [];
            for (var n = 0; n < arry.length; n++) {
                var id = arry.eq(n).attr('id');
                list.push(id);
            }

            // filter the markers;
            for (var m = 0; m < list.length; m++) {
                var i = list[m];
                markers[i].setMap(null);
            }
        };

        self.listWrap = function (data,event) {
            if ($('.options-box').is(':hidden')){
            $('.options-box').show();
            $('#nav').css("left","25%");
            $('#map').css("left","25%");
        }
        else {
            $('.options-box').hide();
            $('#nav').css("left","0");
            $('#map').css("left","0");
        }
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
        markers.push(marker);

        // make every marker can be clicked;
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);

        });

        // sert markers on the map;
         markers[i].setMap(map);
         bounds.extend(markers[i].position);
    }
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

/* ======= Start! ======= */

var init = function() {
    initMap();
    listView.init();

};