using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public  string? FirstName { get; set; }
        public  string? LastName { get; set; }
        public string? UserName { get; set; } 
        public string? Email { get; set; }
        public string? PasswordHash { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default to current time
        public bool IsActive { get; set; } = true; 
        public string? Role { get; set; }
        public string? RefreshToken { get; set; } 
        public DateTime? RefreshTokenExpiryTime { get; set; }


        [JsonIgnore]
        public ICollection<ScheduledMeeting>? ScheduledMeetings { get; set; }

        [JsonIgnore]
        public ICollection<Notification>? Notifications { get; set; }

        [JsonIgnore]
        public ICollection<MoM>? MoMs { get; set; }

        [JsonIgnore]
        public ICollection<MeetingAttendee>? MeetingAttendees { get; set; } // Navigation property to MeetingAttendee
    }
}
