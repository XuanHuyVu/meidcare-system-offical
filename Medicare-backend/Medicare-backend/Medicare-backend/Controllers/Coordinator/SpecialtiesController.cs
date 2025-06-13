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
    public class SpecialtiesController : ControllerBase
    {
        private readonly ISpecialtyService _specialtyService;

        public SpecialtiesController(ISpecialtyService specialtyService)
        {
            _specialtyService = specialtyService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecialtyDto>>> GetAll()
        {
            var specialties = await _specialtyService.GetAllAsync();
            return Ok(specialties);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SpecialtyDto>> GetById(int id)
        {
            var specialty = await _specialtyService.GetByIdAsync(id);
            if (specialty == null) return NotFound();
            return Ok(specialty);
        }

        [HttpPost]
        public async Task<ActionResult<SpecialtyDto>> Create(SpecialtyDto dto)
        {
            var created = await _specialtyService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.SpecialtyId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SpecialtyDto dto)
        {
            if (id != dto.SpecialtyId)
                return BadRequest("ID không khớp");

            var updated = await _specialtyService.UpdateAsync(id, dto);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _specialtyService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
