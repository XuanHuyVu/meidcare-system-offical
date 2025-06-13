using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare_backend.Controllers.Coordinator
{
    [Route("api/coordinator")]
    [ApiController]
    [Authorize(Policy = "RequireCoordinatorRole")]
    public class CoordinatorController : ControllerBase
    {
        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            return Ok("Bạn đang truy cập với vai trò Coordinator");
        }
    }
}
