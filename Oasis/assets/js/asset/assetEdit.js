import {
    statusSuccess,
    path,
    statusNotAuthenticated
} from '../base.js';
import * as validate from '../validation.js';

$(document).ready(function () {

    var sku = localStorage.getItem('sku');
    var userData = JSON.parse(localStorage.getItem('userData'));
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
    });

    $('#uploadAssetImage').change(function (e) {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.asset__preview').css('background-image', 'url(' + e.target.result + ')');
                $('.asset__preview').hide();
                $('.asset__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
            $('#input__error__assetImage').text(validate.isImageExtension(e.target.files[0].name));
        }
    });

    $.ajax({
        type: 'GET',
        url: path + '/api/assets/' + sku,
        contentType: 'application/octet-stream',
        dataType: 'json',
        headers: {
            "X-Auth-Token": userData.authToken
        },
        success: function (data) {
            if (data.code == statusSuccess) {
                $('.asset__edit__name > input:text').val(data.value.name);
                $('.asset__edit__brand > input:text').val(data.value.brand);
                $('.asset__edit__type > input:text').val(data.value.type);
                $('.asset__edit__location > input:text').val(data.value.location);
                $('.asset__edit__qty > input[type="number"]').val(data.value.stock);
                $('.asset__edit__price > input[type="number"]').val(data.value.price);
                $('#asset__edit__option__expendable').val(data.value.expendable);
                $('.asset__preview').css('background-image', 'url(' + data.value.images[0] + ')');
            }
        },
        error: function (data) {
            if (data.responseJSON.value.errorCode == statusNotAuthenticated || authToken==null) {
                window.location.href = '../../../../';
            }
        }
    });

    $('#edit__asset-btn').click(function () {
        var assetName = $('#form__asset__name').val();
        var assetLocation = $('#form__asset__location').val();
        var assetBrand = $('#form__asset__brand').val();
        var assetType = $('#form__asset__type').val();
        var assetQty = $('#form__asset__qty').val();
        var assetPrice = parseInt($('#form__asset__price').val(), 10);
        var assetExpendable = parseFloat($('#form__asset__expendable').val());
        if (assetExpendable == 'Yes') {
            assetExpendable = true;
        } else {
            assetExpendable = false;
        }

        $('#input__error__assetName').text(validate.isAlphabetNumeric(assetName));
        $('#input__error__location').text(validate.isAlphabetNumeric(assetLocation));
        $('#input__error__brand').text(validate.isAlphabetNumeric(assetBrand));
        $('#input__error__type').text(validate.isAlphabetNumeric(assetType));
        $('#input__error__qty').text(validate.isNumber(assetQty));
        $('#input__error__price').text(validate.isNominal(assetPrice));

        var assetdata = {
            'asset': {
                'sku': sku,
                'name': assetName,
                'location': assetLocation,
                'brand': assetBrand,
                'type': assetType,
                'quantity': assetQty,
                'price': assetPrice,
                'expendable': assetExpendable
            }
        }

        var form = document.getElementById('uploadAssetImageForm')[0];
        var formData = new FormData(form);

        formData.append('images', form.files[0]);
        formData.append('data', JSON.stringify(assetdata));

        if ($('#input__error__assetName').text() == "" &&
            $('#input__error__location').text() == "" &&
            $('#input__error__brand').text() == "" &&
            $('#input__error__type').text() == "" &&
            $('#input__error__quantity').text() == "" &&
            $('#input__error__price').text() == "" &&
            $('#input__error__assetImage').text() == "") {

            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: path + '/api/assets/save',
                data: formData,
                processData: false,
                contentType: false,
                cache: false,
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function () {
                    window.location.href = '../../views/asset/asset.html';
                },
                error: function (data) {
                    if (data.responseJSON.value.errorCode == statusNotAuthenticated || authToken==null) {
                        window.location.href = '../../../../';
                    }
                }
            });
        }
    });
});