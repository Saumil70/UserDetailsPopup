using UserDetailsPopup.Models;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface IHobbyRepository : IRepository<Hobbies>
    {
        
        IEnumerable<Hobbies> HobbyList();


    }

}
