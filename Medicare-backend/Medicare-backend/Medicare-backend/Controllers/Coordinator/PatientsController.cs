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
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;
        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            var patients = await _patientService.GetAllAsync();
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetById(int id)
        {
            var patient = await _patientService.GetByIdAsync(id);
            if (patient == null) return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        public async Task<ActionResult<PatientDto>> Create(PatientDto patientDto)
        {
            var createdPatient = await _patientService.CreateAsync(patientDto);
            return CreatedAtAction(nameof(GetById), new { id = createdPatient.PatientId }, createdPatient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PatientDto patientDto)
        {
            if (id != patientDto.PatientId)
            {
                return BadRequest("ID không khớp");
            }

            var updated = await _patientService.UpdateAsync(id, patientDto);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _patientService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
