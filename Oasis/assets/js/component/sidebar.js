$(document).ready(function(){

    if(window.location.href.indexOf('request')==-1){
        $('.sidebar__content__request__other, .sidebar__content__request__my').hide();
    }else{
        $('.sidebar__content__request__other, .sidebar__content__request__my').fadeIn(10000);
    }

    var userData=JSON.parse(localStorage.getItem('userData'));
    if(userData.role=="EMPLOYEE"){
        $('.sidebar__link__dashboard').attr('href','../../views/dashboard/dashboardMyRequest.html')
    }

});