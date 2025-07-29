using System.ComponentModel.DataAnnotations;

namespace SmartMeetingRoomApi.Dtos
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Floor { get; set; }
        public int RoomNumber { get; set; }
        public int Capacity { get; set; }
    }

    public class CreateRoomDto
    {
        [Required]
        public int Floor { get; set; }
        [Required]
        public int RoomNumber { get; set; }
        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }
    }

    public class UpdateRoomDto
    {
        public int? Floor { get; set; }
        public int? RoomNumber { get; set; }
        [Range(1, int.MaxValue)]
        public int? Capacity { get; set; }
    }
}
