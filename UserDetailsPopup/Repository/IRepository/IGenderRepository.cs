using UserDetailsPopup.Models;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface IGenderRepository : IRepository<Genders>
    {
        void Update(Genders obj);
    }
}
