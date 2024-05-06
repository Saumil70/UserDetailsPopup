using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using UserDetailsPopup.Models;

namespace UserDetailsPopup.Models
{
    public class EmployeeEntites : DbContext
    {
        public EmployeeEntites(DbContextOptions<EmployeeEntites> options) : base(options)
        {

        }


        public DbSet<Employee> Employees { get; set; }  
        public DbSet<Departments> Departments { get; set; }  

        public DbSet<Countries> Countries { get; set; }   
        public DbSet<Genders> Genders { get; set; }  
        public DbSet<State> States { get; set; }

        public DbSet<City> Cities { get; set; } 

        public Employee Employee {  get; set; }

        public DbSet<Hobbies> Hobbies { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }


    }
}