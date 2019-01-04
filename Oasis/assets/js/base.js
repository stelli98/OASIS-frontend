export const statusSuccess=200;
export const statusNotFound=404;
export const statusNotAuthenticated="UNAUTHENTICATED_USER";
export const path='http://localhost:8085/oasis';

export const elements={
    btnNewRequestChangeTab: $(".new-request__action__button"),
    sectionNewRequestOthers: $('.new-request__others'),
    btnAssetAddNew: $('.btn-asset-list-add'),
    btnAssetDeleteBulk: $('.btn-asset-list-delete'),
    btnAssetRequest: $('.btn-asset-list-request'),
    btnAssetEdit: $('.table-content-asset-admin-edit'),
    btnAssetDetailEditDelete: $('.asset__detail__action__btn__upper'), 
    btnEmployeeAdd:$('.btn-employee-list-add'),
    sectionEmployeeUpper:$('.employee__upper'),
    btnEmployeeDelete: $('.table-content-employee-admin-delete'),
    btnEmployeeEdit: $('.table-content-employee-admin-edit'), 
    btnEmployeeDetailEditDelete: $('.employee__detail__action__btn__upper'),
    sidebarRequestOther: $('.sidebar__content__request__other'),
    sidebarRequestMy: $('.sidebar__content__request__my'),
    btnDeliverReturnOtherRequest: $('.table-content-request-others-one-btn-actionBtn')
}

export function dateFormatter(date){
    var dateTimeArray= date.split(" ");
    var newDateFormat=dateTimeArray[0]+","+dateTimeArray[2]+" "+dateTimeArray[1]+" "+dateTimeArray[5]+"  "+dateTimeArray[3];
    return newDateFormat;
}

export function dobFormatter(date){
    var dobArray= date.split("-");
    var newDobFormat=dobArray[2]+"-"+dobArray[1]+"-"+dobArray[0];
    return newDobFormat;
}

export function textFormatter(str){
    return str.replace(/\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function createPagination(totalPage, currPage) {
    let str = '<ul>';
    let activate;
    let pageCutLow = currPage - 1;
    let pageCutHigh = currPage + 1;
    
    if (currPage > 1) {
        str += `<li class='page-item previous no' data-goto=${currPage-1}><a>Previous</a></li>`;
    }
    
    if (totalPage < 6) {
        for (let p = 1; p <= totalPage; p++) {
            if(currPage==p){
                activate='activate';
            }else{
                activate='no';
            }
            
            str += `<li class='${activate}' data-goto=${p}><a>${p}</a></li>`;
        }
    }
    
    else {
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
        } else if (currPage === totalPage-1) {
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
    
        if (currPage < totalPage-1) {
            if (currPage < totalPage-2) {
                str += `<li class='out-of-range' data-goto=${currPage+2}><a>...</a></li>`;
            }
            
            str += `<li class='page-item no' data-goto=${totalPage}><a>${totalPage}</a></li>`;
        }
    }
    
    if (currPage < totalPage) {
        str += `<li class='page-item next no' data-goto=${currPage+1}><a>Next</a></li>`;
    }
    str += '</ul>';
    return str;
}

