using SmartMeetingRoomApi.Dtos;
using SmartMeetingRoomApi.Models;

namespace SmartMeetingRoomApi.services
{
    public interface IAuthService
    {
        Task<User?> CreateUser(CreateUserDto request);
        Task<TokenResponseDto?> Login(UserLoginDto request);
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenReqDto request);
        Task<bool> LogoutAsync(RefreshTokenReqDto request);
    }
}
