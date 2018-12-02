import { statusSuccess, path } from '../base.js';

$(document).ready(function () {

    
    var username=localStorage.getItem("username");

    $(".sidebar__part").load("../../components/sidebar/sidebar.html", function () {
        $(".navbar__part").load("../../components/navbar/navbar.html", function () {
            $(".user__name").text(username);
            $(".status__part").load("dashboardStatus.html", function () {
                loadDashboardStatus();
                $(".new-request__part").load("dashboardNewAssetRequest.html", function () {
                    loadNewAssetRequest();
                    $(".sidebar__icon__dashboard,  .sidebar__text__dashboard").addClass("active");
                    $(".sidebar__icon__asset,.sidebar__text__asset").removeClass("active");
                    $(".sidebar__icon__employee,.sidebar__text__employee").removeClass("active");
                    $(".sidebar__icon__request,.sidebar__text__request").removeClass("active");
                });
            });
        });
    });

    $(document).on('click','.table-content-icon-accept',function(){
        $(".popup__part").load("../../components/popup/popup.html");
        $(".popup").css("display","block");
    });

    function loadDashboardStatus() {
        $.ajax({
            type: 'GET',
            url: path +'/api/dashboard/status/'+username,
            contentType: 'application/octet-stream',
            dataType: 'json',
            success: function (data) {
                if (data.code == statusSuccess) {
                    $("#status__new-asset-total").text(data.value.requestedRequests);
                    $("#status__pending-asset-total").text(data.value.pendingHandoverRequests);
                    $("#status__available-asset-total").text(data.value.availableAsset);
                    $("#new-request-asset-total").text(data.value.requestedRequests);
                } else {
                    console.log("error");
                }
            },
            error: function (data) {
                alert("failed dashboard status");
            },
            processData: false
        });
    }

    function loadNewAssetRequest() {
        $.ajax({
            type: 'GET',
            url: path + '/api/dashboard/request-update/' + username + '?tab=Others&page=1&sort=DupdatedDate',
            contentType: 'application/octet-stream',
            dataType: 'json',
            success: function (data) {
                if (data.code == statusSuccess) {
                    var index = 0;
                    var minimumAssetTotal;
                    if (data.value.requests.length > 5) {
                        minimumAssetTotal = 5;
                    }
                    else {
                        minimumAssetTotal = data.value.requests.length;
                    }

                    for (index; index < minimumAssetTotal; index++) {
                        var markup = `
                        <div class="table-content-new-request-admin-list" id="table-content-new-request-admin-list--${index}">
                        <div class="table-content table-content-photo">
                                <img src="../../assets/img/employees/user.jpg" alt="photo" class="user__pic">
                        </div>
                        <div class="table-content table-content-new-request-admin-name"  id="table-content-new-request-admin-name--${index}">${data.value.requests[index].employee.employeeName}</div>
                        <div class="table-content table-content-new-request-admin-asset" id="table-content-new-request-admin-asset--${index}">${data.value.requests[index].asset.assetName}</div>
                        <div class="table-content table-content-new-request-admin-qty"   id="table-content-new-request-admin-qty--${index}">${data.value.requests[index].asset.assetQuantity}</div>
                        <div class="table-content table-content-new-request-admin-note"  id="table-content-new-request-admin-note--${index}">${data.value.requests[index].request.requestNote}</div>
                        <div class="table-content table-content-new-request-admin-icon table-content-icon-accept" id="table-content-new-request-admin-accept--${index}">
                                <a href="#" class="action-button-accept">    
                                    <svg class="action-icon action-icon-accept">
                                        <use xlink:href="../../assets/img/sprite.svg#icon-checked"></use>
                                    </svg>
                                </a>
                        </div>
                        <div class="table-content table-content-new-request-admin-icon table-content-icon-reject" id="table-content-new-request-admin-accept--${index}">
                                <a href="#" id="action-button-reject">    
                                    <svg class="action-icon action-icon-reject">
                                        <use xlink:href="../../assets/img/sprite.svg#icon-unchecked"></use>
                                    </svg>
                                </a>
                        </div>
                        </div>`;
                        document.querySelector(".table-content-new-request-admin").insertAdjacentHTML('beforeend', markup);
                    }
                } else {
                    console.log("error");
                }
            },
            error: function (data) {
                alert("failed new asset req");
            },
            processData: false
        });
    }


    //localStorage.removeItem('id');

});
