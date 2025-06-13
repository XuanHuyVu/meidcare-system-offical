using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare_backend.Controllers.Patient
{
    [Route("api/patient")]
    [ApiController]
    [Authorize(Policy = "RequirePatientRole")]
    public class PatientController : ControllerBase
    {
        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            return Ok("Bạn là bệnh nhân");
        }
    }
}
