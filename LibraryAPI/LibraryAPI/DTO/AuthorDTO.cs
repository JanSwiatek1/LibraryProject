using System.ComponentModel.DataAnnotations;
namespace LibraryAPI.DTO
{
    public class AuthorDTO
    {
        [Required]
        public string Name { get; set; }
    }
    
}
