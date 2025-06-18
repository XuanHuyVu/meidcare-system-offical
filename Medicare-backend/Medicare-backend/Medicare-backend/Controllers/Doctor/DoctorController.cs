using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare_backend.Controllers.Doctor
{
    [Route("api/doctor")]
    [ApiController]
    [Authorize(Policy = "RequireDoctorRole")]
    public class DoctorController : ControllerBase
    {
        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            return Ok("Bạn là bác sĩ");
        }
    }
}
