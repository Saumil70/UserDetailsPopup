using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserDetails.Repository;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Repository
{
    public class HobbyRepository : Repository<Hobbies>, IHobbyRepository
    {
        private EmployeeEntites _db;
        public HobbyRepository(EmployeeEntites db) : base(db)
        {
            _db = db;
        }


        public IEnumerable<Hobbies> HobbyList()
        {
            return _db.Hobbies.FromSqlRaw("exec HobbieList").ToList();
        }
    }
}
