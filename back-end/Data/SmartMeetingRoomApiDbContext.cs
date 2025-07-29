using Microsoft.EntityFrameworkCore;
using SmartMeetingRoomApi.Models;

namespace SmartMeetingRoomApi.Data
{
    public class SmartMeetingRoomApiDbContext(DbContextOptions<SmartMeetingRoomApiDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<ScheduledMeeting> ScheduledMeetings { get; set; } = null!;
        public DbSet<MeetingAttendee> MeetingAttendees { get; set; } = null!;
        public DbSet<MoM> MoMs { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
    }
}
