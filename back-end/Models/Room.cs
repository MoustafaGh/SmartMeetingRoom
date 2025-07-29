using System.Text.Json.Serialization;

namespace SmartMeetingRoomApi.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Floor { get; set; }
        public int RoomNumber { get; set; }
        public int Capacity { get; set; }


        [JsonIgnore]
        public ICollection<ScheduledMeeting>? ScheduledMeetings { get; set; }
    }
}
