using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMeetingRoomApi.Data;
using SmartMeetingRoomApi.Dtos;
using SmartMeetingRoomApi.Models;

namespace SmartMeetingRoomApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoMController : ControllerBase
    {
        private readonly SmartMeetingRoomApiDbContext _context;
        private readonly IWebHostEnvironment _env;

        public MoMController(SmartMeetingRoomApiDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<List<MoMDto>>> GetAll()
        {
            var moms = await _context.MoMs
                .Select(m => new MoMDto
                {
                    Id = m.Id,
                    ScheduledMeetingId = m.ScheduledMeetingId,
                    UserId = m.UserId,
                    FilePath = m.FilePath,
                    CreatedAt = m.CreatedAt
                }).ToListAsync();

            return Ok(moms);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MoMDto>> GetById(int id)
        {
            var mom = await _context.MoMs.FindAsync(id);
            if (mom == null) return NotFound();

            return Ok(new MoMDto
            {
                Id = mom.Id,
                ScheduledMeetingId = mom.ScheduledMeetingId,
                UserId = mom.UserId,
                FilePath = mom.FilePath,
                CreatedAt = mom.CreatedAt
            });
        }

        [HttpPost]
        public async Task<ActionResult<MoMDto>> Create([FromForm] CreateMoMDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("No file provided");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "UploadedFiles");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var mom = new MoM
            {
                ScheduledMeetingId = dto.ScheduledMeetingId,
                UserId = dto.UserId,
                FilePath = fileName,
                CreatedAt = DateTime.UtcNow
            };

            _context.MoMs.Add(mom);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = mom.Id }, new MoMDto
            {
                Id = mom.Id,
                ScheduledMeetingId = mom.ScheduledMeetingId,
                UserId = mom.UserId,
                FilePath = mom.FilePath,
                CreatedAt = mom.CreatedAt
            });
        }

        [HttpPut("{id}/file")]
        public async Task<IActionResult> UpdateFile(int id, [FromForm] UpdateMoMFileDto dto)
        {
            var mom = await _context.MoMs.FindAsync(id);
            if (mom == null) return NotFound();

            
            if (!string.IsNullOrEmpty(mom.FilePath))
            {
                var oldPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "UploadedFiles", mom.FilePath);
                if (System.IO.File.Exists(oldPath))
                    System.IO.File.Delete(oldPath);
            }

            
            var fileName = $"{Guid.NewGuid()}_{dto.File.FileName}";
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "UploadedFiles");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var newPath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(newPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            mom.FilePath = fileName;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var mom = await _context.MoMs.FindAsync(id);
            if (mom == null) return NotFound();

            if (!string.IsNullOrEmpty(mom.FilePath))
            {
                var filePath = Path.Combine(_env.WebRootPath ?? "wwwroot", "UploadedFiles", mom.FilePath);
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.MoMs.Remove(mom);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
