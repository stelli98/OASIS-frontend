import {
    statusSuccess,
    path
} from '../base.js';

$(document).ready(function () {
    var currPage = 1;
    var totalPage;
    
    function listData(data, currPage) {
        $('#total-asset-text').text(data.paging.totalRecords);
        for (var index = 0; index < data.value.requestedAssets.length; index++) {
            var markup =
                `
                <div class='asset__request__content'>
                    <div class='asset__request__content__left'>
                        <div class='asset__request__content__pic' style='background-image:url(${data.value.requestedAssets[index].images[0]})'></div>
                    </div>
                    <div class='asset__request__content__middle'>
                            <h2 class='title__small asset__request__content__name'>${data.value.requestedAssets[index].name}</h2>
                            <div class='asset__request__content__qty'>
                                 <h2 class='title__small asset__request__content__qty__title'>Qty</h2>
                                 <input type='number' class='asset__request__content__qty__input' min='1' max='${data.value.requestedAssets[index].quantity}'></input>
                            </div>
                    </div>
                    <div class='asset__request__content__right'>
                        <div class='asset__request__content__note'>
                            <h2 class='title__small'>Request Notes</h2>
                            <textarea class='asset__request__content__text' cols='60' rows='5'></textarea>
                        </div>
                    </div>
                    <div class='asset__request__content__delete'>
                        <a href='#' class='action-button-blue'>    
                            <svg class='action-icon action-icon-blue'>
                                <use xlink:href='../../assets/img/sprite.svg#icon-garbage'></use>
                            </svg>
                        </a>
                    </div>
                </div>
            `
            document.querySelector('.asset__request__list').insertAdjacentHTML('beforeend', markup);
        }

        totalPage = data.paging.totalPage;

        // $('.pagination').innerHTML = createPagination(totalPage, currPage);

    }

    function loadAssetList(currPage) {
        
        var localData = localStorage.getItem('selectedAsset');
        var localArray = $.parseJSON(localData);        

        var requestedData={
            'skus':localArray,
            'page':1,
        }

        console.log(requestedData);

            $.ajax({
                type: 'POST',
                url: path + '/api/requests/list/requested-assets',
                data: JSON.stringify(requestedData),
                contentType: 'application/json',
                dataType: 'json',
                success: function (data) {
                    listData(data,currPage);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
    }

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage=parseInt( e.target.closest('.pagination ul li').dataset.goto,10);  
        $('.asset__request__list').empty();
        loadAssetList(currPage);
    })


    loadAssetList(currPage);
});