using LibraryAPI.DTO;
using LibraryAPI.Entities;
using LibraryAPI.Infra;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        private readonly LibraryDbContext _context;
        public BookController(LibraryDbContext context)
        {
            _context = context;

        }

        [HttpGet(Name = "Books")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _context.Books
                .Include(a => a.Author)
                .Include(b => b.Category)
                .ToListAsync();
            
            if (!books.Any())
            {
                return NotFound("No books found.");
            }
            var result = books.Select(book => new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,

                AuthorId = book.AuthorId,
                CategoryId = book.CategoryId,

                AuthorName = book.Author.Name,
                CategoryName = book.Category.Name
            });
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id) 
        {
            var book = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            var result = new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,

                AuthorId = book.AuthorId,
                CategoryId = book.CategoryId,

                AuthorName = book.Author.Name,
                CategoryName = book.Category.Name
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BookDTO dto)
        {
            var errors = await ValidateAuthorAndCategoryAsync(dto.AuthorId, dto.CategoryId);
            if (errors.Any())
            {
                return BadRequest(errors);
            }

            var book = new Book()
            {
                Title = dto.Title,
                AuthorId=dto.AuthorId,
                CategoryId=dto.CategoryId
            };
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            var author = await _context.Authors.FindAsync(book.AuthorId);
            var category = await _context.Categories.FindAsync(book.CategoryId);
            var result = new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                AuthorId = book.AuthorId,
                CategoryId = book.CategoryId,
                AuthorName = author.Name,
                CategoryName = category.Name
            };

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, result);

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] BookDTO dto)
        {
            var errors = await ValidateAuthorAndCategoryAsync(dto.AuthorId, dto.CategoryId);
            if (errors.Any())
            {
                return BadRequest(errors);
            }

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            book.Title = dto.Title;
            book.AuthorId = dto.AuthorId;
            book.CategoryId = dto.CategoryId;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private async Task<List<string>> ValidateAuthorAndCategoryAsync(int authorId, int categoryId)
        {
            var errors = new List<string>();

            var authorExists = await _context.Authors.AnyAsync(a => a.Id == authorId);
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == categoryId);

            if (!authorExists) errors.Add("Author does not exist.");
            if (!categoryExists) errors.Add("Category does not exist.");

            return errors;
        }
    }
}
