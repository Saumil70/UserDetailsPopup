using Microsoft.EntityFrameworkCore;

using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetails.Repository
{
    public class UserRepository : Repository<Employee>, IUserRepository
    {
        private EmployeeEntites _db;
        public UserRepository(EmployeeEntites db) : base(db)
        {
            _db = db;
        }
        public void UserUpdate(Employee obj)
        {
            _db.Database.ExecuteSqlRaw($"UserUpdate '{obj.EmployeeId}','{obj.Name}','{obj.Email}','{obj.Address}','{obj.Hobbies}',{obj.DepartmentId},{obj.GenderId},{obj.CountryId},{obj.StateId},{obj.CityId},'{obj.ImageUrl}'");
        }

        public IEnumerable<Employee> UserIndex()
        {
            // Execute the stored procedure to get States
            var employees = _db.Employees.FromSqlRaw("exec UserIndex").ToList();

            // Load related Country entities for each State
            foreach (var emp in employees)
            {
                _db.Entry(emp)
                    .Reference(s => s.Department)
                    .Load();
                _db.Entry(emp)
                    .Reference(s => s.Gender)
                    .Load();
                _db.Entry(emp)
                    .Reference(s => s.Country)
                    .Load();
                _db.Entry(emp)
                    .Reference(s => s.States)
                    .Load();
                _db.Entry(emp)
                    .Reference(s => s.Cities)
                    .Load();

            }

            return employees;
        }

        public void UserAdd(Employee obj)
        {
            _db.Database.ExecuteSqlRaw($"UserCreate '{obj.Name}','{obj.Email}','{obj.Address}','{obj.Hobbies}',{obj.DepartmentId},{obj.GenderId},{obj.CountryId},{obj.StateId},{obj.CityId},'{obj.ImageUrl}'");
        }

        public void UserDelete(Employee obj)
        {
            _db.Database.ExecuteSqlRaw($"UserDelete {obj.EmployeeId}");
        }
    }
}
