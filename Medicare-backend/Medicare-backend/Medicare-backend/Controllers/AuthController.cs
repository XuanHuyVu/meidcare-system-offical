using Medicare_backend.DTOs;
using Medicare_backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Medicare_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto dto)
        {
            var token = await _authService.Register(dto);
            if (token is null)
                return BadRequest("User already exists.");
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto dto)
        {
            var token = await _authService.Login(dto);
            if (token is null)
                return Unauthorized("Invalid credentials.");
            return Ok(new { token });
        }
    }
}
