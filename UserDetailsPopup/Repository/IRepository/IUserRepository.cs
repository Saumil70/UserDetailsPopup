
using UserDetailsPopup.Models;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface IUserRepository : IRepository<Employee>
    {
        void UserUpdate(Employee obj);

        IEnumerable<Employee> UserIndex();
        void UserAdd(Employee obj);

        void UserDelete(Employee obj);

    }
}
