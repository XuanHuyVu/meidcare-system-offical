using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public interface IClinicRepository
    {
        Task<IEnumerable<Clinic>> GetAllAsync();
        Task<Clinic?> GetByIdAsync(int id);
        Task<Clinic> AddAsync(Clinic clinic);
        Task UpdateAsync(Clinic clinic);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
