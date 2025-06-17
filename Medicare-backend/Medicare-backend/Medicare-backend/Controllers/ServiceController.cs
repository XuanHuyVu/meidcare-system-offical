using Microsoft.AspNetCore.Mvc;
using Medicare_backend.Models;
using Medicare_backend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServiceController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetAllServices()
        {
            var services = await _serviceService.GetAllServicesAsync();
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetServiceById(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            return Ok(service);
        }

        [HttpPost]
        public async Task<ActionResult<Service>> CreateService(Service service)
        {
            var createdService = await _serviceService.CreateServiceAsync(service);
            return CreatedAtAction(nameof(GetServiceById), new { id = createdService.ServiceId }, createdService);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, Service service)
        {
            if (id != service.ServiceId)
            {
                return BadRequest();
            }

            await _serviceService.UpdateServiceAsync(service);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            await _serviceService.DeleteServiceAsync(id);
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Service>>> SearchServices(
            [FromQuery] string? searchTerm,
            [FromQuery] int? specialtyId)
        {
            var services = await _serviceService.SearchServicesAsync(searchTerm, specialtyId);
            return Ok(services);
        }
    }
} 