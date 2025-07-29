namespace SmartMeetingRoomApi.Dtos
{
    public class MoMDto
    {
        public int Id { get; set; }
        public int ScheduledMeetingId { get; set; }
        public int UserId { get; set; }
        public string? Summary { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateMoMDto
    {
        
        public required int ScheduledMeetingId { get; set; }
        public required int UserId { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class UpdateMoMDto
    {
        public string? Summary { get; set; }
        public string? Notes { get; set; }
    }
}
