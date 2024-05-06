using Microsoft.EntityFrameworkCore;
using UserDetailsPopup.Models;

using UserDetailsPopup.Repository.IRepository;


namespace UserDetails.Repository
{
    public class CityRepository : Repository<City>, ICityRepository
    {
        private EmployeeEntites _db;
        public CityRepository(EmployeeEntites db) : base(db)
        {
            _db = db;
        }
        public void Update(City obj)
        {
            _db.Database.ExecuteSqlRaw($"CityUpdate {obj.CityName},{obj.StateId},{obj.CityId}");
        }

        public IEnumerable<City> CityIndex()
        {
            // Execute the stored procedure to get States
            var Cities = _db.Cities.FromSqlRaw("exec CityIndex").ToList();

            // Load related Country entities for each State
            foreach (var city in Cities)
            {
                _db.Entry(city)
                    .Reference(s => s.States)
                    .Load();
            }

            return Cities;
        }

        public void CityAdd(City obj)
        {
            _db.Database.ExecuteSqlRaw($"CityCreate {obj.CityName},{obj.StateId}");
        }

        public void CityDelete(City obj)
        {
            _db.Database.ExecuteSqlRaw($"CityDelete {obj.CityId}");
        }

    }
}
