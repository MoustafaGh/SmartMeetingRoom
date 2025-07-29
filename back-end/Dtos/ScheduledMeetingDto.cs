using System.ComponentModel.DataAnnotations;

namespace SmartMeetingRoomApi.Dtos
{
    public class ScheduledMeetingDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; } 
    }


    public class CreateScheduledMeetingDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        public int RoomId { get; set; }
        [Required]
        public int UserId { get; set; }
    }


    public class UpdateScheduledMeetingDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? RoomId { get; set; }  

    }

}
