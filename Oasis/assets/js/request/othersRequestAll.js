import {
    statusNotFound,
    statusNotAuthenticated,
    path,
    textFormatter,
    dateFormatter,
    createPagination
} from '../base.js';

$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }
    var currPage = 1;

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__text__request__my').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').addClass('active');
        $('.sidebar__text__request__other').addClass('active');
    });

    function loadAssetList(currPage) {
        const url = window.location.href;
        const index = url.indexOf('search__request');

        if (index === -1) {
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/others?page=' + currPage,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                },
                error: function (data) {
                    if (data.responseJSON.code == statusNotFound) {
                        $('.request__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        } else {
            let keyword = url.substr(index + 16, url.length - 1);
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/others?page=' + currPage + '&query=' + keyword,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                },
                error: function (data) {
                    if (data.responseJSON.code == statusNotFound) {
                        $('.request__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });

        }
    }

    function listData(data, currPage) {
        for (var index = 0; index < data.value.requests.length; index++) {
            var markup =
                `
            <div class='table-content table-content-request-others-all-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
            <div class='table-content table-content-request-others-all-photo'>
                <img src='${data.value.requests[index].employee.photo}' alt='photo' class='user__pic'>
            </div>
            <div class='table-content table-content-request-others-all-employee'>${data.value.requests[index].employee.name}</div>
            <div class='table-content table-content-request-others-all-asset'>${data.value.requests[index].asset.name}</div>
            <div class='table-content table-content-request-others-all-qty'>${data.value.requests[index].asset.quantity}</div>
            <div class='table-content table-content-request-others-all-notes'>${data.value.requests[index].request.note}</div>
            <div class='table-content table-content-request-others-all-status'>${textFormatter(data.value.requests[index].request.status)}</div>
            <div class='table-content table-content-request-others-all-lastUpdate'>${dateFormatter(data.value.requests[index].request.updatedDate)}</div>
            `
            document.querySelector('.table-content-request-others-all').insertAdjacentHTML('beforeend', markup);
        }

        var totalPage = data.paging.totalPage;
        $('.pagination').html(createPagination(totalPage, currPage));

    }

    loadAssetList(currPage);

    $('.btn__search').click(function () {
        var keyword = $('.search__input').val();
        window.location.href = '../../views/request/othersRequestAll.html?search__request=' + keyword;
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-request-others-all').empty();
        loadAssetList(currPage);
    });

});