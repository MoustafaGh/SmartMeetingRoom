using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class MoM
    {
        public int Id { get; set; }
        public int ScheduledMeetingId { get; set; }
        public int UserId { get; set; }
        public string? FilePath { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public ScheduledMeeting? ScheduledMeeting { get; set; }
    }

}
