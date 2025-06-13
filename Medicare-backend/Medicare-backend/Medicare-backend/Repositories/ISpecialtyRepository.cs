using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public interface ISpecialtyRepository
    {
        Task<IEnumerable<Specialty>> GetAllAsync();
        Task<Specialty?> GetByIdAsync(int id);
        Task<Specialty> AddAsync(Specialty specialty);
        Task UpdateAsync(Specialty specialty);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
