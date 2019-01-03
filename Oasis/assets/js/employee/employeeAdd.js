import {
    statusNotAuthenticated,
    path
} from "../base.js";
import * as validate from "../validation.js";

$(document).ready(function () {

    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null) {
        window.location.href = '../../../../';
    }

    $('.section .employee').removeClass('section employee');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').addClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });

    $('.employee__add__supervisor').hide();
    $('.employee__list__supervisor').hide();
    $('.employee__choose__supervisor').click(function () {
        $('.employee__list__supervisor').toggle();
    })

    $('.employee__list__division').hide();
    $('.employee__choose__division').click(function () {
        $('.employee__list__division').toggle();
    })

    $(document).on('click', '.employee__list__division option', function (e) {
        $('.employee__add__supervisor').hide();
        var selectedDivision = $(this).html();
        var textHtml = selectedDivision + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
        $('#form__employee__division').html(textHtml);
        $('.employee__list__division').toggle();

        $.ajax({
            type: 'GET',
            url: path + '/api/employees/usernames?division=' + selectedDivision,
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                $('.employee__list__supervisor').empty();
                var textHtml = '-select superior-<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
                $('#form__employee__supervisor').html(textHtml);

                for (var index = 0; index < data.length; index++) {
                    var markup = `<option class='option' value='${data[index]}'>${data[index]}</option>`;
                    document.querySelector('.employee__list__supervisor').insertAdjacentHTML('beforeend', markup);
                }

                $('.employee__add__supervisor').fadeIn();
            },
            error: function (data) {
                if (data.responseJSON.value.errorCode == userData == nullNotAuthenticated || userData == null) {
                    window.location.href = '../../../../';
                }
            }
        });


    });

    $(document).on('click', '.employee__list__supervisor option', function (e) {
        var selectedSuperior = $(this).html();
        var textHtml = selectedSuperior + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
        $('#form__employee__supervisor').html(textHtml);
        $('.employee__list__supervisor').toggle();
    });

    $('#uploadEmployeeImage').change(function (e) {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.employee__preview').css('background-image', 'url(' + e.target.result + ')');
                localStorage.setItem('file', e.target.result);
                $('.employee__preview').hide();
                $('.employee__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
            $('#input__error__employeePhoto').text(validate.isImageExtension(e.target.files[0].name));
        }
    });

    $('#add__employee__btn').click(function () {

        var dob = $('#form__employee__dob').val();
        var name = $('#form__employee__name').val();
        var phone = $('#form__employee__phone').val();
        var jobTitle = $('#form__employee__job').val();
        var division = $('#form__employee__division').text();
        var location = $('#form__employee__location').val();
        var supervisorUsername = $('#form__employee__supervisor').text().split(" ");

        $('#input__error__employeeName').text(validate.isAlphabet(name));
        $('#input__error__dob').text(validate.isDobEmpty(dob));
        $('#input__error__phone').text(validate.isPhoneNumber(phone));
        $('#input__error__jobTitle').text(validate.isAlphabet(jobTitle));
        $('#input__error__division').text(validate.isSelectedDivision(division));
        $('#input__error__location').text(validate.isAlphabetNumeric(location));
        $("#input__error__supervisor").text(validate.isSelectedSupervisor(supervisorUsername[0]));

        var employeedata = {
            'employee': {
                'username': null,
                'name': name,
                'dob': dob,
                'phone': phone,
                'location': location,
                'jobTitle': jobTitle,
                'division': division,
                'supervisorUsername': supervisorUsername[0]
            }
        }

        console.log(employeedata);

        var form = document.getElementById('uploadEmployeeImageForm')[0];
        var formData = new FormData(form);

        formData.append('photo', form.files[0]);
        formData.append('data', JSON.stringify(employeedata));

        if ($('#input__error__employeeName').text() == "" &&
            $('#input__error__dob').text() == "" &&
            $('#input__error__phone').text() == "" &&
            $('#input__error__jobTitle').text() == "" &&
            $('#input__error__division').text() == "" &&
            $('#input__error__location').text() == "") {

            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: path + '/api/employees/save',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    // $('.popup__part').load('../../../components/popup/popupNewRequestLoginData.html');

                    // var markup =
                    // `
                    //     <div class="popup__confirmation__message__username">Username : ${data.value.username}</div>
                    // `
                    // document.querySelector('.popup__confirmation__message-center').insertAdjacentHTML('afterbegin', markup);
                    $('#username__new').text(data.value.username);
                    $('.popup').css('display', 'block');;
                },
                error: function (data) {
                    if (data.responseJSON.value.errorCode == statusNotAuthenticated || userData == null) {
                        window.location.href = '../../../../';
                    }
                }
            });
        }


    });

    $(document).on('click', '.popup__close__button , .btn-confirmation-ok', function () {
        $('.popup').hide();
        window.location.href = '../../views/employee/employee.html';
    });


});