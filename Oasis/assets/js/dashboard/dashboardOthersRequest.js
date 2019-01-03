import {
    statusSuccess,
    statusNotFound,
    statusNotAuthenticated,
    path,
    dateFormatter,
    elements
    }    from '../base.js';

$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }


    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html', function () {
            loadDashboardStatus();
            loadNewAssetRequest();
            $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').addClass('active');
            $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
            $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
            $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
        });
    });

    $(document).on('click', '.table-content-new-request-others-accept', function (e) {
        var selectedRequest = e.target.closest('.table-content-new-request-others-accept').dataset.value;
        $('.popup__part').load('../../components/popup/popupTransactionNote.html');
        $('.popup').css('display', 'block');

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

    $(document).on('click', '.table-content-new-request-others-reject', function (e) {
        var selectedRequest = e.target.closest('.table-content-new-request-others-reject').dataset.value;
        $('.popup__part').load('../../components/popup/popupTransactionNote.html');
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

    function loadDashboardStatus() {
        $.ajax({
            type: 'GET',
            url: path + '/api/dashboard/status',
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                if (data.code == statusSuccess) {
                    $('#status__new-asset-total').text(data.value.requestedRequests);
                    $('#status__pending-asset-total').text(data.value.pendingHandoverRequests);
                    $('#status__available-asset-total').text(data.value.availableAsset);
                }
            },
            error: function (data) {
                if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
                }  
            },
            processData: false
        });
    }

    function loadNewAssetRequest() {
        $.ajax({
            type: 'GET',
            url: path + '/api/dashboard/request-update?tab=others&page=1',
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                if (data.code == statusSuccess) {
                    $('#new-request-others-request-total').text(data.paging.totalRecords);
                    var index = 0;
                    var minimumAssetTotal;
                    if (data.value.requests.length > 5) {
                        minimumAssetTotal = 5;
                    } else {
                        minimumAssetTotal = data.value.requests.length;
                    }

                    for (index; index < minimumAssetTotal; index++) {
                        var markup =
                            `
                        <div class="table-content-new-request-others-list">
                        <div class='table-content table-content-new-request-others-photo'>
                        <img src='${data.value.requests[index].employee.photo}' alt='photo' class='user__pic'>
                        </div>
                        <div class="table-content table-content-new-request-others-employee">${data.value.requests[index].employee.name}</div>
                        <div class="table-content table-content-new-request-others-asset">${data.value.requests[index].asset.name}</div>
                        <div class="table-content table-content-new-request-others-qty">${data.value.requests[index].asset.quantity}</div>
                        <div class="table-content table-content-new-request-others-notes">${data.value.requests[index].request.note}</div>
                        <div class="table-content table-content-new-request-others-lastUpdate">${dateFormatter(data.value.requests[index].request.updatedDate)}</div>
                        <div class="table-content table-content-new-request-others-accept" data-value="${data.value.requests[index].request.id}">
                            <a href='#' id='action-button-accept'>
                                <svg class='action-icon action-icon-accept'>
                                    <use xlink:href='../../assets/img/sprite.svg#icon-checked'></use>
                                </svg>
                            </a>
                        </div>
                        <div class="table-content table-content-new-request-others-reject" data-value="${data.value.requests[index].request.id}">
                            <a href='#' id='action-button-reject'>
                                <svg class='action-icon action-icon-reject'>
                                    <use xlink:href='../../assets/img/sprite.svg#icon-unchecked'></use>
                                </svg>
                            </a>
                        </div>
                        </div>
                        `;
                        document.querySelector('.table-content-new-request-others').insertAdjacentHTML('beforeend', markup);
                    }
                    showExclusiveButton(data);
                }
            },
            error: function (data) {
                showExclusiveButton(JSON.parse(data.responseText));
                if (data.responseJSON.code == statusNotFound) {
                    $('.new-request__footer').load('../../components/errorPage/errorDataNotFoundTab.html');
                }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
                }
            },
            processData: false
        });
    }

    $(document).on('click', '.popup__close__button , .btn-confirmation-cancel ', function () {
        window.location.href = '../../views/dashboard/dashboardOthersRequest.html';
    });

    function showExclusiveButton(data) {
        if (data.components.btnNewRequestChangeTab == false) {
            elements.btnNewRequestChangeTab.css('display', 'none');
        }
    }

});