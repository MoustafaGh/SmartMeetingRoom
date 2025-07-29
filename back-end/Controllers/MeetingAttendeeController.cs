using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMeetingRoomApi.Data;
using SmartMeetingRoomApi.Dtos;
using SmartMeetingRoomApi.Models;

namespace SmartMeetingRoomApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingAttendeeController : ControllerBase
    {
        private readonly SmartMeetingRoomApiDbContext _context;

        public MeetingAttendeeController(SmartMeetingRoomApiDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<MeetingAttendeeDto>>> GetAll()
        {
            var attendees = await _context.MeetingAttendees
                .Select(a => new MeetingAttendeeDto
                {
                    Id = a.Id,
                    Status = a.Status,
                    ScheduledMeetingId = a.ScheduledMeetingId,
                    UserId = a.UserId
                }).ToListAsync();

            return Ok(attendees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MeetingAttendeeDto>> GetById(int id)
        {
            var attendee = await _context.MeetingAttendees.FindAsync(id);
            if (attendee == null) return NotFound();

            return Ok(new MeetingAttendeeDto
            {
                Id = attendee.Id,
                Status = attendee.Status,
                ScheduledMeetingId = attendee.ScheduledMeetingId,
                UserId = attendee.UserId
            });
        }

        [HttpPost]
        public async Task<ActionResult<MeetingAttendeeDto>> Create(CreateMeetingAttendeeDto dto)
        {
            var attendee = new MeetingAttendee
            {
                ScheduledMeetingId = dto.ScheduledMeetingId,
                UserId = dto.UserId,
                Status = false
            };

            _context.MeetingAttendees.Add(attendee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = attendee.Id }, new MeetingAttendeeDto
            {
                Id = attendee.Id,
                Status = attendee.Status,
                ScheduledMeetingId = attendee.ScheduledMeetingId,
                UserId = attendee.UserId
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateMeetingAttendeeDto dto)
        {
            var attendee = await _context.MeetingAttendees.FindAsync(id);
            if (attendee == null) return NotFound();

            attendee.Status = dto.Status;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var attendee = await _context.MeetingAttendees.FindAsync(id);
            if (attendee == null) return NotFound();

            _context.MeetingAttendees.Remove(attendee);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
