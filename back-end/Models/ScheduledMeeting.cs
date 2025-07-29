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
        public MoM? MoMs { get; set; } // Navigation property to MoM

        [JsonIgnore]
        public Room? Room { get; set; } // Navigation property to Room 

        [JsonIgnore]
        public User? User { get; set; } // Navigation property to User who scheduled the meeting

        [JsonIgnore]
        public ICollection<MeetingAttendee>? MeetingAttendees { get; set; } // Navigation property to MeetingAttendee

        [JsonIgnore]
        public ICollection<Notification>? Notifications { get; set; } // Navigation property to Notification
    }
}
