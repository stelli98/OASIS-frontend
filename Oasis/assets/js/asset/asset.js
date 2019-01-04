import {
    statusSuccess,
    statusNotFound,
    statusNotAuthenticated,
    path,
    elements,
    createPagination
} from '../base.js';

$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    var currPage = 1;
    var totalPage;
    
    if(userData==null){
        window.location.href='../../../../';
    }

    $('.section .asset').removeClass('section asset');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').addClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
        $('.sidebar__content__request__other').css('display', 'none');
        $('.sidebar__content__request__my').css('display', 'none');
    });

    function listData(data, currPage) {
        $('#total-asset-text').text(data.paging.totalRecords);
        for (var index = 0; index < data.value.availableAssets.length; index++) {
            var markup =
                `
            <div class='table-content-asset-admin-list'>                
            <div class='table-content table-content-asset-admin-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
            <div class='table-content table-content-asset-admin-name'>${data.value.availableAssets[index].name}</div>
            <div class='table-content table-content-asset-admin-brand'>${data.value.availableAssets[index].brand}</div>
            <div class='table-content table-content-asset-admin-type'>${data.value.availableAssets[index].type}</div>
            <div class='table-content table-content-asset-admin-location'>${data.value.availableAssets[index].location}</div>
            <div class='table-content table-content-asset-admin-qty'>${data.value.availableAssets[index].quantity} pcs</div>                                       
            <div class='table-content table-content-asset-admin-icon table-content-asset-admin-view' data-value=${data.value.availableAssets[index].sku}>
                    <a href='#' class='action-button-blue'>    
                        <svg class='action-icon action-icon-blue'>
                            <use xlink:href='../../assets/img/sprite.svg#icon-binoculars'></use>
                        </svg>
                    </a>
            </div>
            <div class='table-content table-content-asset-admin-icon table-content-asset-admin-edit' data-value=${data.value.availableAssets[index].sku}>
                    <a href='#' id='action-button-blue'>    
                        <svg class='action-icon action-icon-blue'>
                            <use xlink:href='../../assets/img/sprite.svg#icon-pencil'></use>
                         </svg>
                    </a>
            </div>
            </div> 
            </div> 
            `
            document.querySelector('.table-content-asset-admin').insertAdjacentHTML('beforeend', markup);
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
                    showExclusiveButton(data);
                },
                error: function (data) {
                    showExclusiveButton(JSON.parse(data.responseText));
                    if (data.responseJSON.code == statusNotFound) {
                        $('.asset__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                        $('.btn-asset-list-delete, .btn-asset-list-request').hide();
                    }else if(data.responseJSON.value.errorCode=statusNotAuthenticated || userData.authToken==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        } else {
            let keyword = url.substr(index + 14, url.length - 1);
            $.ajax({
                type: 'GET',
                url: path + '/api/assets/list?query=' + keyword + '&page=' + currPage + '&sort=A-name',
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code === statusSuccess) {
                        listData(data, currPage);
                        showExclusiveButton(data);
                    }
                },
                error: function (data) {
                    showExclusiveButton(JSON.parse(data.responseText));
                    if (data.responseJSON.code == statusNotFound) {
                        $('.asset__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                        $('.btn-asset-list-delete, .btn-asset-list-request').hide();
                    }else if(data.responseJSON.value.errorCode=statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        }
    }

    function showExclusiveButton(data) {
        if (data.components.btnAssetDeleteBulk == false) {
            elements.btnAssetDeleteBulk.hide();
        }

        if (data.components.btnAssetAddNew == false) {
            elements.btnAssetAddNew.hide();
        }

        if (data.components.btnAssetEdit == false) {
            $('.table-content-asset-admin-edit').hide();
        }

        if (data.components.btnAssetRequest == false) {
            elements.btnAssetRequest.hide();
        }
    }

    loadAssetList(currPage);

    $('.btn__search').click(function () {
        var keyword = $('.search__input').val();
        window.location.href = '../../views/asset/asset.html?search__asset=' + keyword;
    });

    $('.btn-asset-list-delete').click(function () {
        const url = window.location.href;
        const index = url.indexOf('search__asset');
        if (index === -1) {
            window.location.href = '../../views/asset/assetDelete.html';
        } else {
            $('.asset__view').load('../../views/asset/assetDeleteSearch.html');
        }
    });

    $('.btn-asset-list-add').click(function () {
        $('.asset__view').load('../../views/asset/assetAdd.html');
    });

    $('.btn-asset-list-request').click(function () {
        const url = window.location.href;
        const index = url.indexOf('search__asset');
        if (index === -1) {
            window.location.href = '../../views/asset/assetRequest.html';
        } else {
            $('.asset__view').load('../../views/asset/assetRequestSearch.html');
        }
    });

    $(document).on('click', '.table-content-asset-admin-view', function (e) {
        var assetId = e.target.closest('.table-content-asset-admin-view').dataset.value;
        localStorage.setItem('sku', assetId);
        $('.asset__view').load('../../views/asset/assetDetail.html');
    });

    $(document).on('click', '.table-content-asset-admin-edit', function (e) {
        var assetId = e.target.closest('.table-content-asset-admin-edit').dataset.value;
        localStorage.setItem('sku', assetId);
        window.location.href = '../../views/asset/assetEdit.html'
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-asset-admin').empty();
        loadAssetList(currPage);
    });



});