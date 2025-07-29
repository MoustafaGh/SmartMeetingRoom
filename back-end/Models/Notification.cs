using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int ScheduledMeetingId { get; set; } 
        public int UserId { get; set; } 
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
        public bool IsRead { get; set; } = false; 

        [JsonIgnore]
        public User? Users { get; set; } 

        [JsonIgnore]
        public ScheduledMeeting? ScheduledMeeting { get; set; } 

    }
}
