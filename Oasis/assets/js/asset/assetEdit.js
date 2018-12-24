import { statusSuccess, path } from '../base.js';

$(document).ready(function () {
    $('.section .asset').removeClass('section asset');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').addClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
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


    var sku = localStorage.getItem('sku');
    var username=localStorage.getItem('activeUser');


    $.ajax({
        type: 'GET',
        url: path + '/api/assets/' + sku,
        contentType: 'application/octet-stream',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            if (data.code == statusSuccess) {
                $('.asset__edit__name > input:text').val(data.value.name);
                $('.asset__edit__brand > input:text').val(data.value.brand);
                $('.asset__edit__type > input:text').val(data.value.type);
                $('.asset__edit__location > input:text').val(data.value.location);
                $('.asset__edit__qty > input[type="number"]').val(data.value.stock);
                $('.asset__edit__price > input[type="number"]').val(data.value.price);
                console.log(data.value.expendable);
                $('#asset__edit__option__expendable').val(data.value.expendable);
                $('.asset__preview').css('background-image', 'url(' + data.value.images[0] + ')');
            } else {
                console.log('error');
            }
        },
        error: function (data) {
            alert('failed load data');
        }
    });

    $('#edit__asset-btn').click(function () {
        var assetName = $('#form__asset__name').val();
        var assetLocation = $('#form__asset__location').val();
        var assetBrand = $('#form__asset__brand').val();
        var assetType = $('#form__asset__type').val();
        var assetQty = parseInt($('#form__asset__qty').val());
        var assetPrice = parseFloat($('#form__asset__price').val());
        var assetExpendable=$('#form__asset__expendable').val();
        if(assetExpendable=='Yes'){
            assetExpendable=true;
        }else{
            assetExpendable=false;
        }
    
        var assetdata = {
            'username': username,
            'asset': {
                'sku': sku,
                'name': assetName,
                'location': assetLocation,
                'brand': assetBrand,
                'type': assetType,
                'quantity': assetQty,
                'price': assetPrice,
                'expendable':assetExpendable
            }
        }
        
        
        var form = document.getElementById('uploadAssetImageForm')[0];
        var formData = new FormData(form);

        formData.append('photos', form.files[0]);
        formData.append('data', JSON.stringify(assetdata));
        console.log(assetdata);

        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: path + '/api/assets/save',
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                window.location.href = '../../views/asset/asset.html';
            },
            error: function (data) {
                alert(data.error);
            }
        });
    });
});