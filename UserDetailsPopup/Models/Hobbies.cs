using System.ComponentModel.DataAnnotations;

namespace UserDetailsPopup.Models
{
    public class Hobbies
    {
        [Key]
        public int HobbyId { get; set; }  
        public string HobbyName { get; set; }
    }
}
