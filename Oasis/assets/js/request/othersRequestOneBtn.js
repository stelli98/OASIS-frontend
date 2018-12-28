import {
    statusSuccess,
    path,
    elements
} from '../base.js';

$(document).ready(function () {

    var currPage = 1;
    var userData = JSON.parse(localStorage.getItem('userData'));

    $('.sidebar__part').load('../../components/sidebar/sidebar.html', function () {
        $('.navbar__part').load('../../components/navbar/navbar.html');
        $('.sidebar__icon__dashboard,  .sidebar__text__dashboard').removeClass('active');
        $('.sidebar__icon__asset,.sidebar__text__asset').removeClass('active');
        $('.sidebar__icon__employee,.sidebar__text__employee').removeClass('active');
        $('.sidebar__text__request__my').removeClass('active');
        $('.sidebar__icon__request,.sidebar__text__request').addClass('active');
        $('.sidebar__text__request__other').addClass('active');
    });

    function loadAssetList(currPage) {
        const url = window.location.href;
        const index = url.indexOf('search__request');

        if (index == -1) {
            var currentTabName = url.substr(44, url.length - 49).toUpperCase();
            var currentTab = 'status=' + currentTabName + '&';
            if (currentTabName == 'ACCEPTED') {
                var actionBtn = 'deliver';
            } else if (currentTabName == 'DELIVERED') {
                var actionBtn = 'return';
            }
            
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/others?' + currentTab + 'page=' + currPage,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage, actionBtn);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        } else {
            let keyword = url.substr(index + 16, url.length - 1);
            var currentTabName = url.substr(44, url.length - keyword.length-66).toUpperCase();
            var currentTab = 'status=' + currentTabName + '&';

            if (currentTabName == 'ACCEPTED') {
                var actionBtn = 'deliver';
            } else if (currentTabName == 'DELIVERED') {
                var actionBtn = 'return';
            }
            
            $.ajax({
                type: 'GET',
                url: path + '/api/requests/list/others?' + currentTab + 'page=' + currPage +'&query='+keyword,
                contentType: 'application/octet-stream',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    listData(data, currPage, actionBtn);
                },
                error: function (data) {
                    alert('failed load data');
                }
            });
        }

    }

    $('.btn__search').click(function(){
        var keyword=$('.search__input').val();
        const url = window.location.href.split('.');
        var currentTabName = url[0].substr(44 , url[0].length-40);
        window.location.href = '../../views/request/othersRequest'+currentTabName+'.html?search__request='+keyword;
    });

    function listData(data, currPage, actionBtn) {
        for (var index = 0; index < data.value.requests.length; index++) {
            var markup =
                `
            <div class='table-content table-content-request-others-one-btn-no'>${(data.paging.pageNumber-1)*10+index+1}</div>
            <div class='table-content table-content-request-others-one-btn-photo'>
                <img src='${data.value.requests[index].employee.photo}' alt='photo' class='user__pic'>
            </div>
            <div class='table-content table-content-request-others-one-btn-employee'>${data.value.requests[index].employee.name}</div>
            <div class='table-content table-content-request-others-one-btn-asset'>${data.value.requests[index].asset.name}</div>
            <div class='table-content table-content-request-others-one-btn-qty'>${data.value.requests[index].asset.quantity}</div>
            <div class='table-content table-content-request-others-one-btn-notes'>${data.value.requests[index].request.note}</div>
            <div class='table-content table-content-request-others-one-btn-lastUpdate'>${data.value.requests[index].request.updatedDate}</div>
            <div class='table-content table-content-request-others-one-btn-actionBtn'
                id='table-content-request-others-one-btn-${actionBtn}' data-value=${data.value.requests[index].request.id}>
                <a href='#' id='action-button-accept'>
                    <svg class='action-icon action-icon-accept'>
                        <use xlink:href='../../assets/img/sprite.svg#icon-${actionBtn}'></use>
                    </svg>
                </a>
            </div>
            `
            document.querySelector('.table-content-request-others-one-btn').insertAdjacentHTML('beforeend', markup);
        }

        var totalPage = data.paging.totalPage;
        $('.pagination').innerHTML = createPagination(totalPage, currPage);

    }

    $(document).on('click', '.pagination ul li', function (e) {
        let currPage = parseInt(e.target.closest('.pagination ul li').dataset.goto, 10);
        $('.table-content-request-others-one-btn').empty();
        loadAssetList(currPage);
    })

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

    $(document).on('click', '#table-content-request-others-one-btn-deliver', function (e) {
        let selectedRequest = e.target.closest('#table-content-request-others-one-btn-deliver').dataset.value;
        $('.popup__part').load('../../../components/popup/popupTransactionNote.html');
        $('.popup').css('display', 'block');

        $(document).on('click', '.btn-confirmation-change-status', function () {
            console.log('btn click');
            var transactionNotes = $('.popup__confirmation__textarea').val();
            var selectedRequestedData = {
                '_id': selectedRequest,
                'sku': '',
                'quantity': 0,
                'status': 'Delivered',
                'requestNote': '',
                'transactionNote': transactionNotes,
            }
            var arraySelectedRequest = [selectedRequestedData];

            var acceptRequestedData = {
                'requests': arraySelectedRequest
            }
            $.ajax({
                type: 'POST',
                url: path + '/api/requests/save',
                data: JSON.stringify(acceptRequestedData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    console.log(data);
                    if (data.code == 201) {
                        console.log('sucess');
                        window.location.href = '../../views/request/othersRequestDelivered.html';
                    }
                },
                error: function (data) {
                    alert('failed load data');
                    console.log(data);
                }
            });

        });

    });

    $(document).on('click', '#table-content-request-others-one-btn-return', function (e) {
        let selectedRequest = e.target.closest('#table-content-request-others-one-btn-return').dataset.value;
        $('.popup__part').load('../../../components/popup/popupTransactionNote.html');
        $('.popup').css('display', 'block');

        $(document).on('click', '.btn-confirmation-change-status', function () {
            console.log('btn click');
            var transactionNotes = $('.popup__confirmation__textarea').val();
            var selectedRequestedData = {
                '_id': selectedRequest,
                'sku': '',
                'quantity': 0,
                'status': 'Returned',
                'requestNote': '',
                'transactionNote': transactionNotes,
            }
            var arraySelectedRequest = [selectedRequestedData];

            var acceptRequestedData = {
                'requests': arraySelectedRequest
            }
            $.ajax({
                type: 'POST',
                url: path + '/api/requests/save',
                data: JSON.stringify(acceptRequestedData),
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "X-Auth-Token": userData.authToken
                },
                success: function (data) {
                    console.log(data);
                    if (data.code == 201) {
                        console.log('sucess');
                        window.location.href = '../../views/request/othersRequestReturned.html';
                    }
                },
                error: function (data) {
                    alert('failed load data');
                    console.log(data);
                }
            });

        });

    });

    loadAssetList(currPage);

})