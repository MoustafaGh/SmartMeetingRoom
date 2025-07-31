namespace SmartMeetingRoomApi.Dtos
{
    public class TokenResponseDto
    {
        public required string? AccessToken { get; set; }
        public required string? RefreshToken { get; set; }

        public int Id { get; set; }
    }
}
