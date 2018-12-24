$(document).ready(function(){

    if(window.location.href.indexOf('request')==-1){
        $('.sidebar__content__request__other, .sidebar__content__request__my').hide();
    }else{
        $('.sidebar__content__request__other, .sidebar__content__request__my').fadeIn(10000);
    }
});