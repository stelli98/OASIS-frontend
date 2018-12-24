import {statusSuccess,path,elements} from '../base.js';

$(document).ready(function () {

    var currPage = 1;
    var totalPage;
    
    $('.section .asset').removeClass('section asset');
    // elements.btnAssetListAdd.hide();
    // elements.btnAssetListDelete.hide();
  

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').addClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
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
        // $('.asset__view').load('../../views/asset/assetRequest.html');
        window.location.href = '../../views/asset/assetRequest.html';
        // window.location.href = '../../views/asset/assetRequestDetail.html';
    });

    $(document).on('click', '.table-content-asset-admin-view', function (e) {
        var assetId = e.target.closest('.table-content-asset-admin-view').dataset.value;
        localStorage.setItem('sku', assetId);
        $('.asset__view').load('../../views/asset/assetDetail.html');
    });

    $(document).on('click', '.table-content-asset-admin-edit', function (e) {
        var assetId = e.target.closest('.table-content-asset-admin-edit').dataset.value;
        localStorage.setItem('sku', assetId);
        window.location.href='../../views/asset/assetEdit.html'
    });

    

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage=parseInt( e.target.closest('.pagination ul li').dataset.goto,10);  
        $('.table-content-asset-admin').empty();
        loadAssetList(currPage);
    })


    function listData(data,currPage) {
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
        
        totalPage=data.paging.totalPage; 
        
        $('.pagination').innerHTML = createPagination(totalPage, currPage);
            
    }
  
    function loadAssetList(currPage) {
        if(window.location.href.indexOf('#')!=-1){
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
                success: function (data) {
                    listData(data,currPage);
                    // showExclusiveButton(data);   
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
                success: function (data) {
                    if (data.code === statusSuccess) {
                        listData(data);
                        showExclusiveButton(data);
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
   
    // function showExclusiveButton(data){
    //         if(data.components.btnAssetListDelete==true){
    //             elements.btnAssetListDelete.show();
    //         }else{
    //             $('.asset__upper').css('justify-content','flex-start');
    //         } 
            
    //         if(data.components.btnAssetListAdd==true){
    //             elements.btnAssetListAdd.show();
    //         }
    
    //         if(data.components.btnAssetTableEdit==true){
    //             $('.table-content-asset-admin-edit').css('display','block');
    //         }
            
    // }
    
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

    loadAssetList(currPage);

});





