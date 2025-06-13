using Medicare_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services
{
    public interface IClinicService
    {
        Task<IEnumerable<ClinicDto>> GetAllAsync();
        Task<ClinicDto?> GetByIdAsync(int id);
        Task<ClinicDto> CreateAsync(ClinicDto clinicDto);
        Task<bool> UpdateAsync(int id, ClinicDto clinicDto);
        Task<bool> DeleteAsync(int id);
    }
}
