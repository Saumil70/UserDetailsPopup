using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserDetailsPopup.Models;
using UserDetailsPopup;





namespace UserDetails.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly EmployeeEntites _db;
        
        internal DbSet<T> dbSet;

        public Repository(EmployeeEntites db)
        {
            _db = db;
            this.dbSet = _db.Set<T>();
            _db.States.Include(u => u.Country).Include(u => u.CountryId);
            _db.Cities.Include(u => u.States);
            _db.Employees.Include(u=> u.Country).Include(u => u.States).Include(u => u.Cities).Include(u=> u.Gender).Include(u=> u.Department);
            
        }

        public void Add(T entity)
        {
            dbSet.Add(entity);
        }

        public T Get(Expression<Func<T, bool>> filter, string? includeProperties = null, bool tracked = false)
        {
            IQueryable<T> query;

            if (tracked)
            {

                query = dbSet;

            }
            else
            {
                query = dbSet.AsNoTracking();
            }
            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProp in includeProperties
                    .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }
            return query.FirstOrDefault();
        }

        public IEnumerable<T> GetAll(Expression<Func<T, bool>>? filter = null, string? includeProperties = null)
        {
            IQueryable<T> query = dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProp in includeProperties
                    .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }
            return query.ToList();
        }

        public void Remove(T entity)
        {
            dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            dbSet.RemoveRange(entities);
        }
    }
}
