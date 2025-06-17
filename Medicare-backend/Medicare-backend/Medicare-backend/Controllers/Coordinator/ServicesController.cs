using Medicare_backend.DTOs;
using Medicare_backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medicare_backend.Models;

namespace Medicare_backend.Controllers.Coordinator
{
    [Route("api/coordinator/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireCoordinatorRole")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;
        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _serviceService.GetAllServicesAsync();
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _serviceService.GetServiceByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Service service)
        {
            var result = await _serviceService.CreateServiceAsync(service);
            return CreatedAtAction(nameof(GetById), new { id = result.ServiceId }, result);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Service service)
        {
            if (id != service.ServiceId) return BadRequest();
            var result = await _serviceService.UpdateServiceAsync(service);
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceService.DeleteServiceAsync(id);
            return NoContent();
        }
    }
}
