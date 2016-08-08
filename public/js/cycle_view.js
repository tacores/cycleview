
var coordinates = [];
var distance_arr = [];
var gkey = 'xxx';

var jisoku = 30; // km/h
var currentDistance = 0;

function start_cycle_view($filename){
    'use strict';
    coordinates = [];
    loadKml($filename);
    start_view();
}

function start_view(){
    'use strict';
    var index = 0;
    var count = 0;
    var timer = window.setInterval(function() {
	move(count++);
	if(needDraw(index)) {
	    drawView(index++);
	}
    }, 1000);
}

function move(count){
    'use strict';
    currentDistance += (((30 * 1000) / 60) / 60); // m/s 
}

function needDraw(index){
    'use strict';
    console.log("next: " + distance_arr[index] + " current: " + currentDistance + "\n");
    if(distance_arr[index] <= currentDistance){
        console.log("next!\n");
        return true;
    }
    console.log("wait...\n");
    return false;
}

function drawView(index){
    'use strict';

    var url = 'url("https://maps.googleapis.com/maps/api/streetview?size=980x661&'
		    + 'location=' + coordinates[index].latitude + ',' + coordinates[index].longitude
		    + '&heading=' + heading(coordinates[index], coordinates[index + 1]) + '&pitch=-0.76'
		    + '&key=' + gkey + '")';

    $('.box').css({
        backgroundImage: url
    });
}

function loadKml($filename){
    'use strict';
    $.ajax({  
	async:false,
        url:$filename,  
        type:'get',  
        dataType:'xml',  
        timeout:3000,  
        success:parse_kml
    });  
}

function parse_kml(xml, status){
    'use strict';
    if(status!='success')return;  
    $(xml).find('kml').each(set_coordinates);  
}

function set_coordinates(){  
    'use strict';
    var coordinates_str = $(this).find('coordinates').text();  

    var allTextLines = coordinates_str.split(/\r\n|\n/);

    var first_element = true;
    var prev_coordinate = {};
    var sum_distance = 0;
    for(var i=0; i < allTextLines.length; i++){
	if(allTextLines[i] === '') continue;

        var coordinate = allTextLines[i].split(',');
        var longitude = coordinate[0];	// 緯度
	var latitude = coordinate[1];;	// 経度
	var altitude = coordinate[2];;	// 標高

        var tobj = {'longitude':longitude, 'latitude':latitude, 'altitude':altitude};
        coordinates.push(tobj);

	if(first_element){
	    first_element = false;
	    distance_arr.push(0);
	    prev_coordinate = tobj;
	    continue;
	}

	var d = distance(prev_coordinate, tobj);
	sum_distance += d;
	distance_arr.push(sum_distance);
	prev_coordinate = tobj;
    }
}  

// fromからtoへの方角（度）を返す
function heading(from, to) {
    'use strict';
    var deltaL = d2r(to.longitude - from.longitude);
    var x = Math.cos(d2r(to.latitude)) * Math.sin(deltaL);
    var y = Math.cos(d2r(from.latitude)) * Math.sin(d2r(to.latitude))
	        - Math.sin(d2r(from.latitude)) * Math.cos(d2r(to.latitude)) * Math.cos(deltaL);
    var beta = Math.atan2(x, y);
    return beta * (180.0 / Math.PI);	// Radian to Degree
}

// Degree to Radian
function d2r(angle) {
    'use strict';
    return Math.PI * angle / 180.0;
}

function distance(from, to) {
    'use strict';
    var lat1 = from.latitude;
    var lon1 = from.longitude;
    var lat2 = to.latitude;
    var lon2 = to.longitude;

    var R = 6371e3; // metres
    var phi1 = d2r(lat1);
    var phi2 = d2r(lat2);
    var delta_phi = d2r(lat2-lat1);
    var delta_lambda = d2r(lon2-lon1);

    var a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
}

