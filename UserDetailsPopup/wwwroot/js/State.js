$(document).ready(function () {
    showState();
    $('#country').attr('disable', true);
    LoadCountries();
})

function showState() {
    $.ajax({
        url: 'StateManager/StateList',
        type: 'GET',
        dataT: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, statu, xhr) {
            var obj = "";
            $.each(result, function (index, item) {
                obj += '<tr>';
                obj += '<td>' + item.stateName + '</td>';
                obj += '<td>' + item.country.countryName + '</td>';
                obj += '<td><a href="#" class="btn btn-primary" onclick="Edit(' + item.stateId + ')">Edit</a> ||  <a href="#" class="btn btn-danger" onclick="Delete(' + item.stateId + ')">Delete</a></td >';
                obj += '</tr>';
            })
            $('#tblData').html(obj);
        },
        error: function () {
            alert("Data can't get");
        }
    });
};

function LoadCountries() {
    $('#country').empty();

    $.ajax({
        url: '/StateManager/CountryList',
        success: function (response) {

            if (response != null && response != undefined && response.length > 0) {
                $('#country').attr('disable', true);
                $('#country').append('<option disabled selected>--- Select Country ---</option>');

                $.each(response, function (i, data) {

                    $('#country').append('<option value= ' + data.countryId + '>' + data.countryName + '</option>');
                });
            }
            else {
                $('#country').attr('disable', true);
                $('#country').append('<option>---  Countries not Available ---</option>');
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
    $('#addState').text('Add State');
});

function giveErrorState() {
    var StateName = $('#StateName').val();
    if (!StateName) {
        if ($('#StateNameError').length === 0) {
            $('#StateName').keyup(function () {
                if ($(this).val()) {
                    $('#StateNameError').remove();
                }
            });
            $('#StateName').after('<span id="StateNameError" class="text-danger">State Name is required.</span>');
        }
        
    }
    var CountryName = $('#country').val();
    if (!CountryName) {
        if ($('#CountryNameError').length === 0) {
            $('#country').change(function () {
                if ($(this).val()) {
                    $('#CountryNameError').remove();
                }
            });
            $('#country').after('<span id="CountryNameError" class="text-danger">Select Country is required.</span>');
        }
        
    }
    return;
}
function AddState() {
    giveErrorState();
    var objData = {
        StateName: $('#StateName').val(),
        CountryId: $('#country').val()
    }
    $.ajax({
        url: '/StateManager/AddState',
        type: 'POST',
        data: objData,
        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                LoadCountries();
                alert('State Created Successfully');
                ClearTextBox();
                showState();
                HidePop();
            }
            else {
                alert('state not created:' + response.message);
            }
            
        },
        error: function () {
            alert("State not Created Successfully");
        }
    });
};

function HidePop() {
    $('#userModal').modal('hide');
}

function ClearTextBox() {
    $('#StateName').val('');
}

function Delete(stateId) {
    if (confirm('Are You Sure, You want to delete the State? ')) {
        $.ajax({
            url: '/StateManager/Delete?id=' + stateId,
            success: function (response) {
                if (response.success) {
                    alert('State Deleted SuccessFully!');
                    showState();
                }
                else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("State not Deleted");
            }
        });
    }
}

function Edit(stateId) {
    $('span').remove();
    $.ajax({
        url: '/StateManager/Edit?id=' + stateId,
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        dataType: 'json',
        success: function (response) {
            $('#userModal').modal('show');
            $('#StateId').val(response.stateId);
            $('#StateName').val(response.stateName);
            $('#country').val(response.countryId);

            $('#AddData').hide();
            $('#UpdateData').show();
        },
        error: function () {
            alert("State not Found");
        }
    });
}

function UpdateState() {
    giveErrorState();
    var objData = {
        StateId: $('#StateId').val(),
        StateName: $('#StateName').val(),
        CountryId: $('#country').val()
        
    }
    $.ajax({
        url: '/StateManager/EditState',
        type: 'POST',
        data: objData,
        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                alert('State Updated Successfully');
                ClearTextBox();
                showState();
                HidePop();
            }
            else {
                alert('State not updated');
            }
            
        },
        error: function () {
            alert("State can't Updated");
        }
    });

    function HidePop() {
        $('#userModal').modal('hide');
    }

    function ClearTextBox() {
        $('#StateName').val('');
    }
}