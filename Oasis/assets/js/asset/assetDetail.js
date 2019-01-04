import { statusSuccess, path, statusNotAuthenticated } from '../base.js';

$(document).ready(function () {

    var userData=JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }
    var sku = localStorage.getItem('sku');

    $('.section .asset').removeClass('section asset');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').addClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });

    $.ajax({
        type: 'GET',
        url: path + '/api/assets/' + sku,
        contentType: 'application/octet-stream',
        dataType: 'json',
        headers: {
            "X-Auth-Token":userData.authToken
        },
        success: function (data) {
            if (data.code == statusSuccess) {
                $('.text-asset__sku').text(data.value.sku);
                $('.text-asset__name').text(data.value.name);
                $('.text-asset__brand').text(data.value.brand);
                $('.text-asset__type').text(data.value.type);
                $('.text-asset__location').text(data.value.location);
                $('.text-asset__qty').text(data.value.stock);
                $('.text-asset__price').text(data.value.price);
                $('.text-asset__expendable').text(data.value.expendable);
                

                if(data.value.images[0].length==0){
                    $('.asset__preview').css('background-image', 'url(../../assets/img/assets/noimage.jpg)');
                }else{
                    $('.asset__preview').css('background-image', 'url(' + data.value.images[0] + ')');
                }

                showExclusiveButton(data);
            }
        },
        error: function (data) {
            showExclusiveButton(JSON.parse(data.responseText));
            if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                window.location.href='../../../../';
            }
        }
    });

    function showExclusiveButton(data){
        if(data.components.btnAssetDetailEditDelete==false){
            $('.asset__detail__action__btn__upper').css('display','none');
        }
    }

    $('#uploadAssetImage').change(function () {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.asset__preview').css('background-image', 'url(' + e.target.result + ')');
                $('.asset__preview').hide();
                $('.asset__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    $('.btn-asset-detail-edit').click(function () {
        localStorage.setItem('sku', sku);
        window.location.href = '../../views/asset/assetEdit.html'
    });

    $('.btn-asset-detail-delete').click(function () {
        var deleteData = {
            skus: [sku]
        }

        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8085/oasis/api/assets/delete',
            data: JSON.stringify(deleteData),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                "X-Auth-Token":userData.authToken
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
    });

    $('.btn-asset-detail-print').click(function () {
        window.location.href = path+'/api/assets/' + sku + '/pdf';
    });
    
});