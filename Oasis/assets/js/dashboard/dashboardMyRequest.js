import {
    statusSuccess,
    statusNotFound,
    statusNotAuthenticated,
    path,
    dateFormatter,
    textFormatter,
    elements
} from '../base.js';

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
            url: path + '/api/dashboard/request-update?tab=my&page=1',
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                if (data.code == statusSuccess) {
                    $('#new-request-my-request-total').text(data.paging.totalRecords);
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
                         <div class="table-content-new-request-my-list">
                         <div class="table-content table-content-new-request-my-asset">${data.value.requests[index].asset.name}</div>
                         <div class="table-content table-content-new-request-my-qty">${data.value.requests[index].asset.quantity}</div>
                         <div class="table-content table-content-new-request-my-note">${data.value.requests[index].request.note}</div>
                         <div class="table-content table-content-new-request-my-status">${textFormatter(data.value.requests[index].request.status)}</div>
                         <div class="table-content table-content-new-request-my-issuedBy">${data.value.requests[index].modifier.name}</div>
                         <div class="table-content table-content-new-request-my-lastUpdate">${dateFormatter(data.value.requests[index].request.updatedDate)}</div>
                         </div>
                       `;
                        document.querySelector('.table-content-new-request-my').insertAdjacentHTML('beforeend', markup);
                    }
                }

                showExclusiveButton(data);
            },
            error: function (data) {
                showExclusiveButton(JSON.parse(data.responseText));
                if (data.responseJSON.code == statusNotFound) {
                    $('.new-request__down').load('../../components/errorPage/errorDataNotFoundTab.html');
                }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
                }
            },
            processData: false
        });

    }

    function showExclusiveButton(data) {
        if (data.components.btnNewRequestChangeTab == false) {
            elements.btnNewRequestChangeTab.css('display', 'none');
        }

        if (data.components.btnNewRequestReject == false) {
            elements.btnNewRequestReject.css('display', 'none');
        }

        if (data.components.btnNewRequestAccept == false) {
            elements.btnNewRequestAccept.css('display', 'none');
        }

        if (data.components.sectionNewRequestOthers == false) {
            elements.sectionNewRequestOthers.css('display', 'none');
        }

    }

});