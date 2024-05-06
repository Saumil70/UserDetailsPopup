using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Controllers
{
    public class UserManagerController : Controller
    {
        
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public UserManagerController(IUnitOfWork db, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = db;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public JsonResult UserList()
        {
            var data = _unitOfWork.UserRepository.UserIndex().ToList();
            return Json(data);
        }

        public JsonResult UserDetails(int userId)
        {
            var data = _unitOfWork.UserRepository.GetAll(u=> u.EmployeeId==userId, includeProperties: "Gender,Department,Country,States,Cities");
            return Json(data);
        }

        public JsonResult CountryList()
        {
            var data = _unitOfWork.CountryRepository.GetAll().ToList();
            return Json(data);

        }
        public JsonResult StateList(int countryId)
        {
            var data = _unitOfWork.StateRepository.GetAll().Where(u => u.CountryId == countryId);
            return Json(data); // Return states as JSON

        }
        public JsonResult CityList(int stateId)
        {
            var data = _unitOfWork.CityRepository.GetAll().Where(u => u.StateId == stateId);
            return Json(data); // Return states as JSON

        }
        public JsonResult DepartmentList()
        {
            var data = _unitOfWork.DepartmentRepository.GetAll().ToList();
            return Json(data);

        }

        public JsonResult GenderList()
        {
            var data = _unitOfWork.GenderRepository.GetAll().ToList();
            return Json(data);

        }



        public JsonResult HobbieList()
        {
            var data = _unitOfWork.HobbyRepository.HobbyList().ToList();
            return Json(data);
        }

        public JsonResult Search(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm) || searchTerm.Length <= 3)
            {
                var data = _unitOfWork.UserRepository.UserIndex().ToList();
                return Json(data);
            }
            else
            {
                var data = _unitOfWork.UserRepository.GetAll(
                u => (u.Name.Contains(searchTerm) ||
                u.Email.Contains(searchTerm) ||
                u.Department.DepartmentName.Contains(searchTerm) ||
                u.Country.CountryName.Contains(searchTerm) ||
                u.States.StateName.Contains(searchTerm) ||
                u.Cities.CityName.Contains(searchTerm)) &&
                !string.IsNullOrEmpty(u.Name) &&
                !string.IsNullOrEmpty(u.Email) &&
                !string.IsNullOrEmpty(u.Department.DepartmentName) &&
                !string.IsNullOrEmpty(u.Country.CountryName) &&
                !string.IsNullOrEmpty(u.States.StateName) &&
                !string.IsNullOrEmpty(u.Cities.CityName),
                includeProperties: "Gender,Department,Country,States,Cities"
                ).Select(u => new
                {
                    u.Name,
                    u.Email,
                    u.Address,
                    u.Gender,
                    u.Hobbies,
                    Department = u.Department != null ? new { DepartmentName = u.Department.DepartmentName } : null,
                    Country = u.Country != null ? new { CountryName = u.Country.CountryName } : null,
                    State = u.States != null ? new { StateName = u.States.StateName } : null,
                    City = u.Cities != null ? new { CityName = u.Cities.CityName } : null,
                    u.ImageUrl
                });

                    return Json(data);
                }


        }

        public JsonResult SearchByGender(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                var data = _unitOfWork.UserRepository.UserIndex().ToList();
                return Json(data);
            }
            else
            {
                var data = _unitOfWork.UserRepository.GetAll(
                    u => u.Gender.GenderName.Equals(searchTerm) &&
                         !string.IsNullOrEmpty(u.Gender.GenderName),
                    includeProperties: "Gender,Department,Country,States,Cities"
                ).Select(u => new
                {
                    u.Name,
                    u.Email,
                    u.Address,
                    u.Gender,
                    u.Hobbies,
                    Department = u.Department != null ? new { DepartmentName = u.Department.DepartmentName } : null,
                    Country = u.Country != null ? new { CountryName = u.Country.CountryName } : null,
                    State = u.States != null ? new { StateName = u.States.StateName } : null,
                    City = u.Cities != null ? new { CityName = u.Cities.CityName } : null,
                    u.ImageUrl
                }).ToList();

                return Json(data);
            }
        }

        public JsonResult SearchByHobby(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                var data = _unitOfWork.UserRepository.UserIndex().ToList();
                return Json(data);
            }
            else
            {
                var data = _unitOfWork.UserRepository.GetAll(
                    u => u.Hobbies.Contains(searchTerm) &&
                         !string.IsNullOrEmpty(u.Hobbies),
                    includeProperties: "Gender,Department,Country,States,Cities"
                ).Select(u => new
                {
                    u.Name,
                    u.Email,
                    u.Address,
                    u.Gender,
                    u.Hobbies,
                    Department = u.Department != null ? new { DepartmentName = u.Department.DepartmentName } : null,
                    Country = u.Country != null ? new { CountryName = u.Country.CountryName } : null,
                    State = u.States != null ? new { StateName = u.States.StateName } : null,
                    City = u.Cities != null ? new { CityName = u.Cities.CityName } : null,
                    u.ImageUrl
                }).ToList();

                return Json(data);
            }
        }


        [HttpPost]
        public JsonResult AddUser(Employee user, IFormFile? file)
        {
            if(ModelState.IsValid)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;

                if (file != null)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var uploads = Path.Combine(wwwRootPath, "Images");
                    var filePath = Path.Combine(uploads, fileName);


                    if (!string.IsNullOrEmpty(user.ImageUrl))
                    {
                        var oldImagePath = Path.Combine(wwwRootPath, user.ImageUrl.TrimStart('\\'));

                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }

                    user.ImageUrl = @"\Images\" + fileName;
                }

                var obj = new Employee
                {
                    Name = user.Name,
                    Email = user.Email,
                    Address = user.Address,
                    Hobbies = user.Hobbies,
                    DepartmentId = user.DepartmentId,
                    GenderId = user.GenderId,
                    CountryId = user.CountryId,
                    CityId = user.CityId,
                    StateId = user.StateId,
                    ImageUrl = user.ImageUrl
                };
                _unitOfWork.UserRepository.UserAdd(obj);
                _unitOfWork.Save();
                return new JsonResult(new { success = true });
            }
            else
            {
                return new JsonResult(new {success = false});
            }
            
        }
        public JsonResult Edit(int id)
        {
            var data = _unitOfWork.UserRepository.Get(c => c.EmployeeId == id);
            return new JsonResult(data);
        }

        [HttpPost]
        public JsonResult EditUser(Employee user, IFormFile? file)
        {
            if (ModelState.IsValid)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath;

                if (file != null)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var uploads = Path.Combine(wwwRootPath, "Images");
                    var filePath = Path.Combine(uploads, fileName);
                    

                    if (!string.IsNullOrEmpty(user.ImageUrl))
                    {
                        var oldImagePath = Path.Combine(wwwRootPath, user.ImageUrl.TrimStart('\\'));

                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(fileStream);
                    }

                    user.ImageUrl = @"\Images\" + fileName;
                }
                _unitOfWork.UserRepository.UserUpdate(user);
                _unitOfWork.Save();
                return new JsonResult(new {success = true});
            }
            else
            {
                return new JsonResult(new { success = false });
            }
            
        }

        public JsonResult Delete(int id)
        {
            var user = _unitOfWork.UserRepository.Get(c => c.EmployeeId == id);
            _unitOfWork.UserRepository.UserDelete(user);
            _unitOfWork.Save();
            return new JsonResult("User Deleted Successfully");
        }
    }
}
