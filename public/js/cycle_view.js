
var coordinates = [];
var gkey = 'xxx';

function start_cycle_view($filename){
    'use strict';
    coordinates = [];
    loadKml($filename);
    //subdivide_coordinates();
    drawView(0);
    start_view();
}

function start_view(){
    'use strict';
    var index = 1;
    window.setInterval(function() {
	drawView(index++);
    }, 4000);
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

    for(var i=0; i < allTextLines.length; i++){
	if(allTextLines[i] === '') continue;

        var coordinate = allTextLines[i].split(',');
        var longitude = coordinate[0];	// 緯度
	var latitude = coordinate[1];;	// 経度
	var altitude = coordinate[2];;	// 標高

        var tobj = {'longitude':longitude, 'latitude':latitude, 'altitude':altitude};
        coordinates.push(tobj);
    }
}  

function subdivide_coordinates(){
    'use strict';
    var new_coordinates = [];
    for(var i = 0; i < coordinates.length - 1; i++){
	new_coordinates.push(coordinates[i]);
	var delta_longitude = (coordinates[i + 1].longitude - coordinates[i].longitude) / 5;
	var delta_latitude = (coordinates[i + 1].latitude - coordinates[i].latitude) / 5;

	for(var j = 0; j < 4; j++){
            var tobj = {'longitude':coordinates[i].longitude + delta_longitude,
		    'latitude':coordinates[i].latitude + delta_latitude,
		    'altitude':coordinates[i].altitude};
            new_coordinates.push(tobj);
	}
    }
    new_coordinates.push(coordinates[coordinates.length - 1]);
    coordinates = new_coordinates;
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
