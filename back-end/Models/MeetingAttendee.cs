using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class MeetingAttendee
    {
        public int Id { get; set; }
        public bool Status { get; set; } = false; // Default value is false
        public int ScheduledMeetingId { get; set; } // Foreign key to ScheduledMeeting
        public int UserId { get; set; } // Foreign key to User

        [JsonIgnore]
        public ScheduledMeeting? ScheduledMeeting { get; set; } // Navigation property to ScheduledMeeting

        [JsonIgnore]
        public User? Users { get; set; } // Navigation property to User
    }
}
