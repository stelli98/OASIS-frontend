import {
    statusSuccess,
    statusNotFound,
    statusNotAuthenticated,
    path,
    elements,
    createPagination
} from '../base.js';

$(document).ready(function () {

    var currPage = 1;
    var totalPage;
    var userData = JSON.parse(localStorage.getItem('userData'));
    if(userData==null){
        window.location.href='../../../../';
    }


    loadAssetList(currPage);

    $('.section .employee').removeClass('section employee');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').addClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });
    
    function listData(data, currPage) {
        for (var index = 0; index < data.value.employees.length; index++) {

            if (data.value.employees[index].supervisor == null) {
                var empty = '-';
            } else {
                empty = data.value.employees[index].supervisor.name;
            }

            var markup =
                `
            <div class='table-content-employee-admin-list'>                
            <div class='table-content table-content-employee-admin-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
            <div class='table-content table-content-employee-admin-photo'>
                <img src='${data.value.employees[index].photo}' alt='photo' class='user__pic'>
            </div>
            <div class='table-content table-content-employee-admin-name'>${data.value.employees[index].name}</div>
            <div class='table-content table-content-employee-admin-job'>${data.value.employees[index].jobTitle}</div>
            <div class='table-content table-content-employee-admin-location'>${data.value.employees[index].location}</div>
            <div class='table-content table-content-employee-admin-supervisor'>${empty}</div>                                       
            <div class='table-content table-content-employee-admin-icon table-content-employee-admin-view' data-value=${data.value.employees[index].username}>
                    <a href='#' class='action-button-blue'>    
                        <svg class='action-icon action-icon-blue'>
                            <use xlink:href='../../assets/img/sprite.svg#icon-binoculars'></use>
                        </svg>
                    </a>
            </div>
            <div class='table-content table-content-employee-admin-icon table-content-employee-admin-edit' data-value=${data.value.employees[index].username}>
                    <a href='#' id='action-button-blue'>    
                        <svg class='action-icon action-icon-blue'>
                            <use xlink:href='../../assets/img/sprite.svg#icon-pencil'></use>
                         </svg>
                    </a>
            </div>
            <div class='table-content table-content-employee-admin-icon table-content-employee-admin-delete' data-value=${data.value.employees[index].username} data-division=${data.value.employees[index].division}>
                    <a href='#' id='action-button-blue'>    
                        <svg class='action-icon action-icon-blue'>
                            <use xlink:href='../../assets/img/sprite.svg#icon-garbage'></use>
                         </svg>
                    </a>
            </div>
            </div> 
            </div> 
            `
            document.querySelector('.table-content-employee-admin').insertAdjacentHTML('beforeend', markup);
        }

        totalPage = data.paging.totalPage;
        $('.pagination').html(createPagination(totalPage, currPage));
    }

    function loadAssetList(currPage) {
        if (window.location.href.indexOf('#') != -1) {
            window.location.href = '../../views/employee/employee.html';
        }
        const url = window.location.href;
        const index = url.indexOf('search__employee');
        if (index === -1) {
            $.ajax({
                type: 'GET',
                url: path + '/api/employees/list?&page=' + currPage,
                contentType: 'application/octet-stream',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                    showExclusiveButton(data);
                },
                error: function (data) {
                    showExclusiveButton(JSON.parse(data.responseText));
                    if (data.responseJSON.code == statusNotFound) {
                        $('.employee__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        } else {
            let keyword = url.substr(index + 17, url.length - 1);
            $.ajax({
                type: 'GET',
                url: path + '/api/employees/list?query=' + keyword + '&page=' + currPage,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code === statusSuccess) {
                        listData(data);
                        showExclusiveButton(data);
                    }
                },
                error: function (data) {
                    showExclusiveButton(JSON.parse(data.responseText));
                    if (data.responseJSON.code == statusNotFound) {
                        $('.employee__footer').load('../../components/errorPage/errorDataNotFoundPage.html');
                    }else if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                        window.location.href='../../../../';
                    }
                }
            });
        }
    }

    function showExclusiveButton(data) {
        if (data.components.btnEmployeeAdd == false) {
            elements.btnEmployeeAdd.hide();
        }
        if (data.components.sectionEmployeeUpper == true) {
            elements.sectionEmployeeUpper.css('justify-content', 'flex-start');
        }
        if (data.components.btnEmployeeDelete == false) {
            $('.table-content-employee-admin-delete').hide();
        }

        if (data.components.btnEmployeeEdit == false) {
            $('.table-content-employee-admin-edit').hide();
        }
    }

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-employee-admin').empty();
        loadAssetList(currPage);
    })

    $('.btn-employee-list-add').click(function () {
        window.location.href='../../views/employee/employeeAdd.html';
    });

    $(document).on('click', '.table-content-employee-admin-view', function (e) {
        var selectedUser = e.target.closest('.table-content-employee-admin-view').dataset.value;
        localStorage.setItem('selectedUser', selectedUser);
        window.location.href = '../../views/employee/employeeDetail.html';
    });

    $(document).on('click', '.table-content-employee-admin-edit', function (e) {
        var selectedUser = e.target.closest('.table-content-employee-admin-edit').dataset.value;
        localStorage.setItem('selectedUser', selectedUser);
        window.location.href = '../../views/employee/employeeEdit.html';
    });

    $(document).on('click', '.table-content-employee-admin-delete', function (e) {
        var selectedUser = e.target.closest('.table-content-employee-admin-delete').dataset.value;
        var savedDivision = e.target.closest('.table-content-employee-admin-delete').dataset.division;
        localStorage.setItem('selectedUser', selectedUser);
        localStorage.setItem('savedDivision', savedDivision);

        $('.popup__part').load('../../components/popup/popupDeleteConfirmation.html');
        $('.popup').css('display', 'block');

        $(document).on('click', '.btn-confirmation-confirm', function () {
            deleteAnEmployee();
        });
    });

    $(document).on('click', '.popup__close__button , .btn-confirmation-cancel', function () {
        $('.popup').hide();
        localStorage.removeItem('selectedUser');
        localStorage.removeItem('savedDivision');
        window.location.href = '../../views/employee/employee.html';
    });

    $('.btn__search').click(function () {
        var keyword = $('.search__input').val();
        window.location.href = '../../views/employee/employee.html?search__employee=' + keyword;
    });

    function deleteAnEmployee() {
        var selectedUser = localStorage.getItem('selectedUser');
        var savedDivision = localStorage.getItem('savedDivision');
        $.ajax({
            type: 'DELETE',
            url: path + '/api/employees/delete?target=' + selectedUser,
            contentType: 'application/octet-stream',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                if (data.code == statusSuccess) {
                    window.location.href = '../../views/employee/employee.html';
                    localStorage.removeItem('selectedUser');
                    localStorage.removeItem('savedDivision');
                }
            },
            error: function (data) {
                if (data.responseJSON.code == 401) {
                    changeToNewSupervisor(selectedUser, savedDivision);
                }
            }
        });
    }

    function changeToNewSupervisor(selectedUser, savedDivision) {
        $('.popup__part').load('../../../components/popup/popupChangeSupervisor.html');
        $('.popup').css('display', 'block');

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8085/oasis/api/employees/usernames?username=' + selectedUser + '&division=' + savedDivision,
            contentType: 'application/octet-stream',
            dataType: 'json',
            headers: {
                "X-Auth-Token": userData.authToken
            },
            success: function (data) {
                for (var index = 0; index < data.length; index++) {
                    var markup = `<option class='option-popup' value='${data[index]}'>${data[index]}</option>`;
                    document.querySelector('.employee__list__supervisor').insertAdjacentHTML('beforeend', markup);
                }
            },
            error: function (data) {
                if(data.responseJSON.value.errorCode==statusNotAuthenticated || userData==null){                
                    window.location.href='../../../../';
                }
            }
        });

        $(document).on('click', '.employee__choose__supervisor', function () {
            $('.employee__list__supervisor').toggle();
        })

        $(document).on('click', '.employee__list__supervisor option', function (e) {
            var selectedSuperior = $(this).html();
            var textHtml = selectedSuperior + '<svg class="employee__choose__supervisor__btn"><use xlink:href="../../assets/img/sprite.svg#icon-drop-down-arrow"></use></svg>'
            $('#form__employee__supervisor').html(textHtml);
            $('.employee__list__supervisor').toggle();
        });

        $(document).on('click', '.btn-confirmation-change', function () {
            var selectedUser = localStorage.getItem('selectedUser');
            var newSupervisor=$('#form__employee__supervisor').text().split(" ");
            var deleteData = {
                oldSupervisorUsername: selectedUser,
                newSupervisorUsername: newSupervisor[0],
            }

            $.ajax({
                type: 'POST',
                url: path + '/api/employees/delete/change-supervisor',
                data: JSON.stringify(deleteData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    if (data.code == statusSuccess) {
                        deleteAnEmployee();
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
});