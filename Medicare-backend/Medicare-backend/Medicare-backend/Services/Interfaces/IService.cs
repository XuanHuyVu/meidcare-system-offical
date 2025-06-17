using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services
{
    public interface IService
    {
        Task<IEnumerable<Service>> GetAllAsync();
        Task<Service> GetByIdAsync(int id);
        Task<Service> CreateAsync(Service service);
        Task<Service> UpdateAsync(int id, Service service);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
} 