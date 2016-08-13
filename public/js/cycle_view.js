
var coordinates = []; //全座標を保持
var distance_arr = []; //各座標の、スタート地点からの距離
var gkey = 'xxx'; //Google APIキー

var speed = 0; // km/h
var currentDistance = 0; //スタート地点からの距離

/* サイクルビュー表示を開始 */
function start_cycle_view(filename){
    'use strict';
    coordinates = [];
    distance_arr = [];
    speed = $('#speedlist option:selected').val();

    load_kml(filename);
    start_timer();
}

function start_timer(){
    'use strict';
    var current_pos = 0;
    var timer_count = 0;
    var timer = window.setInterval(function() {
	move(timer_count++);
	if(need_draw(current_pos)) {
	    draw_view(current_pos++);
	}
    }, 1000);
}

function move(timer_count){
    'use strict';
    currentDistance += (((speed * 1000) / 60) / 60); // m/s 
}

function need_draw(current_pos){
    'use strict';
    console.log("next: " + distance_arr[current_pos] + " current: " + currentDistance + "\n");
    if(distance_arr[current_pos] <= currentDistance){
        console.log("next!\n");
        return true;
    }
    console.log("wait...\n");
    return false;
}

function draw_view(current_pos){
    'use strict';
    var url = 'url("https://maps.googleapis.com/maps/api/streetview?size=980x661&'
		    + 'location=' + coordinates[current_pos].latitude + ',' + coordinates[current_pos].longitude
		    + '&heading=' + heading(coordinates[current_pos], coordinates[current_pos + 1]) + '&pitch=-0.76'
		    + '&key=' + gkey + '")';

    $('.box').css({
        backgroundImage: url
    });
}

function load_kml(filename){
    'use strict';
    $.ajax({  
	async:false,
        url:filename,  
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
    var coordinates_str = $(this).find('coordinates').text(); //全座標が含まれる文字列
    var coordinate_str_arr = coordinates_str.split(/\r\n|\n/); //1行（1座標）ごとに分解

    var first_element = true;
    var prev_coordinate = {};
    var sum_distance = 0;
    for(var i=0; i < coordinate_str_arr.length; i++){
	if(coordinate_str_arr[i] === '') continue;

        var coordinate = coordinate_str_arr[i].split(',');
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

// fromからtoへの距離（メートル）を返す
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

