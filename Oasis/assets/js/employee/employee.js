var statusSuccess = 200;
var path='http://localhost:8085/oasis';

$(document).ready(function(){
   
    // var employeeId;
    // employeeId = localStorage.getItem('id');
    // alert(employeeId);
    
    var activePageNum=1;
    var maxRows=10;
    var countTotalPage=1;
   
    $(".section .employee").removeClass("section ");
    
	$(".sidebar__part").load("../../components/sidebar/sidebar.html",function(){
            $(".navbar__part").load("../../components/navbar/navbar.html");
            $(".sidebar__icon__dashboard,  .sidebar__text__dashboard").removeClass("active");
            $(".sidebar__icon__asset, .sidebar__text__asset").removeClass("active"); 
            $(".sidebar__icon__employee, .sidebar__text__employee").addClass("active"); 
            $(".sidebar__icon__request, .sidebar__text__request").removeClass("active");
    });
      
    $(".btn-asset-list-delete").click(function(){
        $(".employee__view").load("../../views/employee/employee_delete.html");
    });

    $(".btn-employee-list-add").click(function(){
        $(".employee__view").load("../../views/employee/employee_add.html");
    });

    $(document).on('click', '.table-content-employee-admin-view', function(e) {
        var employeeId=e.target.closest('.table-content-employee-admin-view').dataset.value;
        $.ajax({
            type: 'GET',
            url: path+'/api/employees/'+employeeId,
            contentType: 'application/octet-stream',
            dataType: 'json',
            success: function(data){
                if(data.code == statusSuccess){
				    localStorage.setItem('sku', employeeId);
                    window.location.href='../../views/employee/employee_detail.html';
                } else {     
                    alert("error");
                }
            },
            error: function(data){
                alert("failed load data");
            }
        });
    });

    $(document).on('click', '.table-content-employee-admin-edit', function(e) {
        var employeeId=e.target.closest('.table-content-employee-admin-edit').dataset.value;  
        localStorage.setItem('sku', employeeId);
        window.location.href='../../views/employee/employee_edit.html';
    });

    loademployeeList();

    function listData(data){
        $("#total-employee-text").text(data.paging.totalRecords);
        for(var index=0;index<data.value.assetList.length;index++){
            if(index>0 && index%10==0){
                countTotalPage++;
            }
            var markup = 
            `
            <div class="table-content-employee-admin-list table-content-employee-admin-page-${countTotalPage}">                
            <div class="table-content table-content-employee-admin-no">${index+1}</div>
            <div class="table-content table-content-employee-admin-name">${data.value.assetList[index].employeeName}</div>
            <div class="table-content table-content-employee-admin-brand">${data.value.assetList[index].employeeBrand}</div>
            <div class="table-content table-content-employee-admin-type">${data.value.assetList[index].employeeType}</div>
            <div class="table-content table-content-employee-admin-location">${data.value.assetList[index].employeeLocation}</div>
            <div class="table-content table-content-employee-admin-qty">${data.value.assetList[index].employeeQty} pcs</div>                                       
            <div class="table-content table-content-employee-admin-icon table-content-employee-admin-view" data-value=${data.value.assetList[index].employeeId}>
                    <a href="#" class="action-button-blue">    
                        <svg class="action-icon action-icon-blue">
                            <use xlink:href="../../assets/img/sprite.svg#icon-binoculars"></use>
                        </svg>
                    </a>
            </div>
            <div class="table-content table-content-employee-icon table-content-employee-admin-edit" data-value=${data.value.assetList[index].employeeId}>
                    <a href="#" id="action-button-blue">    
                        <svg class="action-icon action-icon-blue">
                            <use xlink:href="../../assets/img/sprite.svg#icon-pencil"></use>
                         </svg>
                    </a>
            </div>
            </div> 
            </div> 
            `
            document.querySelector(".table-content-employee-admin").insertAdjacentHTML('beforeend',markup);
        }

        //$('.table-content-employee-admin-list').hide();

        for(index=0;index<countTotalPage;index++){
            if(index===activePageNum){
                $(".table-content-employee-admin-page-"+index).show();
            }else{
                $(".table-content-employee-admin-page-"+index).hide();
            }
        }
    
        printPagination(data);
    }

    function loademployeeList(){
        const url = window.location.href;
        const index = url.indexOf("search__employee");
        if(index === -1){
            $.ajax({
                type: 'GET',
                url: path+'/api/assets?pageNumber='+activePageNum+'&sortInfo=AassetName',
                contentType: 'application/octet-stream',
                dataType: 'json',
                success: function(data){
                    if(data.code == statusSuccess){
                        listData(data);  
                    } else {     
                        console.log("error");
                    }
                },
                error: function(data){
                    alert("failed load data");
                }
            });
        }
        else{
            let keyword = url.substr(index+14,url.length-1); 
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8085/oasis/api/employees/find?searchQuery='+keyword+'&pageNumber=1&sortInfo=AemployeeName',
                contentType: 'application/octet-stream',
                dataType: 'json',
                success: function(data){
                    if(data.code === statusSuccess){
                        listData(data);
                    } else {     
                        console.log("error");
                    }
                },
                error: function(data){
                    console.log("failed at search");
                }
            });
        }
        
    }

    function printPagination(data){
        var totalRows=data.paging.totalRecords;
        if (totalRows > maxRows){
        var pagenum = Math.ceil(totalRows/maxRows);
            for (var i = 1; i <= pagenum;){			
                $('.pagination #next').before('<li data-page="'+i+'">\
                    <span>'+ i++ +'<span class="sr-only">(current)</span></span>\
                    </li>').show();
            }					
        }else{
            $(".pagination").hide();
        }

        $('.pagination [data-page="1"]').addClass('pagination__active'); 
    }
   
    $(document).on('click', '.pagination li', function(e) {
        var currPageNum = $(this).attr('data-page');
        
        if(currPageNum == "prev" ){
            if(activePageNum == 1 ){return;}
            currPageNum  = activePageNum-1; 
        }else if(currPageNum == "next" ){
            if(activePageNum == ($('.pagination li').length-2) ){return;}
            currPageNum  = activePageNum+1; 
        }

        $('.table-content-employee-admin-page-'+activePageNum).hide();
        activePageNum = currPageNum ;
        $('.pagination li').removeClass('pagination__active');
        $('.pagination [data-page="'+activePageNum+'"]').addClass('pagination__active');
        $('.table-content-employee-admin-page-'+activePageNum).show();
    });			

    //localStorage.removeItem('id');

});
