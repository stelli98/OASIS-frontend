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
            window.location.href = '../../views/asset/asset.html';
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
                        $('. btn-asset-list-delete').hide();
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
                        $('. btn-asset-list-delete').hide();
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
        window.location.href = '../../views/asset/assetDelete.html';
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

    $('.btn__search').click(function () {
        var keyword = $('.search__input').val();
        window.location.href = '../../views/asset/asset.html?search__asset=' + keyword;
    });

    $('.cancel__text').click(function () {
        window.location.href = '../asset/asset.html';
        localStorage.setItem('selectedAsset', '[]');
    });

    $('.btn-asset-list-delete').click(function () {

        $('.popup__part').load('../../components/popup/popupDeleteConfirmation.html');
        $('.popup').css('display', 'block');

        $(document).on('click', '.btn-confirmation-confirm', function () {
            var localData = localStorage.getItem('selectedAsset');
            var localArray = $.parseJSON(localData);

            var deleteData = {
                skus: localArray
            }

            console.log(deleteData);

            $.ajax({
                type: 'DELETE',
                url: path + '/api/assets/delete',
                data: JSON.stringify(deleteData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code === 200) {
                        window.location.href = '../../views/asset/asset.html';
                    }
                },
                error: function (data) {
                    if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });

            localStorage.removeItem('selectedAsset');
        });

        $(document).on('click', '#btn-confimation-cancel', function () {
            localStorage.removeItem('selectedAsset');
            window.history.back();
        });
    });

    $(document).on('click', '.popup__close__button , .btn-confirmation-cancel', function () {
        $('.popup').hide();
        localStorage.removeItem('selectedAsset');
        window.history.back();
    });


});