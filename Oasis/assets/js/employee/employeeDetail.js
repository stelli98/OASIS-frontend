import {
    statusSuccess,
    statusNotAuthenticated,
    path
} from '../base.js';

$(document).ready(function () { 

    var selectedUser = localStorage.getItem('selectedUser');
    var userData=JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }

    $('.section .employee').removeClass('section employee');

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
            "X-Auth-Token":userData.authToken
        },
        success: function (data) {
            if (data.code == statusSuccess) {
                $('.text-employee__username').text(data.value.username);
                $('.text-employee__name').text(data.value.name);
                $('.text-employee__dob').text(data.value.dob);
                $('.text-employee__location').text(data.value.location);
                $('.text-employee__job').text(data.value.jobTitle);
                $('.text-employee__division').text(data.value.division);
                $('.text-employee__phone').text(data.value.phone);
                $('.text-employee__supervisor').text(data.value.supervisor.name);

                if (data.value.photo[0].length == 0) {
                    $('.employee__preview').css('background-image', 'url(../../assets/img/assets/noimage.jpg)');
                } else {
                    $('.employee__preview').css('background-image', 'url(' + data.value.photo + ')');
                }
                showExclusiveButton(data);
                localStorage.setItem('savedDivision',data.value.division);
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
        if(data.components.btnEmployeeDetailEditDelete==false){
            $('.employee__detail__action__btn__upper').hide();
        }
    }

    $('#uploadEmployeeImage').change(function () {
        if (this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.employee__preview').css('background-image', 'url(' + e.target.result + ')');
                localStorage.setItem('file', e.target.result);
                $('.employee__preview').hide();
                $('.employee__preview').fadeIn(650);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    $('.btn-employee-detail-edit').click(function () {
        window.location.href = '../../views/employee/employeeEdit.html';
    });

    $('.btn-employee-detail-delete').click(function () {
        $('.popup__part').load('../../components/popup/popupDeleteConfirmation.html');
        $('.popup').css('display','block');

        $(document).on('click','.btn-confirmation-confirm',function(){
            deleteAnEmployee();
        });
    });

    function deleteAnEmployee() {
        var selectedUser=localStorage.getItem('selectedUser');
         $.ajax({
                type: 'DELETE',
                url: path + '/api/employees/delete?target='+selectedUser,
                contentType: 'application/octet-stream',
                headers: {
                    "X-Auth-Token":userData.authToken
                },
                success: function (data) {
                    if (data.code == statusSuccess) {
                        window.location.href = '../../views/employee/employee.html';
                        localStorage.removeItem('selectedUser');
                    }
                },
                error: function (data) {
                    if (data.responseJSON.code == 401) {
                        changeToNewSupervisor();
                    }
                }
        });
    }

    function changeToNewSupervisor() {
        $('.popup__part').load('../../../components/popup/popupChangeSupervisor.html');
        $('.popup').css('display', 'block');
       
        $(document).on('click', '.employee__choose__supervisor', function () {
            $('.employee__list__supervisor').toggle();
        });

        var savedDivision=localStorage.getItem('savedDivision');
         $.ajax({
            type: 'GET',
            url: 'http://localhost:8085/oasis/api/employees/usernames?division=' + savedDivision+'&username='+selectedUser,
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                for (var index = 0; index < data.length; index++) {
                    var markup = `<option class='option-popup' value='${data[index]}'>${data[index]}</option>`;
                    document.querySelector('.employee__list__supervisor').insertAdjacentHTML('beforeend', markup);
                }
            },
            error: function (data) {
            }
        });

        $(document).on('click', '.employee__list__supervisor option', function (e) {
            var selectedSuperior = $(this).html();
            var textHtml = selectedSuperior + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
            $('#form__employee__supervisor').html(textHtml);
            $('.employee__list__supervisor').toggle();
        });

        $(document).on('click', '.btn-confirmation-change', function () {
            var selectedUser = localStorage.getItem('selectedUser');
            var deleteData = {
                oldSupervisorUsername: selectedUser,
                newSupervisorUsername: $('#form__employee__supervisor').text(),
            }
    
            $.ajax({
                type: 'POST',
                url: path + '/api/employees/delete/change-supervisor',
                data: JSON.stringify(deleteData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token":userData.authToken
                },
                success: function (data) {
                    if (data.code == statusSuccess) {
                        deleteAnEmployee();
                        window.location.href = '../../views/employee/employee.html';
                    }
                },
                error: function (data) {
                    if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        });

    }

    $(document).on('click', '.popup__close__button , .btn-confirmation-cancel', function () {
        $('.popup').hide();
        localStorage.removeItem('selectedUser');
        window.location.href = '../../views/employee/employee.html';
    });

});