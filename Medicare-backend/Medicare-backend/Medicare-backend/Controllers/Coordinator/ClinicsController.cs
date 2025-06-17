using Medicare_backend.DTOs;
using Medicare_backend.Services;
using Medicare_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Controllers.Coordinator
{
    [Route("api/coordinator/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireCoordinatorRole")]
    public class ClinicsController : ControllerBase
    {
        private readonly IClinicService _clinicService;

        public ClinicsController(IClinicService clinicService)
        {
            _clinicService = clinicService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClinicDto>>> GetAll()
        {
            var clinics = await _clinicService.GetAllAsync();
            return Ok(clinics);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClinicDto>> GetById(int id)
        {
            var clinic = await _clinicService.GetByIdAsync(id);
            if (clinic == null) return NotFound();
            return Ok(clinic);
        }

        [HttpPost]
        public async Task<ActionResult<ClinicDto>> Create(ClinicDto clinicDto)
        {
            var createdClinic = await _clinicService.CreateAsync(clinicDto);
            return CreatedAtAction(nameof(GetById), new { id = createdClinic.ClinicId }, createdClinic);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ClinicDto clinicDto)
        {
            if (id != clinicDto.ClinicId)
            {
                return BadRequest("ID không khớp");
            }

            var updated = await _clinicService.UpdateAsync(id, clinicDto);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _clinicService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
