using UserDetailsPopup.Models;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface IDepartmentRepository : IRepository<Departments>
    {
        void Update(Departments obj);
    }
}
