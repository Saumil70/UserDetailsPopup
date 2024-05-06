using UserDetailsPopup.Repository.IRepository;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface IUnitOfWork
    {
        ICountryRepository CountryRepository { get; }

        IStateRepository StateRepository { get; }
        ICityRepository CityRepository { get; }

        IUserRepository UserRepository { get; }
        IDepartmentRepository DepartmentRepository { get; }   

        IHobbyRepository HobbyRepository { get; }
        IGenderRepository GenderRepository { get; }

        void Save();
    }
}
