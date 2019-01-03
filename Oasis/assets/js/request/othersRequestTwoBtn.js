import {
    statusNotFound,
    statusNotAuthenticated,
    path,
    dateFormatter,
    createPagination
} from '../base.js';


$(document).ready(function () {

    var currPage = 1;
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }

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
                url: path + '/api/requests/list/others?status=REQUESTED&page=' + currPage,
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
                url: path + '/api/requests/list/others?status=REQUESTED&page=' + currPage + '&query=' + keyword,
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
            <div class='table-content table-content-request-others-two-btn-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
            <div class='table-content table-content-request-others-two-btn-photo'>
                <img src='${data.value.requests[index].employee.photo}' alt='photo' class='user__pic'>
            </div>
            <div class='table-content table-content-request-others-two-btn-employee'>${data.value.requests[index].employee.name}</div>
            <div class='table-content table-content-request-others-two-btn-asset'>${data.value.requests[index].asset.name}</div>
            <div class='table-content table-content-request-others-two-btn-qty'>${data.value.requests[index].asset.quantity}</div>
            <div class='table-content table-content-request-others-two-btn-notes'>${data.value.requests[index].request.note}</div>
            <div class='table-content table-content-request-others-two-btn-lastUpdate'>${dateFormatter(data.value.requests[index].request.updatedDate)}</div>
            <div class='table-content table-content-request-others-with-btn-actionBtn1' data-value=${data.value.requests[index].request.id} data-expendable=${data.value.requests[index].asset.expendable}>
                <a href='#' id='action-button-accept'>
                    <svg class='action-icon action-icon-accept'>
                        <use xlink:href='../../assets/img/sprite.svg#icon-checked'></use>
                    </svg>
                </a>
            </div>
            <div class='table-content table-content-request-others-with-btn-actionBtn2' data-value=${data.value.requests[index].request.id}>
                <a href='#' id='action-button-reject'>
                    <svg class='action-icon action-icon-reject'>
                        <use xlink:href='../../assets/img/sprite.svg#icon-unchecked'></use>
                    </svg>
                </a>
            </div>
            `
            document.querySelector('.table-content-request-others-two-btn').insertAdjacentHTML('beforeend', markup);
        }

        var totalPage = data.paging.totalPage;
        $('.pagination').html(createPagination(totalPage, currPage));

    }

    loadAssetList(currPage);

    $('.btn__search').click(function () {
        var keyword = $('.search__input').val();
        window.location.href = '../../views/request/othersRequestRequested.html?search__request=' + keyword;
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-request-others-two-btn').empty();
        loadAssetList(currPage);
    });

    $(document).on('click', '.table-content-request-others-with-btn-actionBtn1', function (e) {
        let selectedRequest = e.target.closest('.table-content-request-others-with-btn-actionBtn1').dataset.value;

        $('.popup__part').load('../../../components/popup/popupTransactionNote.html');

        $(document).on('click', '.btn-confirmation-change-status', function () {
            var transactionNotes = $('.popup__transaction__notes__textarea').val();
            var selectedRequestedData = {
                '_id': selectedRequest,
                'sku': '',
                'quantity': 0,
                'status': 'ACCEPTED',
                'requestNote': '',
                'transactionNote': transactionNotes,
            }
            var arraySelectedRequest = [selectedRequestedData];

            var acceptRequestedData = {
                'requests': arraySelectedRequest
            }

            $.ajax({
                type: 'POST',
                url: path + '/api/requests/save',
                data: JSON.stringify(acceptRequestedData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code == 201) {
                        window.location.href = '../../views/request/othersRequestAccepted.html';
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

    $(document).on('click', '.table-content-request-others-with-btn-actionBtn2', function (e) {
        let selectedRequest = e.target.closest('.table-content-request-others-with-btn-actionBtn2').dataset.value;
        $('.popup__part').load('../../../components/popup/popupTransactionNote.html');
        $('.popup').css('display', 'block');

        $(document).on('click', '.btn-confirmation-change-status', function () {
            var transactionNotes = $('.popup__transaction__notes__textarea').val();
            var selectedRequestedData = {
                '_id': selectedRequest,
                'sku': '',
                'quantity': 0,
                'status': 'REJECTED',
                'requestNote': '',
                'transactionNote': transactionNotes,
            }
            var arraySelectedRequest = [selectedRequestedData];

            var rejectRequestedData = {
                'requests': arraySelectedRequest
            }

            $.ajax({
                type: 'POST',
                url: path + '/api/requests/save',
                data: JSON.stringify(rejectRequestedData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code == 201) {
                        window.location.href = '../../views/request/othersRequestRejected.html';
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
        window.location.href = '../../views/request/othersRequestRequested.html';
    });

})