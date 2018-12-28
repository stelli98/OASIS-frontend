import { statusSuccess, path } from '../base.js';

$(document).ready(function () {

    var userData=JSON.parse(localStorage.getItem('userData'));

    $('.section .asset').removeClass('section asset');

    $(document).on('click', '.table-content-asset-admin-view', function (e) {
        var assetId = e.target.closest('.table-content-asset-admin-view').dataset.value;
        $.ajax({
            type: 'GET',
            url: path + '/api/assets/' + assetId,
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers:{
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                if (data.code == statusSuccess) {
                    localStorage.setItem('sku', assetId);
                    window.location.href = '../../views/asset/assetDetail.html';
                } else {
                    alert('error');
                }
            },
            error: function (data) {
                alert('failed load data');
            }
        });
    });

    $(document).on('click', '.table-content-asset-admin-edit', function (e) {
        var assetId = e.target.closest('.table-content-asset-admin-edit').dataset.value;
        localStorage.setItem('sku', assetId);
        window.location.href = '../../views/asset/assetEdit.html';
    });

    var currPage = 1;
    var totalPage;
    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-asset-admin').empty();
        loadAssetList(currPage);
    });

    loadAssetList(currPage);

    function listData(data, currPage) {
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        $('#total-asset-text').text(data.paging.totalRecords);

        for (var index = 0; index < data.value.availableAssets.length; index++) {
            var markup =
                `
            <div class='table-content-asset-admin-list'>
            <input type='checkbox' class='table-content-asset-admin-checkbox' name='asset-checkbox-delete' value='${data.value.availableAssets[index].sku}'>              
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
            <div class='table-content table-content-asset-icon table-content-asset-admin-edit' data-value=${data.value.availableAssets[index].sku}>
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


            if (localData != null && localData != '[]') {
                for (var order = 0; order < localArray.length; order++) {
                    if (data.value.availableAssets[index].sku == localArray[order]) {
                        $('input[value=' + localArray[order] + ']').attr('checked', true);
                    }
                }
            }

        }

        totalPage = data.paging.totalPage;
        $('.pagination').innerHTML = createPagination(totalPage, currPage);
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
                headers:{
                    "X-Auth-Token":userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        } else {
            let keyword = url.substr(index + 14, url.length - 1);
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8085/oasis/api/assets/list?query=' + keyword + '&page=1&sort=A-name',
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers:{
                    "X-Auth-Token":userData.authToken
                },
                success: function (data) {
                    if (data.code === statusSuccess) {
                        listData(data);
                        document.querySelector('.pagination').innerHTML = createPagination(totalPage, 1);
                    } else {
                        console.log('error');
                    }
                },
                error: function (data) {
                    console.log('failed at search');
                }
            });
        }
    }

    
    $('.btn__search').click(function(){
        var keyword=$('.search__input').val();
        window.location.href = '../../views/asset/asset.html?search__asset='+keyword;
    });
    
    function createPagination(totalPage, currPage) {
        let str = '<ul>';
        let activate;
        let pageCutLow = currPage - 1;
        let pageCutHigh = currPage + 1;
        
        if (currPage > 1) {
            str += `<li class='page-item previous no' data-goto=${currPage-1}><a>Previous</a></li>`;
        }
        
        if (totalPage < 6) {
            for (let p = 1; p <= totalPage; p++) {
                if(currPage==p){
                    activate='activate';
                }else{
                    activate='no';
                }
                
                str += `<li class='${activate}' data-goto=${p}><a>${p}</a></li>`;
            }
        }
        
        else {
            if (currPage > 2) {
            str += '<li class="no page-item" data-goto=1><a>1</a></li>';
                if (currPage > 3) {
                    str += `<li class='out-of-range' data-goto=${currPage-2}><a>...</a></li>`;
                }
            }
    
            if (currPage === 1) {
                pageCutHigh += 2;
            } else if (currPage === 2) {
                pageCutHigh += 1;
            }
        
            if (currPage === totalPage) {
                pageCutLow -= 2;
            } else if (currPage === totalPage-1) {
                pageCutLow -= 1;
            }
            
            for (let p = pageCutLow; p <= pageCutHigh; p++) {
            if (p === 0) {
                p += 1;
            }
            if (p > totalPage) {
                continue
            }
            activate = currPage == p ? 'activate' : 'no';
            str += `<li class='page-item ${activate}' data-goto=${p}><a>${p}</a></li>`;
            }
        
            if (currPage < totalPage-1) {
                if (currPage < totalPage-2) {
                    str += `<li class='out-of-range' data-goto=${currPage+2}><a>...</a></li>`;
                }
                
                str += `<li class='page-item no' data-goto=${totalPage}><a>${totalPage}</a></li>`;
            }
        }
        
        if (currPage < totalPage) {
            str += `<li class='page-item next no' data-goto=${currPage+1}><a>Next</a></li>`;
        }
        str += '</ul>';
        
        document.querySelector('.pagination').innerHTML = str;
        return str;
    }


    $('.btn-asset-list-add').hide();

    $('.cancel__text').click(function () {
        window.location.href = '../asset/asset.html';
        localStorage.setItem('selectedAsset', '[]');
    });

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
        var inputs = document.querySelectorAll('.table-content-asset-admin-checkbox');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
        }
        $('.table-content-asset-admin-checkbox').trigger('change');
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

    $(document).on('change', '.table-content-asset-admin-checkbox', function () {
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


    $('.btn-asset-list-delete').click(function () {
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);

        var deleteData = {
            skus: localArray
        }
        console.log(deleteData);

        // $('.popup__part').load('../../components/popup/popup.html');
        // $('.popup').css('display','block');

        $.ajax({
            type: 'DELETE',
            url: path + '/api/assets/delete',
            data: JSON.stringify(deleteData),
            contentType: 'application/json',
            dataType: 'json',
            headers:{
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                if (data.code === 200) {
                    alert('delete');
                    window.location.href = '../../views/asset/asset.html';
                } else {
                    alert('error');
                }
            },
            error: function (data) {
                console.log('failed at delete');
            }
        });
        localStorage.removeItem('selectedAsset');
    });


 
});