
using Microsoft.EntityFrameworkCore;
using UserDetailsPopup.Models;
using UserDetailsPopup.Repository.IRepository;

namespace UserDetails.Repository
{
    public class StateRepository : Repository<State>, IStateRepository
    {
        private EmployeeEntites _db;
        public StateRepository(EmployeeEntites db) : base(db)
        {
            _db = db;
        }
        public void Update(State obj)
        {
            _db.Database.ExecuteSqlRaw($"StateUpdate {obj.StateId},{obj.StateName},{obj.CountryId}");
        }
        public IEnumerable<State> StateIndex()
        {
            // Execute the stored procedure to get States
            var states = _db.States.FromSqlRaw("exec StateIndex").ToList();

            // Load related Country entities for each State
            foreach (var state in states)
            {
                _db.Entry(state)
                    .Reference(s => s.Country)
                    .Load();
            }

            return states;
        }

        public void StateAdd(State obj)
        {
            _db.Database.ExecuteSqlRaw($"StateCreate {obj.StateName},{obj.CountryId}");
        }

        public void StateDelete(State obj)
        {
            _db.Database.ExecuteSqlRaw($"StateDelete {obj.StateId}");
        }

    }
}
