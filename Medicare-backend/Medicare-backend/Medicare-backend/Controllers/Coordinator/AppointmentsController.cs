using Medicare_backend.DTOs;
using Medicare_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Medicare_backend.Controllers.Coordinator
{
    [Route("api/coordinator/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireCoordinatorRole")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            try
            {
                var appointments = await _appointmentService.GetAllAsync();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi lấy danh sách lịch hẹn: {ex.Message}" });
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetById(int id)
        {
            var appointment = await _appointmentService.GetByIdAsync(id);
            if (appointment == null) return NotFound();
            return Ok(appointment);
        }
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByPatientId(int patientId)
        {
            var appointments = await _appointmentService.GetByPatientIdAsync(patientId);
            return Ok(appointments);
        }
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByDoctorId(int doctorId)
        {
            var appointments = await _appointmentService.GetByDoctorIdAsync(doctorId);
            return Ok(appointments);
        }
        [HttpGet("clinic/{clinicId}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByClinicId(int clinicId)
        {
            var appointments = await _appointmentService.GetByClinicIdAsync(clinicId); 
            return Ok(appointments);
        }
        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> Create(AppointmentDto dto)
        {
            var created = await _appointmentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.AppointmentId }, created);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AppointmentDto dto)
        {
            if (id != dto.AppointmentId)
                return BadRequest("ID không khớp");

            var updated = await _appointmentService.UpdateAsync(id, dto);
            if (!updated) return NotFound();

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _appointmentService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
