using LibraryAPI.DTO;
using LibraryAPI.Entities;
using LibraryAPI.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthorController : ControllerBase
    {
        private readonly LibraryDbContext _context;
        public AuthorController(LibraryDbContext context)
        {
            _context = context;

        }

        [HttpGet(Name = "authors")]
        public async Task<IActionResult> GetAllAuthors()
        {
            var authors = await _context.Authors.ToListAsync();
            if (authors == null || !authors.Any())
            {
                return NotFound("No authors found.");
            }
            return Ok(authors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuthor(int id)
        {
            var author = await _context.Authors.FirstOrDefaultAsync(a => a.Id == id);
            return author != null ? Ok(author) : NotFound("No author found.");
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AuthorDTO dto)
        {
            var author = new Author()
            {
                Name = dto.Name
            };
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound("Author not found.");
            }
            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();
            return Ok();

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] AuthorDTO dto)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound("Author not found.");
            }

            author.Name = dto.Name;
            await _context.SaveChangesAsync();

            return NoContent(); 
        }
    }
}
