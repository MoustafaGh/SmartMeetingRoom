namespace SmartMeetingRoomApi.Dtos
{
    public class MoMDto
    {
        public int Id { get; set; }
        public int ScheduledMeetingId { get; set; }
        public int UserId { get; set; }
        public string? FilePath { get; set; } 
        public DateTime CreatedAt { get; set; }
    }

    public class CreateMoMDto
    {
        public required int ScheduledMeetingId { get; set; }
        public required int UserId { get; set; }
        public IFormFile File { get; set; } = null!;
    }

    public class UpdateMoMFileDto
    {
        public IFormFile File { get; set; } = null!;
    }

}
