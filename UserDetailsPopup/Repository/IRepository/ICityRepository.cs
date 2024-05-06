
using UserDetails;
using UserDetailsPopup.Models;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface ICityRepository : IRepository<City>
    {
        void Update(City obj);
      
        IEnumerable<City> CityIndex();
        void CityAdd(City obj);

        void CityDelete(City obj);

    }
}
