import { statusSuccess, path } from '../base.js';

$(document).ready(function () {

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').addClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });

    $('.section .asset').removeClass('section asset');

    var sku = localStorage.getItem('sku');

    $.ajax({
        type: 'GET',
        url: path + '/api/assets/' + sku,
        contentType: 'application/octet-stream',
        dataType: 'json',
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

            } else {
                console.log('error');
            }
        },
        error: function (data) {
            alert('failed load data');
        }
    });

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
        var username=localStorage.getItem('username');
        var deleteData = {
            username: username,
            skus: [sku]
        }
        console.log(deleteData);

        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8085/oasis/api/assets/delete',
            data: JSON.stringify(deleteData),
            contentType: 'application/json',
            dataType: 'json',
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
    });

    $('.btn-asset-detail-print').click(function () {
        window.location.href = path+'/api/assets/' + sku + '/pdf';
    });

});