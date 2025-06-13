using Medicare_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetAllAsync();
        Task<ServiceDto?> GetByIdAsync(int id);
        Task<ServiceDto> CreateAsync(ServiceDto serviceDto);
        Task<bool> UpdateAsync(int id, ServiceDto serviceDto);
        Task<bool> DeleteAsync(int id);
    }
}
