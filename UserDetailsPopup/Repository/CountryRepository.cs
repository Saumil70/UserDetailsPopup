using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.Linq.Expressions;

using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetails.Repository
{
    public class CountryRepository : Repository<Countries>, ICountryRepository
    {
        private EmployeeEntites _db;
        public CountryRepository(EmployeeEntites db) : base(db)
        {
            _db = db;
        }


        public void Update(Countries obj)
        {
            _db.Database.ExecuteSqlRaw($"CountryUpdate {obj.CountryId},{obj.CountryName}");
        }

        public IEnumerable<Countries> CountryIndex()
        {
            return _db.Countries.FromSqlRaw("exec CountryIndex").ToList();
           
        }

        public void CountryAdd(Countries obj)
        {
            _db.Database.ExecuteSqlRaw($"CountryCreate {obj.CountryName}");
        }
        
        public void CountryDelete(Countries obj)
        {
            _db.Database.ExecuteSqlRaw($"CountryDelete {obj.CountryId}");
        }


    }
}
