using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class MoM
    {
        public int Id { get; set; }
        public int ScheduledMeetingId { get; set; } // Foreign key to ScheduledMeeting
        public int UserId { get; set; } // User who created the MoM , FK fom User table
        public string? Summary { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default to current time

        [JsonIgnore]
        public User? User { get; set; } // Navigation property to User who created the MoM

        [JsonIgnore]
        public ScheduledMeeting? ScheduledMeeting { get; set; } // Navigation property to ScheduledMeeting
    }
}
