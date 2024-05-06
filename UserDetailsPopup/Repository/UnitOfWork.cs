

using UserDetailsPopup.Models;
using UserDetailsPopup.Repository;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetails.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private EmployeeEntites _db;
        public ICountryRepository CountryRepository { get; private set; }

        public IStateRepository StateRepository { get; private set; }

        public ICityRepository CityRepository { get; private set; }

        public IUserRepository UserRepository { get; private set; }

        public IDepartmentRepository DepartmentRepository { get; private set; }   
        public IHobbyRepository HobbyRepository { get; private set; }
        public IGenderRepository GenderRepository { get; private set; }

        public UnitOfWork(EmployeeEntites db)
        {
            _db = db;
            CountryRepository = new CountryRepository(_db);
            StateRepository = new StateRepository(_db);
            CityRepository = new CityRepository(_db);
            UserRepository = new UserRepository(_db);
            DepartmentRepository = new DepartmentRepository(_db);
            HobbyRepository = new HobbyRepository(_db);
            GenderRepository = new GenderRepository(_db);   
        }
        

        public void Save()
        {
            _db.SaveChanges();
        }
    }
}
