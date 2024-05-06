using UserDetails.Repository;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Repository
{
    public class GenderRepository: Repository<Genders>, IGenderRepository
    {
        private EmployeeEntites _db;
        public GenderRepository(EmployeeEntites db) : base(db)
        {
            _db = db;
        }


        public void Update(Genders obj)
        {
           Update(obj);
        }
    }
}
