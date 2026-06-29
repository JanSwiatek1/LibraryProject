using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTO
{
    public class BookResponseDTO
    {
        public int Id { get; set; }
        [Required]

        public string Title { get; set; }

        public int AuthorId { get; set; }

        public int CategoryId { get; set; }

        public string AuthorName { get; set; }

        public string CategoryName { get; set; }
    }
}
