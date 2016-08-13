
var filename_hash = {}; /* マップ名→ファイル名 */

jQuery(function($){
    'use strict';

    $('#gobtn').on('click',function(){
        on_go_button_click();
    });
    $('#pict').hide();

    load_setting_xml();
});

function load_setting_xml(){
    'use strict';

    $.ajax({  
        url:'xml/maplist.xml',  
        type:'get',  
        dataType:'xml',  
        timeout:3000,  
        success:parse_setting_xml  
    });  
}

function parse_setting_xml(xml,status){  
    'use strict';

    if(status!='success')return;  
    $(xml).find('item').each(set_a_mapname_to_selectlist);  
}  

function set_a_mapname_to_selectlist(){  
    'use strict';

    var name = $(this).find('name').text();  
    var filename= $(this).find('filename').text();  
  
    $('#maplist').append('<option value="' + name + '">' + name + '</option>');

    /* マップ名→マップファイル名のハッシュを保持 */
    filename_hash[name] = filename;
}  

function on_go_button_click(){
    'use strict';

    /* 選択画面のコントロールを非表示 */
    $('#maplist').hide();
    $('#gobtn').hide();
    $('#speedlist').hide();
    $('#pict').show();

    /* サイクルビュー表示を開始 */
    var name = $('#maplist option:selected').val();
    var filename = filename_hash[name];
    start_cycle_view(filename);
}

