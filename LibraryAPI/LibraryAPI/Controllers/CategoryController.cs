using LibraryAPI.DTO;
using LibraryAPI.Entities;
using LibraryAPI.Infra;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {

        private readonly LibraryDbContext _context;
        public CategoryController(LibraryDbContext context)
        {
            _context = context;

        }
        [HttpGet(Name = "categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            if (!categories.Any())
            {
                return NotFound("No categories found.");
            }
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound("Category not found.");
            }

            return Ok(category);
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CategoryDTO dto)
        {
            var category = new Category()
            {
                Name = dto.Name,
                Description = dto.Description,
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok();

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CategoryDTO dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }

            category.Name = dto.Name;
            category.Description = dto.Description;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
