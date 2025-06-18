using Medicare_backend.DTOs;
using Medicare_backend.Services.Interfaces;
using Medicare_backend.Services.Pattern.Template;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Controllers.Coordinator
{
    [Route("api/coordinator/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireCoordinatorRole")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentProxyService _appointmentService;

        public AppointmentsController(IAppointmentProxyService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            var appointments = await _appointmentService.GetAllAsync();
            return Ok(appointments);
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
            var template = new AppointmentCreateTemplate(_appointmentService);
            try
            {
                var created = await template.ProcessAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.AppointmentId }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AppointmentDto dto)
        {
            dto.AppointmentId = id;
            var template = new AppointmentUpdateTemplate(_appointmentService, id);
            try
            {
                await template.ProcessAsync(dto);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var template = new AppointmentDeleteTemplate(_appointmentService);
            try
            {
                await template.ProcessAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
