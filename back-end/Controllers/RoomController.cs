using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMeetingRoomApi.Data;
using SmartMeetingRoomApi.Dtos;
using SmartMeetingRoomApi.Models;

namespace SmartMeetingRoomApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly SmartMeetingRoomApiDbContext _context;

        public RoomController(SmartMeetingRoomApiDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoomDto>>> GetRooms()
        {
            var rooms = await _context.Rooms
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Floor = r.Floor,
                    RoomNumber = r.RoomNumber,
                    Capacity = r.Capacity
                }).ToListAsync();
            return Ok(rooms);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDto>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();
            return Ok(new RoomDto
            {
                Id = room.Id,
                Name = room.Name,
                Floor = room.Floor,
                RoomNumber = room.RoomNumber,
                Capacity = room.Capacity
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<RoomDto>> CreateRoom(CreateRoomDto dto)
        {
            if (dto.Floor < 1 || dto.Floor > 26)
                return BadRequest("Floor must be between 1 and 26.");
            if (dto.RoomNumber < 1)
                return BadRequest("Room number must be positive.");
            char floorLetter = (char)('A' + dto.Floor - 1);
            string generatedName = $"{floorLetter}{dto.RoomNumber}";
            var room = new Room
            {
                Name = generatedName,
                Floor = dto.Floor,
                RoomNumber = dto.RoomNumber,
                Capacity = dto.Capacity
            };
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, new RoomDto
            {
                Id = room.Id,
                Name = room.Name,
                Floor = room.Floor,
                RoomNumber = room.RoomNumber,
                Capacity = room.Capacity
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRoom(int id, UpdateRoomDto dto)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();
            if (dto.Floor.HasValue)
            {
                if (dto.Floor.Value < 1 || dto.Floor.Value > 26)
                    return BadRequest("Floor must be between 1 and 26.");
                room.Floor = dto.Floor.Value;
            }
            if (dto.RoomNumber.HasValue)
            {
                if (dto.RoomNumber.Value < 1)
                    return BadRequest("Room number must be positive.");
                room.RoomNumber = dto.RoomNumber.Value;
            }
            if (dto.Floor.HasValue || dto.RoomNumber.HasValue)
            {
                char floorLetter = (char)('A' + room.Floor - 1);
                room.Name = $"{floorLetter}{room.RoomNumber}";
            }
            if (dto.Capacity.HasValue) room.Capacity = dto.Capacity.Value;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();
            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
