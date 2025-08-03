using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class MeetingAttendee
    {
        public int Id { get; set; }
        public bool Status { get; set; } = false;
        public int ScheduledMeetingId { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public ScheduledMeeting? ScheduledMeeting { get; set; }

        [JsonIgnore]
        public User? Users { get; set; }
    }
}
