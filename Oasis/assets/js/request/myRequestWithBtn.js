import {
    statusNotFound,
    path,
    statusNotAuthenticated,
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
        $('.sidebar__icon__request,.sidebar__text__request').addClass('active');
        $('.sidebar__text__request__my').addClass('active');
    });

    function loadAssetList(currPage) {
        const url = window.location.href;
        const index = url.indexOf('search__request');

        if (index === -1) {
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/my?status=REQUESTED&page=' + currPage,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    for (var index = 0; index < data.value.requests.length; index++) {
                        var markup =
                            `
                    <div class='table-content table-content-request-my-with-btn-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
                    <div class='table-content table-content-request-my-with-btn-asset'>${data.value.requests[index].asset.name}</div>
                    <div class='table-content table-content-request-my-with-btn-qty'>${data.value.requests[index].asset.quantity}</div>
                    <div class='table-content table-content-request-my-with-btn-note'>${data.value.requests[index].request.note}</div>
                    <div class='table-content table-content-request-my-with-btn-issuedBy'>${data.value.requests[index].modifier.name}</div>
                    <div class='table-content table-content-request-my-with-btn-lastUpdate'>${dateFormatter(data.value.requests[index].request.updatedDate)}</div>

                    <div class='table-content table-content-request-my-with-btn-actionBtn'
                        id='table-content-request-my-with-btn-actionBtn-cancel' data-value=${data.value.requests[index].request.id}>
                        <a href='#' id='action-button-reject'>
                            <svg class='action-icon action-icon-reject'>
                                <use xlink:href='../../assets/img/sprite.svg#icon-unchecked'></use>
                            </svg>
                        </a>
                    </div>
                    `
                        document.querySelector('.table-content-request-my-with-btn').insertAdjacentHTML('beforeend', markup);
                    }

                    var totalPage = data.paging.totalPage;
                    $('.pagination').html(createPagination(totalPage,currPage));
                },
                error: function (data) {
                    if(data.responseJSON.code==statusNotFound){
                        $('.request__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        }else{
            let keyword = url.substr(index + 16, url.length - 1);
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/my?status=REQUESTED&page=' + currPage+'&query='+keyword,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    for (var index = 0; index < data.value.requests.length; index++) {
                        var markup =
                            `
                    <div class='table-content table-content-request-my-with-btn-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
                    <div class='table-content table-content-request-my-with-btn-asset'>${data.value.requests[index].asset.name}</div>
                    <div class='table-content table-content-request-my-with-btn-qty'>${data.value.requests[index].asset.quantity}</div>
                    <div class='table-content table-content-request-my-with-btn-note'>${data.value.requests[index].request.note}</div>
                    <div class='table-content table-content-request-my-with-btn-issuedBy'>${data.value.requests[index].modifier.name}</div>
                    <div class='table-content table-content-request-my-with-btn-lastUpdate'>${dateFormatter(data.value.requests[index].request.updatedDate)}</div>

                    <div class='table-content table-content-request-my-with-btn-actionBtn'
                        id='table-content-request-my-with-btn-actionBtn-cancel' data-value=${data.value.requests[index].request.id}>
                        <a href='#' id='action-button-reject'>
                            <svg class='action-icon action-icon-reject'>
                                <use xlink:href='../../assets/img/sprite.svg#icon-unchecked'></use>
                            </svg>
                        </a>
                    </div>
                    `
                        document.querySelector('.table-content-request-my-with-btn').insertAdjacentHTML('beforeend', markup);
                    }

                    var totalPage = data.paging.totalPage;
                    $('.pagination').html(createPagination(totalPage,currPage));
                },
                error: function (data) {
                    if(data.responseJSON.code==statusNotFound){
                        $('.request__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        }
    }

    loadAssetList(currPage);

    $('.btn__search').click(function(){
        var keyword=$('.search__input').val();
        window.location.href = '../../views/request/myRequestRequested.html?search__request='+keyword;
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-request-my-with-btn').empty();
        loadAssetList(currPage);
    });

    $(document).on('click', '#table-content-request-my-with-btn-actionBtn-cancel', function (e) {
        $('.popup__part').load('../../../components/popup/popupTransactionNote.html');
        $('.popup').css('display', 'block');  

        $(document).on('click', '.btn-confirmation-change-status', function () {
            var selectedRequest = e.target.closest('#table-content-request-my-with-btn-actionBtn-cancel').dataset.value;
            var transactionNotes = $('.popup__transaction__notes__textarea').val();
            var selectedRequestedData = {
                '_id': selectedRequest,
                'sku': '',
                'quantity': 0,
                'status': 'CANCELLED',
                'requestNote': '',
                'transactionNote': transactionNotes,
            }
            var arraySelectedRequest = [selectedRequestedData];

            var cancelRequestedData = {
                'requests': arraySelectedRequest
            }

            $.ajax({
                type: 'POST',
                url: path + '/api/requests/save',
                data: JSON.stringify(cancelRequestedData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code == 201) {
                        window.location.href = '../../views/request/myRequestCancelled.html';
                    }
                },
                error: function (data) {
                    if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        });
        
    });

    $(document).on('click', '.popup__close__button , .btn-confirmation-cancel ', function () {
        window.location.href = '../../views/request/myRequestRequested.html';
    });

    

})