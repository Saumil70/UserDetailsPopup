using UserDetails.Repository;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Repository
{
    public class DepartmentRepository: Repository<Departments>, IDepartmentRepository
    {
        private EmployeeEntites _db;
        public DepartmentRepository(EmployeeEntites db) : base(db)
        {
            _db = db;
        }


        public void Update(Departments obj)
        {
           Update(obj);
        }
    }
}
