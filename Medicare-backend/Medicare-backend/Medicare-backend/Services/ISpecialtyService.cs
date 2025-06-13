using Medicare_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services
{
    public interface ISpecialtyService
    {
        Task<IEnumerable<SpecialtyDto>> GetAllAsync();
        Task<SpecialtyDto?> GetByIdAsync(int id);
        Task<SpecialtyDto> CreateAsync(SpecialtyDto specialtyDto);
        Task<bool> UpdateAsync(int id, SpecialtyDto specialtyDto);
        Task<bool> DeleteAsync(int id);
    }
}
