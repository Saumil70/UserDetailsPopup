$(document).ready(function () {
    showCity();
    $('#state').attr('disable', true);
    LoadStates();
})

function showCity() {
    $.ajax({
        url: 'CityManager/CityList',
        type: 'GET',
        dataT: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, statu, xhr) {
            var obj = "";
            $.each(result, function (index, item) {
                obj += '<tr>';
                obj += '<td>' + item.cityName + '</td>';
                obj += '<td>' + item.states.stateName + '</td>';
                obj += '<td><a href="#" class="btn btn-primary" onclick="Edit(' + item.cityId + ')">Edit</a> ||  <a href="#" class="btn btn-danger" onclick="Delete(' + item.cityId + ')">Delete</a></td >';
                obj += '</tr>';
            })
            $('#tblData').html(obj);
        },
        error: function () {
            alert("Data can't get");
        }
    });
};

function LoadStates() {
    $('#state').empty();

    $.ajax({
        url: '/CityManager/StateList',
        success: function (response) {

            if (response != null && response != undefined && response.length > 0) {
                $('#state').attr('disable', true);
                $('#state').append('<option disabled selected>--- Select State ---</option>');

                $.each(response, function (i, data) {

                    $('#state').append('<option value= ' + data.stateId + '>' + data.stateName + '</option>');
                });
            }
            else {
                $('#state').attr('disable', true);
                $('#state').append('<option>---  States not Available ---</option>');
            }
        }
    });
}
$('#btnAdd').click(function () {
    ClearTextBox();
    $('span').remove();
    $('#userModal').modal('show');
    $('#cId').hide();
    $('#AddData').show();
    $('#UpdateData').hide();
    $('#addCity').text('Add City');
});

function giveErrorCity() {
    var CityName = $('#CityName').val();
    if (!CityName) {
        if ($('#CityNameError').length === 0) {
            $('#CityName').keyup(function () {
                if ($(this).val()) {
                    $('#CityNameError').remove();
                }
            });
            $('#CityName').after('<span id="CityNameError" class="text-danger">City Name is required.</span>');
        }
        
    }
    var StateName = $('#state').val();
    if (!StateName) {
        if ($('#StateNameError').length === 0) {
            $('#state').change(function () {
                if ($(this).val()) {
                    $('#StateNameError').remove();
                }
            });
            $('#state').after('<span id="StateNameError" class="text-danger">Select State is required.</span>');
        }
        
    }
    return;
}
function AddCity() {
    giveErrorCity();
    var objData = {
        CityName: $('#CityName').val(),
        StateId: $('#state').val()
    }
    $.ajax({
        url: '/CityManager/AddCity',
        type: 'POST',
        data: objData,
        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                LoadStates();
                alert('City Created Successfully');
                ClearTextBox();
                showCity();
                HidePop();
            }
            else {
                alert('City not created:' + response.message);
            }
            
        },
        error: function () {
            alert("City not Created Successfully");
        }
    });
};

function HidePop() {
    $('#userModal').modal('hide');
}

function ClearTextBox() {
    $('#CityName').val('');
}

function Delete(cityId) {
    if (confirm('Are You Sure, You want to delete the City? ')) {
        $.ajax({
            url: '/CityManager/Delete?id=' + cityId,
            success: function (response) {
                if (response.success) {
                    alert('City Deleted SuccessFully!');
                    showCity();
                }
                else {
                    alert(response.message);
                }
                
            },
            error: function () {
                alert("City not Deleted");
            }
        });
    }
}

function Edit(cityId) {
    $('span').remove();
    $.ajax({
        url: '/CityManager/Edit?id=' + cityId,
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        dataType: 'json',
        success: function (response) {
            $('#userModal').modal('show');
            $('#CityId').val(response.cityId);
            $('#CityName').val(response.cityName);
            $('#state').val(response.stateId);

            $('#AddData').hide();
            $('#UpdateData').show();
        },
        error: function () {
            alert("City not Found");
        }
    });
}

function UpdateCity() {
    giveErrorCity();
    var objData = {
        CityId: $('#CityId').val(),
        CityName: $('#CityName').val(),
        StateId: $('#state').val()
        
    }
    $.ajax({
        url: '/CityManager/EditCity',
        type: 'POST',
        data: objData,
        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                alert('City Updated Successfully');
                ClearTextBox();
                showCity();
                HidePop();
            }
            else {
                alert('City not updated');
            }
            
        },
        error: function () {
            alert("City can't Updated");
        }
    });

    function HidePop() {
        $('#userModal').modal('hide');
    }

    function ClearTextBox() {
        $('#CityName').val('');
    }
}