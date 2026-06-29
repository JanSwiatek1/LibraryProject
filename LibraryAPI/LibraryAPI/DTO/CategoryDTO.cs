using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class CategoryDTO
    {
        [Required]
        public string Name { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
    }
}
