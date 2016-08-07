
var $mapfile_hash = {};

jQuery(function($){
    'use strict';
    $('#gobtn').on('click',function(){
        OnGoButtonClick();
    });
    $('#pict').hide();
    loadXml();
});

function loadXml(){
    'use strict';
    $.ajax({  
        url:'xml/maplist.xml',  
        type:'get',  
        dataType:'xml',  
        timeout:3000,  
        success:parse_xml  
    });  
}

function parse_xml(xml,status){  
    'use strict';
    if(status!='success')return;  
    $(xml).find('item').each(disp);  
}  

function disp(){  
    'use strict';
    var $name = $(this).find('name').text();  
    var $filename= $(this).find('filename').text();  
  
    $('#maplist').append('<option value="' + $name + '">' + $name + '</option>');

    $mapfile_hash[$name] = $filename;
}  

function OnGoButtonClick(){
    'use strict';
    var $name = $('#maplist option:selected').val();
    var $filename = $mapfile_hash[$name];

    $('#maplist').hide();
    $('#gobtn').hide();
    $('#pict').show();

    start_cycle_view($filename);
}

