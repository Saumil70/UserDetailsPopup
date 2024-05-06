using Microsoft.AspNetCore.Mvc;

using System.Diagnostics.Metrics;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Controllers
{
    public class CountryManagerController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public CountryManagerController(IUnitOfWork db)
        {
            _unitOfWork = db;
        }

        public IActionResult Index()
        {
            return View();
        }

        public JsonResult CountryList()
        {
            var data = _unitOfWork.CountryRepository.CountryIndex().ToList();
            return Json(data);
        }


        [HttpPost]
        public JsonResult AddCountry(Countries country)
        {
            if (ModelState.IsValid)
            {
                var countryexist = _unitOfWork.CountryRepository.Get(u => u.CountryName == country.CountryName);

                if (countryexist != null)
                {
                    return new JsonResult (new {success  = false, message="Country already exist"});
                }

                var obj = new Countries
                {
                    CountryName = country.CountryName
                };

                _unitOfWork.CountryRepository.CountryAdd(obj);
                _unitOfWork.Save();
                return new JsonResult(new {success=true});
            }
            else
            {
                return new JsonResult(new { success = false, message="please fill all required fields" });
            }
            
        }

        public JsonResult Edit(int id)
        {
            var data = _unitOfWork.CountryRepository.Get(c => c.CountryId == id);
            return new JsonResult(data);
        }

        [HttpPost]
        public JsonResult EditCountry(Countries country)
        {
            if(ModelState.IsValid)
            {
                _unitOfWork.CountryRepository.Update(country);
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
            var country = _unitOfWork.CountryRepository.Get(c => c.CountryId == id);
            var states = _unitOfWork.StateRepository.GetAll().Where(u=> u.CountryId == id).ToList();

            if(states.Count > 0)
            {
                return new JsonResult(new {success  = false, message = "Country cannot be deleted because states are avaiable"} );   
            }
            _unitOfWork.CountryRepository.CountryDelete(country);
            _unitOfWork.Save();
            return new JsonResult(new {success = true});
        }
    }
}
