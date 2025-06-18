using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Interfaces
{
    public interface IService
    {
        Task<IEnumerable<Service>> GetAllAsync();
        Task<Service?> GetByIdAsync(int id);
        Task<Service> CreateAsync(Service service);
        Task<Service?> UpdateAsync(int id, Service service);
        Task<bool> DeleteAsync(int id);
        void SetSearchStrategy(IServiceSearchStrategy strategy);
        Task<IEnumerable<Service>> SearchAsync(string searchTerm, int? specialtyId);
    }
} 