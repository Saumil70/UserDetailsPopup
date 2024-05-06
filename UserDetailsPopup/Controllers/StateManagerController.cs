using Microsoft.AspNetCore.Mvc;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Controllers
{
    public class StateManagerController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public StateManagerController(IUnitOfWork db)
        {
            _unitOfWork = db;
        }

        public IActionResult Index()
        {
            return View();
        }

        public JsonResult StateList()
        {
            var data = _unitOfWork.StateRepository.StateIndex().ToList();
            return Json(data);
        }

        public JsonResult CountryList()
        {
            var data = _unitOfWork.CountryRepository.GetAll().ToList();
            return Json(data);
        }

        [HttpPost]
        public JsonResult AddState(State state)
        {
            if (ModelState.IsValid)
            {
                var stateexist = _unitOfWork.StateRepository.Get(u => u.StateName == state.StateName);

                if (stateexist != null)
                {
                    return new JsonResult(new {success = false, message="State already exist"});
                }
                var obj = new State
                {
                    StateName = state.StateName,
                    CountryId = state.CountryId
                };
                _unitOfWork.StateRepository.StateAdd(obj);
                _unitOfWork.Save();
                return new JsonResult(new { success = true });
            }
            else
            {
                return new JsonResult(new { success = false, message= "please fill all required fields" });
            }
        }
        public JsonResult Edit(int id)
        {
            var data = _unitOfWork.StateRepository.Get(c => c.StateId == id);
            return new JsonResult(data);
        }

        [HttpPost]
        public JsonResult EditState(State state)
        {
            if (ModelState.IsValid)
            {
                _unitOfWork.StateRepository.Update(state);
                _unitOfWork.Save();
                return new JsonResult(new { success = true });
            }
            else
            {
                return new JsonResult(new { success = false });
            }
            
        }

        public JsonResult Delete(int id)
        {
            var state = _unitOfWork.StateRepository.Get(c => c.StateId == id);
            var city = _unitOfWork.CityRepository.GetAll().Where(u => u.StateId == id).ToList();

            if(city.Count > 0) { 
             return new JsonResult(new { success = false , message = "state cannot be deleted beacause cities are already available"});
            }
            _unitOfWork.StateRepository.StateDelete(state);
            _unitOfWork.Save();
            return new JsonResult(new { success = true });
        }
    }
}
