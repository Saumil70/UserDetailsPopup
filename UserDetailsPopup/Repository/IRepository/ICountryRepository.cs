
using System.Xml.Serialization;
using UserDetailsPopup.Models;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface ICountryRepository : IRepository<Countries>
    {
        void Update(Countries obj);
        IEnumerable<Countries> CountryIndex();

        void CountryAdd(Countries obj);

        void CountryDelete(Countries obj);
    }
}
