using Medicare_backend.DTOs;
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
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _service;
        public ServicesController(IServiceService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceDto serviceDto)
        {
            var result = await _service.CreateAsync(serviceDto);
            return CreatedAtAction(nameof(GetById), new { id = result.ServiceId }, result);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ServiceDto serviceDto)
        {
            if (id != serviceDto.ServiceId) return BadRequest();
            var result = await _service.UpdateAsync(id, serviceDto);
            if (!result) return NotFound();
            return Ok();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
