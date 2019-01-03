import {
    path,
    elements
} from '../base.js';

$(document).ready(function () {

    if (window.location.href.indexOf('request') == -1) {
        $('.sidebar__content__request__other, .sidebar__content__request__my').hide();
    } else {
        $('.sidebar__content__request__other, .sidebar__content__request__my').fadeIn(10000);
    }

    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData.role == "EMPLOYEE") {
        $('.sidebar__link__dashboard').attr('href', '../../views/dashboard/dashboardMyRequest.html');
        $('.sidebar__link__request').attr('href','../../views/request/myRequestAll.html');
    }

    $.ajax({
        type: 'GET',
        url: path + '/api/sidebar',
        contentType: 'application/octet-stream',
        dataType: 'json',
        headers: {
            "X-Auth-Token": userData.authToken
        },
        success: function (data) {
            showExclusiveButton(data);
        },
        error: function (data) {
            showExclusiveButton(JSON.parse(data.responseText));
        }
    });


    function showExclusiveButton(data) {
        if (data.components.sidebarRequestOther == false) {
            $('.sidebar__content__request__other').css('display', 'none');
        }

        if (data.components.sidebarRequestMy == false) {
            $('.sidebar__content__request__my').css('display', 'none');
        }
    }

});