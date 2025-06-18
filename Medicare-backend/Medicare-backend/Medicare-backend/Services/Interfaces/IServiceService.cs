using Medicare_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Interfaces
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetAllAsync();
        Task<ServiceDto?> GetByIdAsync(int id);
        Task<ServiceDto> CreateAsync(ServiceDto dto);
        Task<bool> UpdateAsync(int id, ServiceDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ServiceDto>> SearchAsync(string searchTerm, int? specialtyId);
    }
}
