using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Controllers
{
    public class CityManagerController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public CityManagerController(IUnitOfWork db)
        {
            _unitOfWork = db;
        }

        public IActionResult Index()
        {
            return View();
        }

        public JsonResult CityList()
        {
            var data = _unitOfWork.CityRepository.CityIndex().ToList();
            return Json(data);
        }

        public JsonResult StateList()
        {
            var data = _unitOfWork.StateRepository.GetAll().ToList();
            return Json(data);
        }

        [HttpPost]
        public JsonResult AddCity(City state)
        {
            var cityexist = _unitOfWork.CityRepository.Get(u => u.CityName == state.CityName);

            if(cityexist != null)
            {
                return new JsonResult(new { success = false, message = "City already exist" });
            }

            if(ModelState.IsValid)
            {
                var obj = new City
                {
                    CityName = state.CityName,
                    StateId = state.StateId
                };
                _unitOfWork.CityRepository.CityAdd(obj);
                _unitOfWork.Save();
                return new JsonResult(new {success = true});
            }
            else
            {
                return new JsonResult(new {success = false, message ="please fill all required fields"});
            }
           
        }
        public JsonResult Edit(int id)
        {
            var data = _unitOfWork.CityRepository.Get(c => c.CityId == id);
            return new JsonResult(data);
        }

        [HttpPost]
        public JsonResult EditCity(City city)
        {
            if (ModelState.IsValid)
            {
                _unitOfWork.CityRepository.Update(city);
                _unitOfWork.Save();
                return new JsonResult(new {success = true});
            }
            else
            {
                return new JsonResult(new { success = false});  
            }
            
        }

        public JsonResult Delete(int id)
        {
            
            var city = _unitOfWork.CityRepository.Get(c => c.CityId == id);
            var user = _unitOfWork.UserRepository.GetAll().Where(u => u.CityId == id).ToList();

            if(user.Count > 0) {
                return new JsonResult(new { success = false, message = "City cannot be deleted because user belongs to that city" });
            }
            _unitOfWork.CityRepository.CityDelete(city);
            _unitOfWork.Save();
            return new JsonResult(new {success = true});
        }
    }
}
