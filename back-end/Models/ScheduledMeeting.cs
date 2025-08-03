using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class ScheduledMeeting
    {
        public int Id { get; set; }
        public int RoomId { get; set; } 
        public int UserId { get; set; } 
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }



        [JsonIgnore]
        public ICollection<MoM>? MoMs { get; set; }

        [JsonIgnore]
        public Room? Room { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public ICollection<MeetingAttendee>? MeetingAttendees { get; set; }

        [JsonIgnore]
        public ICollection<Notification>? Notifications { get; set; }
    }
}
