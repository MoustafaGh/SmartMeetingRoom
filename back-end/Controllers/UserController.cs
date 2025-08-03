using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMeetingRoomApi.Data;
using SmartMeetingRoomApi.Dtos;
using SmartMeetingRoomApi.Models;
using SmartMeetingRoomApi.services;
using System.Security.Claims;

namespace SmartMeetingRoomApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly SmartMeetingRoomApiDbContext _context;
        private readonly IAuthService _authService;

        public UserController(SmartMeetingRoomApiDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        private (bool IsValid, string Message) ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
                return (false, "Password must be at least 8 characters long.");
            if (!password.Any(char.IsUpper))
                return (false, "Password must contain at least one uppercase letter.");
            if (!password.Any(char.IsLower))
                return (false, "Password must contain at least one lowercase letter.");
            if (!password.Any(char.IsDigit))
                return (false, "Password must contain at least one number.");
            if (!password.Any(ch => "!@#$%^&*(),.?\":{}|<>".Contains(ch)))
                return (false, "Password must contain at least one special character.");

            return (true, "Strong password.");
        }

        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            var users = await _context.Users.Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                UserName = u.UserName,
                Email = u.Email,
                IsActive = u.IsActive,
                Role = u.Role
            }).ToListAsync();

            return Ok(users);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var u = await _context.Users.FindAsync(id);
            if (u == null) return NotFound();

            return Ok(new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                UserName = u.UserName,
                Email = u.Email,
                IsActive = u.IsActive,
                Role = u.Role
            });
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            try
            {
                var user = await _authService.CreateUser(dto);
                if (user == null)
                    return Conflict("User with this email already exists.");

                var userDto = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName!,
                    LastName = user.LastName!,
                    Email = user.Email!,
                    Role = user.Role!,
                    IsActive = user.IsActive,
                    UserName = user.UserName
                };

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Password))
            {
                var (isValid, message) = ValidatePassword(dto.Password);
                if (!isValid)
                    return BadRequest(new { error = message });

                user.PasswordHash = new PasswordHasher<User>().HashPassword(user, dto.Password);
            }

            if (!string.IsNullOrEmpty(dto.Email) && dto.Email != user.Email)
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id);
                if (emailExists)
                    return Conflict(new { error = "Email already exists. Please use another email." });

                user.Email = dto.Email;
            }

            if (!string.IsNullOrEmpty(dto.FirstName) || !string.IsNullOrEmpty(dto.LastName))
            {
                var newFirstName = string.IsNullOrEmpty(dto.FirstName) ? user.FirstName : dto.FirstName;
                var newLastName = string.IsNullOrEmpty(dto.LastName) ? user.LastName : dto.LastName;
                var newUserName = $"{newFirstName} {newLastName}";

                var nameExists = await _context.Users.AnyAsync(u => u.UserName == newUserName && u.Id != id);
                if (nameExists)
                    return Conflict(new { error = "A user with this name already exists. Please choose another name." });

                user.FirstName = newFirstName;
                user.LastName = newLastName;
                user.UserName = newUserName;
            }

            if (!string.IsNullOrEmpty(dto.Role)) user.Role = dto.Role;
            if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenResponseDto>> Login(UserLoginDto dto)
        {
            var token = await _authService.Login(dto);
            if (token == null)
                return Unauthorized("Invalid email or password.");

            return Ok(token);
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenReqDto request)
        {
            var result = await _authService.RefreshTokenAsync(request);
            if (result == null)
                return Unauthorized("Invalid refresh token");

            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout(RefreshTokenReqDto request)
        {
            var result = await _authService.LogoutAsync(request);
            if (!result)
                return BadRequest("Invalid refresh token");

            return Ok(new { message = "Logged out successfully" });
        }
    }
}
