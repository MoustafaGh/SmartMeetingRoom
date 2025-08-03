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
        }

        [HttpPost]
        public async Task<ActionResult<ScheduledMeetingDto>> CreateScheduledMeeting([FromBody] CreateScheduledMeetingDto dto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists)
                return BadRequest(new { error = $"User with ID {dto.UserId} does not exist." });

            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Name == dto.RoomName);
            if (room == null)
                return BadRequest(new { error = $"Room with name '{dto.RoomName}' does not exist." });

            var endDateTime = dto.StartTime.Date.Add(dto.EndTime.TimeOfDay);
            if (endDateTime <= dto.StartTime)
                return BadRequest(new { error = "End time must be after start time." });

            bool roomConflict = await _context.ScheduledMeetings.AnyAsync(m =>
                m.RoomId == room.Id &&
                m.StartTime < endDateTime &&
                m.EndTime > dto.StartTime);

            if (roomConflict)
                return BadRequest(new { error = "This room is already booked during the selected time range." });

            bool creatorConflict = await _context.ScheduledMeetings.AnyAsync(m =>
                m.UserId == dto.UserId &&
                m.StartTime < endDateTime &&
                m.EndTime > dto.StartTime);

            if (creatorConflict)
                return BadRequest(new { error = "You already have a meeting during the selected time." });

            if (dto.InvitedUserIds is { Count: > 0 })
            {
                foreach (var invitedUserId in dto.InvitedUserIds)
                {
                    bool invitedConflict = await _context.MeetingAttendees
                        .Include(ma => ma.ScheduledMeeting)
                        .AnyAsync(ma =>
                            ma.UserId == invitedUserId &&
                            ma.ScheduledMeeting!.StartTime < endDateTime &&
                            ma.ScheduledMeeting.EndTime > dto.StartTime);

                    if (invitedConflict)
                        return BadRequest(new { error = $"User ID {invitedUserId} has a time conflict with another meeting." });
                }
            }

            var meeting = new ScheduledMeeting
            {
                Title = dto.Title,
                Description = dto.Description,
                StartTime = dto.StartTime,
                EndTime = endDateTime,
                RoomId = room.Id,
                UserId = dto.UserId
            };

            _context.ScheduledMeetings.Add(meeting);
            await _context.SaveChangesAsync();

            if (dto.InvitedUserIds is { Count: > 0 })
            {
                foreach (var invitedUserId in dto.InvitedUserIds)
                {
                    if (invitedUserId == dto.UserId) continue;

                    _context.MeetingAttendees.Add(new MeetingAttendee
                    {
                        UserId = invitedUserId,
                        ScheduledMeetingId = meeting.Id,
                    });

                    _context.Notifications.Add(new Notification
                    {
                        ScheduledMeetingId = meeting.Id,
                        UserId = invitedUserId,
                        Message = $"You have been invited to: {dto.Title}",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false
                    });
                }

                await _context.SaveChangesAsync();
            }



            return CreatedAtAction(nameof(GetScheduledMeeting), new { id = meeting.Id }, new ScheduledMeetingDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                StartTime = meeting.StartTime,
                EndTime = meeting.EndTime,
                RoomId = room.Id,
                UserId = dto.UserId
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

            var attendees = await _context.MeetingAttendees
                .Where(a => a.ScheduledMeetingId == id)
                .ToListAsync();

            foreach (var attendee in attendees)
            {
                _context.Notifications.Add(new Notification
                {
                    ScheduledMeetingId = id,
                    UserId = attendee.UserId,
                    Message = $"Meeting '{meeting.Title}' has been updated.",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false
                });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScheduledMeeting(int id)
        {
            var meeting = await _context.ScheduledMeetings.FindAsync(id);
            if (meeting == null) return NotFound();

            var attendees = await _context.MeetingAttendees
                .Where(a => a.ScheduledMeetingId == id)
                .ToListAsync();

            foreach (var attendee in attendees)
            {
                _context.Notifications.Add(new Notification
                {
                    ScheduledMeetingId = id,
                    UserId = attendee.UserId,
                    Message = $"Meeting '{meeting.Title}' has been canceled.",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false
                });
            }

            _context.ScheduledMeetings.Remove(meeting);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
