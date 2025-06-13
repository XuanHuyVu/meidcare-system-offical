using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public interface IPatientRepository
    {
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient?> GetByIdAsync(int id);
        Task<Patient> AddAsync(Patient patient);
        Task UpdateAsync(Patient patient);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
