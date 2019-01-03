import {
    statusSuccess,
    statusNotFound,
    statusNotAuthenticated,
    path,
    createPagination
} from '../base.js';

$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }
    var currPage = 1;
    var totalPage;
    localStorage.removeItem('selectedAsset');

    $('.section .asset').removeClass('section asset');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').addClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });

    function listData(data, currPage) {
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        $('#total-asset-text').text(data.paging.totalRecords);

        for (var index = 0; index < data.value.availableAssets.length; index++) {
            var markup =
                `
            <div class='table-content-asset-no-btn-list'>
                <input type='checkbox' class='table-content-asset-no-btn-checkbox' name='asset-checkbox-delete' value='${data.value.availableAssets[index].sku}'>              
                <div class='table-content table-content-asset-no-btn-name'>${data.value.availableAssets[index].name}</div>
                <div class='table-content table-content-asset-no-btn-brand'>${data.value.availableAssets[index].brand}</div>
                <div class='table-content table-content-asset-no-btn-type'>${data.value.availableAssets[index].type}</div>
                <div class='table-content table-content-asset-no-btn-location'>${data.value.availableAssets[index].location}</div>
                <div class='table-content table-content-asset-no-btn-qty'>${data.value.availableAssets[index].quantity} pcs</div>                                      
            </div> 
            `
            document.querySelector('.table-content-asset-no-btn').insertAdjacentHTML('beforeend', markup);


            if (localData != null && localData != '[]') {
                for (var order = 0; order < localArray.length; order++) {
                    if (data.value.availableAssets[index].sku == localArray[order]) {
                        $('input[value=' + localArray[order] + ']').attr('checked', true);
                    }
                }
            }

        }

        totalPage = data.paging.totalPage;
        $('.pagination').html(createPagination(totalPage, currPage));
    }

    function loadAssetList(currPage) {
        if (window.location.href.indexOf('#') != -1) {
            window.location.href = '../../views/asset/assetRequest.html';
        }
        const url = window.location.href;
        const index = url.indexOf('search__asset');
        if (index === -1) {
            $.ajax({
                type: 'GET',
                url: path + '/api/assets/list?page=' + currPage + '&sort=A-name',
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                },
                error: function (data) {
                    showExclusiveButton(JSON.parse(data.responseText));
                    if (data.responseJSON.code == statusNotFound) {
                        $('.asset__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                        $('.btn-asset-request-select').hide();
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        } else {
            let keyword = url.substr(index + 14, url.length - 1);
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8085/oasis/api/assets/list?query=' + keyword + '&page=' + currPage + '&sort=A-name',
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code === statusSuccess) {
                        listData(data);
                    }
                },
                error: function (data) {
                    showExclusiveButton(JSON.parse(data.responseText));
                    if (data.responseJSON.code == statusNotFound) {
                        $('.asset__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                        $('.btn-asset-request-select').hide();
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        }
    }

    loadAssetList(currPage);

    var localData = localStorage.getItem('selectedAsset');
    var localArray = $.parseJSON(localData);

    if (localData == null || localData == '[]') {
        var selectedIdArray = [];
        localStorage.setItem('selectedAsset', JSON.stringify(selectedIdArray));
        $('.checkbox__total-text').text(0);
    } else {
        $('.checkbox__total-text').text(localArray.length);
    }

    function checkAll() {
        var inputs = document.querySelectorAll('.table-content-asset-no-btn-checkbox');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
        }
        $('.table-content-asset-no-btn-checkbox').trigger('change');
        this.onclick = uncheckAll;
    }

    function uncheckAll() {
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        localStorage.setItem('selectedAsset', '[]');
        $('.checkbox__total-text').text(localArray.length);
        window.location.href = '../../views/asset/assetRequest.html';
    }

    var el = document.querySelector('.asset__middle__checkbox-all');
    el.onclick = checkAll;

    $(document).on('change', '.table-content-asset-no-btn-checkbox', function () {
        var selectedIdArray = [];
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        if (localData == null || localData == '[]') {
            selectedIdArray.push(this.value);
            localStorage.setItem('selectedAsset', JSON.stringify(selectedIdArray));
            $('.checkbox__total-text').text(selectedIdArray.length);
        } else {
            var flag = -1;
            for (var i = 0; i < localArray.length; i++) {
                if (this.value == localArray[i]) {
                    flag = i;
                }
            }
            if (flag != -1) {
                localArray.splice(flag, 1);
            } else {
                localArray.push(this.value);
            }
            localStorage.setItem('selectedAsset', JSON.stringify(localArray));
            $('.checkbox__total-text').text(localArray.length);
        }
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-asset-no-btn').empty();
        loadAssetList(currPage);
    });

    $('.btn-asset-request-select').click(function () {
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        if (localArray.length > 0) {
            var requestedData = {
                'skus': localArray
            }

            $.ajax({
                type: 'POST',
                url: path + '/api/requests/list/requested-assets?page=1',
                data: JSON.stringify(requestedData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    for (var index = 0; index < data.value.requestedAssets.length; index++) {
                        var markup =
                            `
                            <div class='popup__asset__request__note__contents__left'>
                                <div class='popup__asset__request__note__contents__pic' style='background-image:url(${data.value.requestedAssets[index].images[0]})'></div>
                            </div>
                            <div class='popup__asset__request__note__contents__middle'>
                                <h2 class='title__small popup__asset__request__note__contents__name'>${data.value.requestedAssets[index].name}</h2>
                                <div class='popup__asset__request__note__contents__qty'>
                                    <input type='number' class='popup__asset__request__note__contents__qty__input popup__asset__request__note__contents__qty__input-${data.value.requestedAssets[index].sku}' value='1' min='1' max='${data.value.requestedAssets[index].quantity}'></input>
                                </div>
                            </div>
                            <div class='popup__asset__request__note__contents__right'>
                                <div class='popup__asset__request__note__contents__note'>
                                    <textarea class='popup__asset__request__note__contents__text popup__asset__request__note__contents__text-${data.value.requestedAssets[index].sku}' cols='50' rows='5'></textarea>
                                </div>
                            </div>
                            <div class='popup__asset__request__note__contents__delete' data-value=${data.value.requestedAssets[index].sku}>
                                <a href='#' class='action-button-blue'>
                                    <svg class='action-icon action-icon-blue'>
                                        <use xlink:href='../../assets/img/sprite.svg#icon-garbage'></use>
                                    </svg>
                                </a>
                            </div>
                            `
                        document.querySelector('.popup__asset__request__note__contents').insertAdjacentHTML('beforeend', markup);
                    }
                },
                error: function (data) {
                    if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });

            $('.popup__part').load('../../components/popup/popupAssetRequestNote.html');

          
        } else {
            window.location.href = '../../views/asset/assetRequest.html';
        }

    });

    $(document).on('click', '.btn-confirmation-submit', function (e) {

        var arraySelectedRequest = [];
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        for (var index = 0; index < localArray.length; index++) {
            var requestNote = $('.popup__asset__request__note__contents__text-' + localArray[index]).val();
            var requestQty = parseInt($('.popup__asset__request__note__contents__qty__input-' + localArray[index]).val());
            var selectedRequestedData = {
                '_id': null,
                'sku': localArray[index],
                'quantity': requestQty,
                'status': 'REQUESTED',
                'requestNote': requestNote,
                'transactionNote': '',
            }
            arraySelectedRequest.push(selectedRequestedData);
        }

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
                    window.location.href = '../../views/request/myRequestRequested.html';
                    localStorage.removeItem('selectedAsset');
                }
            },
            error: function (data) {
                if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
                }
            }
        });

    });


    $(document).on('click', '.popup__asset__request__note__contents__delete', function (e) {
        var assetId = e.target.closest('.popup__asset__request__note__contents__delete').dataset.value;
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        var removeIndex;
        for (var index = 0; index < localArray.length; index++) {
            if (assetId == localArray[index]) {
                removeIndex = index;
            }
        }

        if (removeIndex >= 0) {
            localArray.splice(removeIndex, 1);
            localStorage.setItem('selectedAsset', JSON.stringify(localArray));
            $('.popup__asset__request__note__contents').empty();
            $('.btn-asset-request-select').trigger('click');
        }
    });

    $('.btn__search').click(function () {
        var keyword = $('.search__input').val();
        window.location.href = '../../views/asset/asset.html?search__asset=' + keyword;
    });

    $('.cancel__text').click(function () {
        window.location.href = '../asset/asset.html';
        localStorage.setItem('selectedAsset', '[]');
    });

    $(document).on('click', '.popup__close__button , .btn-confirmation-cancel', function () {
        $('.popup').hide();
        localStorage.removeItem('selectedAsset');
        window.location.href = '../../views/asset/asset.html';
    });

});