using SmartMeetingRoomApi.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public required string Role { get; set; }

    }

    public class CreateUserDto
    {
        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public required string Role { get; set; }
        
    }

    public class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UserLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
