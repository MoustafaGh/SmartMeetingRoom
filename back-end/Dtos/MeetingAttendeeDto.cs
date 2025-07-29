namespace SmartMeetingRoomApi.Dtos
{
    public class MeetingAttendeeDto
    {
        public int Id { get; set; }
        public bool Status { get; set; }
        public int ScheduledMeetingId { get; set; }
        public int UserId { get; set; }
    }

    public class CreateMeetingAttendeeDto
    {
        public int ScheduledMeetingId { get; set; }
        public int UserId { get; set; }
    }

    public class UpdateMeetingAttendeeDto
    {
        public bool Status { get; set; }
    }
}
