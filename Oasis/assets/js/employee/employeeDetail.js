import {
    statusSuccess,
    path
} from '../base.js';

$(document).ready(function () { 

    
    var selectedUser = localStorage.getItem('selectedUser');
    var userData=JSON.parse(localStorage.getItem('userData'));

    $('.section .employee').removeClass('section employee');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
    $('.navbar__part').load('../../components/navbar/navbar.html');
    $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
    $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
    $('.sidebar__icon__employee,.sidebar__text__employee').addClass('active');
    $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });
    

    $('.section .employee').removeClass('section employee');


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

            } else {
                console.log('error');
            }
        },
        error: function (data) {
            alert('failed load data');
        }
    });

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
        $.ajax({
            type: 'DELETE',
            url: path + '/api/employees/delete?target='+selectedUser,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                "X-Auth-Token":userData.authToken
            },
            success: function (data) {
                if (data.code == statusSuccess) {
                    window.location.href = '../../views/employee/employee.html';
                }
            },
            error: function (data) {
                if (data.responseJSON.code == 401) {
                    changeToNewSupervisor();
                }
                alert('failed load data');
            }
        });
    });

    function changeToNewSupervisor() {
        $('.popup__part').load('../../../components/popup/popupChangeSupervisor.html');
        $('.popup').css('display', 'block');
       
        $(document).on('click', '.employee__choose__supervisor', function () {
            $('.employee__list__supervisor').toggle();
        })

        $(document).on('click', '.employee__list__supervisor option', function (e) {
            var selectedSuperior = $(this).html();
            var textHtml = selectedSuperior + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
            $('#form__employee__supervisor').html(textHtml);
            $('.employee__list__supervisor').toggle();
        });


    }

    $(document).on('click', '.btn-confirmation-change', function () {
        assignNewSuperior();
    });

    function assignNewSuperior() {
        var selectedUser = localStorage.getItem('selectedUser');
        var deleteData = {
            oldSupervisorUsername: selectedUser,
            newSupervisorUsername: $('#form__employee__supervisor').text(),
        }
        console.log(deleteData);

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
                console.log(data);
                if (data.code == statusSuccess) {
                    deleteAnEmployee();
                    window.location.href = '../../views/employee/employee.html';
                } else if (data.code == 401) {
                    console.log('error');
                }
            },
            error: function (data) {
                alert('failed load data');
            }
        });
    }
});