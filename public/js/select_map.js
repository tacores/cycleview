
function loadXml(){
    $.ajax({  
        url:'xml/maplist.xml',  
        type:'get',  
        dataType:'xml',  
        timeout:3000,  
        success:parse_xml  
    });  
}

function parse_xml(xml,status){  
    if(status!='success')return;  
    $(xml).find('item').each(disp);  
}  

function disp(){  
    var $name = $(this).find('name').text();  
    var $filename= $(this).find('filename').text();  
  
    $('<option value="' + $name + '">' + $name + '</option>')
	    .appendTo('maplist');
}  

$(function(){
    loadXml();
});

