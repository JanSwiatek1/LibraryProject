using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace LibraryAPI.Entities
{
    public class Author
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name can't be longer than 50 characters.")]
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public List<Book> Books { get; set; } = new();
        
    }
}
