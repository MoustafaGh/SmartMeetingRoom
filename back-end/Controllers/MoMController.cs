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

        public MoMController(SmartMeetingRoomApiDbContext context)
        {
            _context = context;
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
                    Summary = m.Summary,
                    Notes = m.Notes,
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
                Summary = mom.Summary,
                Notes = mom.Notes,
                CreatedAt = mom.CreatedAt
            });
        }

        [HttpPost]
        public async Task<ActionResult<MoMDto>> Create(CreateMoMDto dto)
        {
            var mom = new MoM
            {
                ScheduledMeetingId = dto.ScheduledMeetingId,
                UserId = dto.UserId,
                Summary = dto.Summary,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.MoMs.Add(mom);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = mom.Id }, new MoMDto
            {
                Id = mom.Id,
                ScheduledMeetingId = mom.ScheduledMeetingId,
                UserId = mom.UserId,
                Summary = mom.Summary,
                Notes = mom.Notes,
                CreatedAt = mom.CreatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateMoMDto dto)
        {
            var mom = await _context.MoMs.FindAsync(id);
            if (mom == null) return NotFound();

            mom.Summary = dto.Summary ?? mom.Summary;
            mom.Notes = dto.Notes ?? mom.Notes;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var mom = await _context.MoMs.FindAsync(id);
            if (mom == null) return NotFound();

            _context.MoMs.Remove(mom);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
