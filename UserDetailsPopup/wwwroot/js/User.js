$(document).ready(function () {
    showUser();
    $('#country').attr('disable', true);
    $('#state').attr('disable', true);
    $('#city').attr('disable', true);
    $('#department').attr('disable', true);

    LoadHobbies();
    LoadDepartment();
    LoadCountries();

    $('#searchInput').on('input', function () {
        var searchTerm = $(this).val().trim();
        if (searchTerm.length > 3) {
            // Perform search when search term length is at least 3 characters
            searchUser(searchTerm);
        } 
        else {
            // If search term is empty, show all data
            showUser();
        }
    });


    
})


function showUser() {
    $.ajax({
        url: 'UserManager/UserList',
        type: 'GET',
        dataT: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, statu, xhr) {
            var obj = "";
            $.each(result, function (index, item) {
                obj += '<tr>';
                obj += '<td>' + item.name + '</td>';
                obj += '<td>' + item.email + '</td>';
                obj += '<td>' + item.address + '</td>';
                obj += '<td>' + item.gender.genderName + '</td>';
                obj += '<td>' + item.hobbies + '</td>';
                obj += '<td>' + item.department.departmentName + '</td>';
                obj += '<td>' + item.country.countryName + '</td>';
                obj += '<td>' + item.states.stateName + '</td>';
                obj += '<td>' + item.cities.cityName + '</td>';
                obj += '<td><img src="' + item.imageUrl + '" width="100" height="100"></td>';
                obj += '<td><a href="#" class="btn btn-primary btn-sm" onclick="Edit(' + item.employeeId + ')">Edit</a>  <a href="#" class="btn btn-danger btn-sm  onclick="Delete(' + item.employeeId + ')">Delete</a>  <a href="#" class="btn btn-primary btn-sm mt-2" onclick="Details(' + item.employeeId + ')">Details</a></td >';
                obj += '</tr>';
            })
            $('#tblData').html(obj);
        },
        error: function () {
            alert("Data can't get");
        }
    });
};



function LoadHobbies() {
    $('#createHobbies').empty();

    $.ajax({
        url: '/UserManager/HobbieList',
        success: function (response) {

            if (response != null && response != undefined && response.length > 0) {
                $.each(response, function (i, data) {
                    $('#createHobbies').append('<input type="checkbox" class="hobby" value="' + data.hobbyName + '"/> ' + data.hobbyName + ' &nbsp;');
                });

                $('#createHobbies').attr('required', 'required');
            }
            else {
                $('#createHobbies').append('<p>Hobbies not available</p>');
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}

function LoadDepartment() {
    $('#department').empty();

    $.ajax({
        url: '/UserManager/DepartmentList',
        success: function (response) {

            if (response != null && response != undefined && response.length > 0) {
                $('#department').attr('disable', true);
                $('#department').append('<option disabled selected>--- Select Department ---</option>');

                $.each(response, function (i, data) {

                    $('#department').append('<option value= ' + data.departmentId + '>' + data.departmentName + '</option>');
                });
            }
            else {
                $('#department').attr('disable', true);
                $('#department').append('<option>---  department not Available ---</option>');
            }
        }
    });
}

function LoadCountries() {
    $('#country').empty();

    $.ajax({
        url: '/UserManager/CountryList',
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
    }).done(function () {
        $('#country').on('change', function () {
            var selectedCountryId = $(this).val();
            LoadStates(selectedCountryId);
        });
    });
}
function LoadStates(countryId, selectedStateId) {
    $('#state').empty();

    $.ajax({
        url: '/UserManager/StateList?countryId=' + countryId,
        success: function (response) {
            if (response != null && response != undefined && response.length > 0) {
                $('#state').prop('disabled', false);
                $('#state').empty().append('<option disabled selected>--- Select State ---</option>');

                $.each(response, function (i, data) {
                    var option = $('<option value="' + data.stateId + '">' + data.stateName + '</option>');
                    if (data.stateId === selectedStateId) {
                        option.prop('selected', true);
                    }
                    $('#state').append(option);
                });
            }
            else {
                $('#state').prop('disabled', true);
                $('#state').empty().append('<option>--- States not Available ---</option>');
            }
        }
    }).done(function () {
        $('#state').on('change', function () {
            var selectedStateId = $(this).val();
            LoadCities(selectedStateId);
        });
    });
}

function LoadCities(stateId, selectedCityId) {
    $('#city').empty();

    $.ajax({
        url: '/UserManager/CityList?stateId=' + stateId,
        success: function (response) {
            if (response != null && response != undefined && response.length > 0) {
                $('#city').prop('disabled', false);
                $('#city').empty().append('<option disabled selected>--- Select City ---</option>');

                $.each(response, function (i, data) {
                    var option = $('<option value="' + data.cityId + '">' + data.cityName + '</option>');
                    if (data.cityId === selectedCityId) {
                        option.prop('selected', true);
                    }
                    $('#city').append(option);
                });
            }
            else {
                $('#city').prop('disabled', true);
                $('#city').empty().append('<option>--- Cities not Available ---</option>');
            }
        }
    });
}

function Details(userId) {
    $.ajax({
        url: 'UserManager/UserDetails',
        type: 'GET',
        data: { userId: userId },
        dataType: 'json',
        success: function (result) {
            var modalContent = '';
            $.each(result, function (index, item) {
                modalContent += '<p><strong>Name:</strong> ' + item.name + '</p>';
                modalContent += '<p><strong>Email:</strong> ' + item.email + '</p>';
                modalContent += '<p><strong>Address:</strong> ' + item.address + '</p>';
                modalContent += '<p><strong>Gender:</strong> ' + item.gender.genderName + '</p>';
                modalContent += '<p><strong>Hobbies:</strong> ' + item.hobbies + '</p>';
                modalContent += '<p><strong>Department:</strong> ' + item.department.departmentName + '</p>';
                modalContent += '<p><strong>Country:</strong> ' + item.country.countryName + '</p>';
                modalContent += '<p><strong>State:</strong> ' +item.states.stateName + '</p>';
                modalContent += '<p><strong>City:</strong> ' + item.cities.cityName + '</p>';
                modalContent += '<p><img src="' + item.imageUrl + '" width="100" height="100"></p>';
            })
            $('#userDetailsContent').html(modalContent);
            $('#details').modal('show');
        },
        error: function () {
            alert("Error retrieving user details.");
        }
    });
}

function searchUser(searchTerm) {
    $.ajax({
        url: 'UserManager/Search', // Change the URL to your search endpoint
        type: 'GET',
        dataType: 'json',
        data: { searchTerm: searchTerm },
        success: function (result) {
            var obj = "";
            $.each(result, function (index, item) {
                obj += '<tr>';
                obj += '<td>' + item.name + '</td>';
                obj += '<td>' + item.email + '</td>';
                obj += '<td>' + item.address + '</td>';
                obj += '<td>' + item.gender.genderName + '</td>';
                obj += '<td>' + item.hobbies + '</td>';
                obj += '<td>' + item.department.departmentName + '</td>';
                obj += '<td>' + item.country.countryName + '</td>';
                obj += '<td>' + item.state.stateName + '</td>';
                obj += '<td>' + item.city.cityName + '</td>';
                obj += '<td><img src="' + item.imageUrl + '" width="100" height="100"></td>';
                obj += '<td><a href="#" class="btn btn-primary" onclick="Edit(' + item.employeeId + ')">Edit</a> ||   <a href="#" class="btn btn-danger" onclick="Delete(' + item.employeeId + ')">Delete</a>  <a href="#" class="btn btn-primary mt-2" onclick="Details(' + item.employeeId + ')">Details</a></td >';
                obj += '</tr>';
            });
            $('#tblData').html(obj);
        },
        error: function () {
            alert("Error occurred while searching.");
        }
    });
}


// Function to populate the gender dropdown
function populateGenderDropdown() {
    $('#gender-dropdown').empty();

    $.ajax({
        url: '/UserManager/GenderList',
        success: function (response) {
            if (response != null && response != undefined && response.length > 0) {
                $('#gender-dropdown').append('<option disabled selected>--- Gender ---</option>');
                $.each(response, function (i, data) {
                    $('#gender-dropdown').append('<option value="' + data.genderId + '">' + data.genderName + '</option>');
                });
            } else {
                $('#gender-dropdown').append('<option disabled selected>--- Not Available ---</option>');
            }
        },
        complete: function () {
            $('#gender-dropdown').prop('disabled', false); 
        }
    });
}


$('#gender-dropdown').unbind('click').on('click', function () {
    populateGenderDropdown();
});


$('#gender-dropdown').off('change').on('change', function () {
    var selectedGender = $(this).val(); 
    var gender;
    if (selectedGender === '1') {
        gender = 'Male'; 
    } else {
        gender = 'Female'; 
    }
    searchByGender(gender); 
});


// Function to search users based on gender
function searchByGender(gender) {
    $.ajax({
        url: '/UserManager/SearchByGender',
        type: 'GET',
        data: { searchTerm: gender },
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            // Populate table with search results
            var obj = '';
            $.each(result, function (index, item) {
                obj += '<tr>';
                obj += '<td>' + item.name + '</td>';
                obj += '<td>' + item.email + '</td>';
                obj += '<td>' + item.address + '</td>';
                obj += '<td>' + item.gender.genderName + '</td>';
                obj += '<td>' + item.hobbies + '</td>';
                obj += '<td>' + item.department.departmentName + '</td>';
                obj += '<td>' + item.country.countryName + '</td>';
                obj += '<td>' + item.state.stateName + '</td>';
                obj += '<td>' + item.city.cityName + '</td>';
                obj += '<td><img src="' + item.imageUrl + '" width="100" height="100"></td>';
                obj += '<td><a href="#" class="btn btn-primary" onclick="Edit(' + item.employeeId + ')">Edit</a> ||   <a href="#" class="btn btn-danger" onclick="Delete(' + item.employeeId + ')">Delete</a>  <a href="#" class="btn btn-primary mt-2" onclick="Details(' + item.employeeId + ')">Details</a></td >';
                obj += '</tr>';
            });
            $('#tblData').html(obj);
        },
        error: function () {
            alert("Search failed.");
        }
    });
}


function populateHobbyDropdown() {
    $('#hobbies-dropdown').empty();

    $.ajax({
        url: '/UserManager/HobbieList',
        success: function (response) {

            if (response != null && response != undefined && response.length > 0) {
                $('#hobbies-dropdown').attr('disable', true);
                $('#hobbies-dropdown').append('<option disabled selected>--- Select Department ---</option>');

                $.each(response, function (i, data) {

                    $('#hobbies-dropdown').append('<option value= ' + data.hobbyId + '>' + data.hobbyName + '</option>');
                });
            }
            else {
                $('#hobbies-dropdown').attr('disable', true);
                $('#hobbies-dropdown').append('<option>---  Hobbies not Available ---</option>');
            }
        }
    });
};

$('#hobbies-dropdown').unbind('click').on('click', function () {
    populateHobbyDropdown();
});


$('#hobbies-dropdown').off('change').on('change', function () {
    var selectedHobby = $(this).val();
    var hobby;
    if (selectedHobby === '1') {
        hobby = 'Cricket';
    } else {
        hobby = 'Football';
    }

    searchByHobby(hobby);
});


// Function to search users based on gender
function searchByHobby(hobby) {
    $.ajax({
        url: '/UserManager/SearchByHobby',
        type: 'GET',
        data: { searchTerm: hobby },
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            // Populate table with search results
            var obj = '';
            $.each(result, function (index, item) {
                obj += '<tr>';
                obj += '<td>' + item.name + '</td>';
                obj += '<td>' + item.email + '</td>';
                obj += '<td>' + item.address + '</td>';
                obj += '<td>' + item.gender.genderName + '</td>';
                obj += '<td>' + item.hobbies + '</td>';
                obj += '<td>' + item.department.departmentName + '</td>';
                obj += '<td>' + item.country.countryName + '</td>';
                obj += '<td>' + item.state.stateName + '</td>';
                obj += '<td>' + item.city.cityName + '</td>';
                obj += '<td><img src="' + item.imageUrl + '" width="100" height="100"></td>';
                obj += '<td><a href="#" class="btn btn-primary" onclick="Edit(' + item.employeeId + ')">Edit</a> ||   <a href="#" class="btn btn-danger" onclick="Delete(' + item.employeeId + ')">Delete</a>  <a href="#" class="btn btn-primary mt-2" onclick="Details(' + item.employeeId + ')">Details</a></td >';
                obj += '</tr>';
            });
            $('#tblData').html(obj);
        },
        error: function () {
            alert("Search failed.");
        }
    });
}

$('#btnAdd').click(function () {
    ClearTextBox();
    $('userImage').empty();
    $('span').remove();
    $('#userModal').modal('show');
    $('#cId').hide();
    $('#AddData').show();
    $('#UpdateData').hide();
    $('#addUser').text('Add User');
});

/*function giveErrorUser() {

    var Name = $('#Name').val();
    if (!Name) {
        if ($('#NameError').length === 0) {
            $('#Name').keyup(function () {
                if ($(this).val()) {
                    $('#NameError').remove();
                }
            });
            $('#Name').after('<span id="NameError" class="text-danger">Name is required.</span>');
        }
       
    }

    var Email = $('#Email').val();
    if (!Email) {
        if ($('#EmailError').length === 0) {
            $('#Email').keyup(function () {
                if ($(this).val()) {
                    $('#EmailError').remove();
                }
            });
            $('#Email').after('<span id="EmailError" class="text-danger">Email is required.</span>');
        }
        
    }

    var Address = $('#Address').val();
    if (!Address) {
        if ($('#AddressError').length === 0) {
            $('#Address').keyup(function () {
                if ($(this).val()) {
                    $('#AddressError').remove();
                }
            });
            $('#Address').after('<span id="AddressError" class="text-danger">Address is required.</span>');
        }
        
    }

    var Gender = $('input[name="gender"]:checked').val();
    if (!Gender) {
        if ($('#GenderError').length === 0) {
            $('input[name="gender"]').change(function () {
                if ($(this).val()) {
                    $('#GenderError').remove();
                }
            });
            $('#gender').after('<span id="GenderError" class="text-danger">Gender is required.</span>');
        }
       
    }
    var Hobbies = $('.hobby:checked').val();
    if (!Hobbies) {
        if ($('#HobbyError').length === 0) {
            $('.hobby').change(function () {
                if ($(this).val()) {
                    $('#HobbyError').remove();
                }
            });
            $('#createHobbies').after('<span id="HobbyError" class="text-danger">Hobby is required.</span>');
        }

    }

    var Department = $('#department').val();
    if (!Department) {
        if ($('#DepartmentError').length === 0) {
            $('#department').change(function () {
                if ($(this).val()) {
                    $('#DepartmentError').remove();
                }
            });
            $('#department').after('<span id="DepartmentError" class="text-danger">Department is required.</span>');
        }
        
    }

    var Country = $('#country').val();
    if (!Country) {
        if ($('#CountryError').length === 0) {
            $('#country').change(function () {
                if ($(this).val()) {
                    $('#CountryError').remove();
                }
            });
            $('#country').after('<span id="CountryError" class="text-danger">Country is required.</span>');
        }
        
    }

    var State = $('#state').val();
    if (!State) {
        if ($('#StateError').length === 0) {
            $('#state').change(function () {
                if ($(this).val()) {
                    $('#StateError').remove();
                }
            });
            $('#state').after('<span id="StateError" class="text-danger">State is required.</span>');
        }
       
    }

    var City = $('#city').val();
    if (!City) {
        if ($('#CityError').length === 0) {
            $('#city').change(function () {
                if ($(this).val()) {
                    $('#CityError').remove();
                }
            });
            $('#city').after('<span id="CityError" class="text-danger">City is required.</span>');
        }
        
    }
    return;
}*/
function AddUser() {
    /*giveErrorUser();*/
    var isValid = $('#employeeForm').valid();
    if (!isValid) {
        return;
    }

    var selectedHobbies =[];
    $('.hobby:checked').each(function(){
        selectedHobbies.push($(this).val());
    })

    var hobbychecked = selectedHobbies.join(', ');
    
    var formData = new FormData();

    // Append form data to the formData object
    formData.append('Name', $('#Name').val());
    formData.append('Email', $('#Email').val());
    formData.append('Address', $('#Address').val());
    formData.append('GenderId', $('input[name="gender"]:checked').val());
    formData.append('Hobbies', hobbychecked);
    formData.append('DepartmentId', $('#department').val());
    formData.append('CountryId', $('#country').val());
    formData.append('StateId', $('#state').val());
    formData.append('CityId', $('#city').val());
    formData.append('File', $('#Image').prop('files')[0]);

    $.ajax({
        url: '/UserManager/AddUser',
        type: 'POST',
        data: formData,
        processData: false,  
        contentType: false, 
        dataType: 'json',
        success: function (respone) {
            if (respone.success) {
                LoadCountries();
                LoadStates();
                LoadCities();
                LoadDepartment();
                alert('User Created Successfully');
                ClearTextBox();
                showUser();
                HidePop();
            }
            else {
                alert('User not created');
            }
            
        },
        error: function () {
            alert("User not Created Successfully");
        }
    });
};

function HidePop() {
    $('#userModal').modal('hide');
}

function ClearTextBox() {
    $('#Name').val('');
    $('#Email').val('');
    $('#Address').val('');
    $('#Image').val('');
    $('#userImage').empty();


}

function Delete(userId) {
    if (confirm('Are You Sure, You want to delete the User? ')) {
        $.ajax({
            url: '/UserManager/Delete?id=' + userId,
            success: function () {
                alert('User Deleted SuccessFully!');
                showUser();
            },
            error: function () {
                alert("User not Deleted");
            }
        });
    }
}

function Edit(employeeId) {
    $('span').remove();
    $.ajax({
        url: '/UserManager/Edit?id=' + employeeId,
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        dataType: 'json',
        success: function (response) {
            
            $('#userModal').modal('show');
            $('#UserId').val(response.employeeId);
            $('#Name').val(response.name);
            $('#Email').val(response.email);
            $('#Address').val(response.address);
            var hobbies = response.hobbies.split(', ');
            $('.hobby').each(function () {
                if (hobbies.includes($(this).val())) {
                    $(this).prop('checked', true);
                }
                else {
                    $(this).prop('checked', false);
                }
            });


            $('input[name="gender"][value="' + response.genderId + '"]').prop('checked', true);
            $('#department').val(response.departmentId);
            $('#country').val(response.countryId);
            LoadStates(response.countryId,response.stateId);
            $('#state').val(response.stateId);
            LoadCities(response.stateId,response.cityId);
            $('#cities').val(response.cityId);
            $('#preview').attr('src', response.imageUrl);
            var imageUrl = response.imageUrl;
            if (imageUrl) {
                var imgElement = $('<img id="preview" class="rounded">').attr('src', imageUrl).attr('alt', 'User Image').attr('height', '100').attr('width', '100');
                $('#userImage').empty().append(imgElement);

            }
            else {
                $('#userImage').empty(); // Clear the image element if no image URL is available
            }

            // Add event listener to update image preview when a new file is selected
            $('#Image').on('change', function () {
                var file = this.files[0];
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#preview').attr('src', e.target.result);
                }

                reader.readAsDataURL(file);
            });
            
          

            $('#AddData').hide();
            $('#UpdateData').show();
        },
        error: function () {
            alert("User not Found");
        }
    });
}

function UpdateUser() {
    /*giveErrorUser();*/
    var isValid = $('#employeeForm').valid();
    if (!isValid) {
        return;
    }
    

    var selectedHobbies =[];
    $('.hobby:checked').each(function () {
        selectedHobbies.push($(this).val());
    })

    var hobbychecked = selectedHobbies.join(', ');

    var formData = new FormData();

    // Append form data to the formData object
    formData.append('EmployeeId', $('#UserId').val());
    formData.append('Name', $('#Name').val());
    formData.append('Email', $('#Email').val());
    formData.append('Address', $('#Address').val());
    formData.append('GenderId', $('input[name="gender"]:checked').val());
    formData.append('Hobbies', hobbychecked);
    formData.append('DepartmentId', $('#department').val());
    formData.append('CountryId', $('#country').val());
    formData.append('StateId', $('#state').val());
    formData.append('CityId', $('#city').val());
    formData.append('ImageUrl', $('#preview').attr('src'));
    formData.append('file', $('#Image')[0].files[0]);

    $.ajax({
        url: '/UserManager/EditUser',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false, 
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                alert('User Updated Successfully');
                ClearTextBox();
                showUser();
                HidePop();
            }
            else {
                alert('User not upated');
            }
            
        },
        error: function () {
            alert("User can't Updated");
        }
    });

    function HidePop() {
        $('#userModal').modal('hide');
    }

    function ClearTextBox() {
        $('#Name').val('');
        $('#Email').val('');
        $('#Address').val('');
        $('#Image').val('');
        $('#userImage').empty();
    }



}