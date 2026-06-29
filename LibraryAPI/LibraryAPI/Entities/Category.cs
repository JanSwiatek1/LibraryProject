using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Entities
{
    public class Category
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name can't be longer than 50 characters.")]
        public string Name { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }
        public ICollection<Book> Books { get; set; }
    }
}
