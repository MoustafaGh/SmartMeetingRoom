namespace SmartMeetingRoomApi.Dtos
{
    public class RefreshTokenReqDto
    {
        public required string RefreshToken { get; set; }
        public required string Email { get; set; }
    }
}
