
using UserDetailsPopup.Models;

namespace UserDetailsPopup.Repository.IRepository
{
    public interface IStateRepository : IRepository<State>
    {
        void Update(State obj);
        IEnumerable<State> StateIndex();
        void StateAdd(State obj);

        void StateDelete(State obj);

    }
}
