using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMeetingRoomApi.Data;
using SmartMeetingRoomApi.Dtos;
using SmartMeetingRoomApi.Models;

namespace SmartMeetingRoomApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduledMeetingController : ControllerBase
    {
        private readonly SmartMeetingRoomApiDbContext _context;

        public ScheduledMeetingController(SmartMeetingRoomApiDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<ScheduledMeetingDto>>> GetScheduledMeetings()
        {
            var meetings = await _context.ScheduledMeetings
                .Select(m => new ScheduledMeetingDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    StartTime = m.StartTime,
                    EndTime = m.EndTime,
                    RoomId = m.RoomId,
                    UserId = m.UserId
                }).ToListAsync();

            return Ok(meetings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduledMeetingDto>> GetScheduledMeeting(int id)
        {
            var m = await _context.ScheduledMeetings.FindAsync(id);
            if (m == null) return NotFound();

            return Ok(new ScheduledMeetingDto
            {
                Id = m.Id,
                Title = m.Title,
                Description = m.Description,
                StartTime = m.StartTime,
                EndTime = m.EndTime,
                RoomId = m.RoomId,
                UserId = m.UserId
            });
            //return Ok(m);
        }

        [HttpPost]
        public async Task<ActionResult<ScheduledMeetingDto>> CreateScheduledMeeting([FromBody] CreateScheduledMeetingDto dto)
        {
            var roomExists = await _context.Rooms.AnyAsync(r => r.Id == dto.RoomId);
            if (!roomExists)
                return BadRequest(new { error = $"Room with ID {dto.RoomId} does not exist." });

            // Combine EndTime time with StartTime date
            var endDateTime = dto.StartTime.Date.Add(dto.EndTime.TimeOfDay);

            if (endDateTime <= dto.StartTime)
                return BadRequest(new { error = "End time must be after start time." });

            var meeting = new ScheduledMeeting
            {
                Title = dto.Title,
                Description = dto.Description,
                StartTime = dto.StartTime,
                EndTime = endDateTime,
                RoomId = dto.RoomId,
                UserId = dto.UserId
            };

            _context.ScheduledMeetings.Add(meeting);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetScheduledMeeting), new { id = meeting.Id }, new ScheduledMeetingDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                StartTime = meeting.StartTime,
                EndTime = meeting.EndTime,
                RoomId = meeting.RoomId,
                UserId = meeting.UserId
            });
        }





        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScheduledMeeting(int id, UpdateScheduledMeetingDto dto)
        {
            var meeting = await _context.ScheduledMeetings.FindAsync(id);
            if (meeting == null) return NotFound();

            if (dto.Title != null) meeting.Title = dto.Title;
            if (dto.Description != null) meeting.Description = dto.Description;
            if (dto.StartTime.HasValue) meeting.StartTime = dto.StartTime.Value;
            if (dto.EndTime.HasValue) meeting.EndTime = dto.EndTime.Value;
            if (dto.RoomId.HasValue) meeting.RoomId = dto.RoomId.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScheduledMeeting(int id)
        {
            var meeting = await _context.ScheduledMeetings.FindAsync(id);
            if (meeting == null) return NotFound();

            _context.ScheduledMeetings.Remove(meeting);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
