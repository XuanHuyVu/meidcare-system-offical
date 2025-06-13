using Medicare_backend.DTOs;

namespace Medicare_backend.Services
{
    public interface IAuthService
    {
        Task<string?> Register(UserDto dto);
        Task<string?> Login(UserDto dto);
    }
}
