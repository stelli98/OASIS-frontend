import {
    statusSuccess,
    path,
    elements
} from '../base.js';

$(document).ready(function () {

    var currPage = 1;
    var totalPage;
    var userData=JSON.parse(localStorage.getItem('userData'));

    loadAssetList(currPage);

    $('.section .employee').removeClass('section employee');

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').addClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').removeClass('active');
    });

    $('.btn-employee-list-add').click(function () {
        $('.employee__view').load('../../views/employee/employeeAdd.html');
    });

    $(document).on('click', '.table-content-employee-admin-view', function (e) {
        var selectedUser = e.target.closest('.table-content-employee-admin-view').dataset.value;
        localStorage.setItem('selectedUser', selectedUser);
        window.location.href='../../views/employee/employeeDetail.html';
    });

    $(document).on('click', '.table-content-employee-admin-edit', function (e) {
        var selectedUser = e.target.closest('.table-content-employee-admin-edit').dataset.value;
        localStorage.setItem('selectedUser', selectedUser);
        window.location.href = '../../views/employee/employeeEdit.html';
    });

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-employee-admin').empty();
        loadAssetList(currPage);
    })


    $(document).on('click', '.table-content-employee-admin-delete', function (e) {
        var selectedUser = e.target.closest('.table-content-employee-admin-delete').dataset.value;
        localStorage.setItem('selectedUser', selectedUser);
        deleteAnEmployee();
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
            <div class='table-content table-content-employee-admin-icon table-content-employee-admin-delete' data-value=${data.value.employees[index].username}>
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

        $('.pagination').innerHTML = createPagination(totalPage, currPage);

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
                    "X-Auth-Token":userData.authToken
                },
                success: function (data) {
                    listData(data, currPage);
                    // showExclusiveButton(data);   
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        } else {
            let keyword = url.substr(index + 17, url.length - 1);
            $.ajax({
                type: 'GET',
                url: path + '/api/employees/list?&query=' + keyword + '&page=1',
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token":userData.authToken
                },
                success: function (data) {
                    if (data.code === statusSuccess) {
                        listData(data);
                        // showExclusiveButton(data);
                        document.querySelector('.pagination').innerHTML = createPagination(totalPage, 1);
                    } else {
                        console.log('error');
                    }
                },
                error: function (data) {
                    console.log('failed at search');
                }
            });
        }
    }

    $('.btn__search').click(function(){
        var keyword=$('.search__input').val();
        window.location.href = '../../views/employee/employee.html?search__employee='+keyword;
    });

    // function showExclusiveButton(data){
    //         if(data.components.btnAssetListDelete==true){
    //             elements.btnAssetListDelete.show();
    //         }else{
    //             $('.asset__upper').css('justify-content','flex-start');
    //         } 

    //         if(data.components.btnAssetListAdd==true){
    //             elements.btnAssetListAdd.show();
    //         }

    //         if(data.components.btnAssetTableEdit==true){
    //             $('.table-content-asset-admin-edit').css('display','block');
    //         }

    // }

    function createPagination(totalPage, currPage) {
        let str = '<ul>';
        let activate;
        let pageCutLow = currPage - 1;
        let pageCutHigh = currPage + 1;

        if (currPage > 1) {
            str += `<li class='page-item previous no' data-goto=${currPage-1}><a>Previous</a></li>`;
        }

        if (totalPage < 6) {
            for (let p = 1; p <= totalPage; p++) {
                if (currPage == p) {
                    activate = 'activate';
                } else {
                    activate = 'no';
                }

                str += `<li class='${activate}' data-goto=${p}><a>${p}</a></li>`;
            }
        } else {
            if (currPage > 2) {
                str += '<li class="no page-item" data-goto=1><a>1</a></li>';
                if (currPage > 3) {
                    str += `<li class='out-of-range' data-goto=${currPage-2}><a>...</a></li>`;
                }
            }

            if (currPage === 1) {
                pageCutHigh += 2;
            } else if (currPage === 2) {
                pageCutHigh += 1;
            }

            if (currPage === totalPage) {
                pageCutLow -= 2;
            } else if (currPage === totalPage - 1) {
                pageCutLow -= 1;
            }

            for (let p = pageCutLow; p <= pageCutHigh; p++) {
                if (p === 0) {
                    p += 1;
                }
                if (p > totalPage) {
                    continue
                }
                activate = currPage == p ? 'activate' : 'no';
                str += `<li class='page-item ${activate}' data-goto=${p}><a>${p}</a></li>`;
            }

            if (currPage < totalPage - 1) {
                if (currPage < totalPage - 2) {
                    str += `<li class='out-of-range' data-goto=${currPage+2}><a>...</a></li>`;
                }

                str += `<li class='page-item no' data-goto=${totalPage}><a>${totalPage}</a></li>`;
            }
        }

        if (currPage < totalPage) {
            str += `<li class='page-item next no' data-goto=${currPage+1}><a>Next</a></li>`;
        }
        str += '</ul>';

        document.querySelector('.pagination').innerHTML = str;
        return str;
    }

    function deleteAnEmployee() {
        var selectedUser = localStorage.getItem('selectedUser');

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
                }
            },
            error: function (data) {
                if (data.responseJSON.code == 401) {
                    changeToNewSupervisor();
                }
                alert('failed load data');
            }
        });
    }

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