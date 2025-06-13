using Medicare_backend.DTOs;
using Medicare_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Controllers.Coordinator
{
    [Route("api/coordinator/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireCoordinatorRole")]
    public class WorkSchedulesController : ControllerBase
    {
        private readonly IWorkScheduleService _workScheduleService;

        public WorkSchedulesController(IWorkScheduleService workScheduleService)
        {
            _workScheduleService = workScheduleService;
        }

        // GET: api/coordinator/workschedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkScheduleDto>>> GetAll()
        {
            var schedules = await _workScheduleService.GetAllAsync();
            return Ok(schedules);
        }

        // GET: api/coordinator/workschedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkScheduleDto>> GetById(int id)
        {
            var schedule = await _workScheduleService.GetByIdAsync(id);
            if (schedule == null)
                return NotFound();
            return Ok(schedule);
        }

        // POST: api/coordinator/workschedules
        [HttpPost]
        public async Task<ActionResult<WorkScheduleDto>> Create([FromBody] CreateWorkScheduleDto dto)
        {
            var created = await _workScheduleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.ScheduleId }, created);
        }

        // PUT: api/coordinator/workschedules/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkScheduleDto dto)
        {
            var success = await _workScheduleService.UpdateAsync(id, dto);
            if (!success)
                return NotFound();
            return NoContent();
        }

        // DELETE: api/coordinator/workschedules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _workScheduleService.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }
    }
}
