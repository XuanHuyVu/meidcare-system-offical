using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetAllAsync();
        Task<Service?> GetByIdAsync(int id);
        Task<Service> AddAsync(Service service);
        Task UpdateAsync(Service service);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
