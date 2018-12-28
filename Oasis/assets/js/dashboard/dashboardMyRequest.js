import { statusSuccess, path, dateFormatter, textFormatter } from '../base.js';

$(document).ready(function () {

    var userData=JSON.parse(localStorage.getItem('userData'));

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

    $(document).on('click','.table-content-icon-accept',function(){
        $('.popup__part').load('../../components/popup/popup.html');
        $('.popup').css('display','block');
    });

    $(document).on('click','#btn-confimation-confirm',function(){
        window.location.href='../../views/dashboard/dashboard.html';
    });
    
    $(document).on('click','#btn-confimation-cancel',function(){
        window.location.href='../../views/dashboard/dashboard.html';
    });

    function loadDashboardStatus() {
        $.ajax({
            type: 'GET',
            url: path +'/api/dashboard/status',
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers:{
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                console.log(data);
                if (data.code == statusSuccess) {
                    $('#status__new-asset-total').text(data.value.requestedRequests);
                    $('#status__pending-asset-total').text(data.value.pendingHandoverRequests);
                    $('#status__available-asset-total').text(data.value.availableAsset);
                } else {
                    console.log('error');
                }
            },
            error: function (data) {
                alert('failed dashboard status');
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
            headers:{
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                if (data.code == statusSuccess) {
                    $('#new-request-my-request-total').text(data.paging.totalRecords);
                    var index = 0;
                    var minimumAssetTotal;
                    if (data.value.requests.length > 5) {
                        minimumAssetTotal = 5;
                    }
                    else {
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
                         <div class='table-content table-content-new-request-my-cancel'data-value=${data.value.requests[index].request.id}>
                        <a href='#' id='action-button-reject'>
                            <svg class='action-icon action-icon-reject'>
                                <use xlink:href='../../assets/img/sprite.svg#icon-unchecked'></use>
                            </svg>
                        </a>
                    </div>
                         </div>
                       `;
                        document.querySelector('.table-content-new-request-my').insertAdjacentHTML('beforeend', markup);
                    }
                } else {
                    console.log('error');
                    console.log(data);
                }
            },
            error: function (data) {
                alert('failed new asset req');
            },
            processData: false
        });
    }

    function showExclusiveButton(data){
            if(data.components.btnAssetListDelete==true){
                elements.btnAssetListDelete.show();
            }else{
                $('.asset__upper').css('justify-content','flex-start');
            } 
            
            if(data.components.btnAssetListAdd==true){
                elements.btnAssetListAdd.show();
            }
    
            if(data.components.btnAssetTableEdit==true){
                $('.table-content-asset-admin-edit').css('display','block');
            }
            
    }

});
