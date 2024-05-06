using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace UserDetailsPopup.Models
{
    public class Departments
    {
        [Key]
        public int DepartmentId {  get; set; }

        public string DepartmentName { get; set; }
        
           

    }
}