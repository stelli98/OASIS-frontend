import {
    statusSuccess,
    statusNotAuthenticated,
    path,
    dobFormatter
} from '../base.js';
import * as validate from '../validation.js';

$(document).ready(function () {

    $('.section .employee').removeClass('section employee');

    var selectedUser = localStorage.getItem('selectedUser');
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').addClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });

    $.ajax({
        type: 'GET',
        url: path + '/api/employees/' + selectedUser,
        contentType: 'application/octet-stream',
        dataType: 'json',
        headers: {
            "X-Auth-Token": userData.authToken
        },
        success: function (data) {
            if (data.code == statusSuccess) {
                $('.employee__edit__name > input:text').val(data.value.name);
                $('#form__employee__dob').val(dobFormatter(data.value.dob));
                $('.employee__edit__job > input:text').val(data.value.jobTitle);
                $('.employee__edit__division > input:text').val(data.value.division);
                var textHtmlDivision = data.value.division + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
                $('#form__employee__division').html(textHtmlDivision);
                var textHtmlSupervisor = data.value.supervisor.username + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
                $('#form__employee__supervisor').html(textHtmlSupervisor);
                $('.employee__edit__location > input:text').val(data.value.location);
                $('.employee__edit__phone > input:text').val(data.value.phone);
                $('.employee__preview').css('background-image', 'url(' + data.value.photo + ')');
                printSavedSupervisor(data.value.division);
            }
        },
        error: function (data) {
            if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                window.location.href='../../../../';
            }
        }
    });

    function printSavedSupervisor(chosenDivision) {
        $.ajax({
            type: 'GET',
            url: path + '/api/employees/usernames?username=' + selectedUser + '&division=' + chosenDivision,
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                if (data.length > 0) {
                    $('.employee__list__supervisor').empty();
                    for (var index = 0; index < data.length; index++) {
                        var markup = `<option class='option' value='${data[index]}'>${data[index]}</option>`;
                        document.querySelector('.employee__list__supervisor').insertAdjacentHTML('beforeend', markup);
                    }
                }
                $('.employee__edit__supervisor').fadeIn();
            },
            error: function (data) {
                if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
                }
            }
        });
    }

    $('.employee__list__supervisor').hide();
    $('.employee__choose__supervisor').click(function () {
        $('.employee__list__supervisor').toggle();
    });

    $('.employee__list__division').hide();
    $('.employee__choose__division').click(function () {
        $('.employee__list__division').toggle();
    });

    $(document).on('click', '.employee__list__division option', function (e) {
        $('.employee__edit__supervisor').hide();
        var selectedDivision = $(this).html();
        var textHtml = selectedDivision + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
        $('#form__employee__division').html(textHtml);
        $('.employee__list__division').toggle();

        $.ajax({
            type: 'GET',
            url: path + '/api/employees/usernames?username=' + selectedUser + '&division=' + selectedDivision,
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                $('.employee__list__supervisor').empty();
                for (var index = 0; index < data.length; index++) {
                    var markup = `<option class='option' value='${data[index]}'>${data[index]}</option>`;
                    document.querySelector('.employee__list__supervisor').insertAdjacentHTML('beforeend', markup);
                }
                $('.employee__edit__supervisor').fadeIn();
                var textHtml = '-select superior- <svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
                $('#form__employee__supervisor').html(textHtml);
            },
            error: function (data) {
                if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
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

    $('#edit__employee__btn').click(function () {
        var dob = $('#form__employee__dob').val();
        var name = $('#form__employee__name').val();
        var phone = $('#form__employee__phone').val();
        var jobTitle = $('#form__employee__job').val();
        var division = $('#form__employee__division').text();
        var location = $('#form__employee__location').val();
        var supervisorUsername = $('#form__employee__supervisor').text();

        $('#input__error__employeeName').text(validate.isAlphabet(name));
        $('#input__error__dob').text(validate.isDobEmpty(dob));
        $('#input__error__phone').text(validate.isPhoneNumber(phone));
        $('#input__error__jobTitle').text(validate.isAlphabet(jobTitle));

        $('#input__error__division').text(validate.isSelectedDivision(division));
        $('#input__error__location').text(validate.isAlphabetNumeric(location));
        $("#input__error__supervisor").text(validate.isSelectedSupervisor(supervisorUsername));

        var employeedata = {
            'employee': {
                'username': selectedUser,
                'name': name,
                'dob': dob,
                'phone': phone,
                'location': location,
                'jobTitle': jobTitle,
                'division': division,
                'supervisorUsername': supervisorUsername
            }
        }

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
                cache: false,
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function () {
                    window.location.href = '../../views/employee/employee.html';
                },
                error: function (data) {
                    if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });

        }



    });

});