using Medicare_backend.Models;

namespace Medicare_backend.Repositories
{
    public interface IWorkScheduleRepository
    {
        Task<IEnumerable<WorkSchedule>> GetAllAsync();
        Task<WorkSchedule?> GetByIdAsync(int id);
        Task<WorkSchedule> AddAsync(WorkSchedule workSchedule);
        Task UpdateAsync(WorkSchedule workSchedule);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<WorkSchedule>> GetByDoctorIdAsync(int doctorId);
        Task<IEnumerable<WorkSchedule>> GetBySpecialtyIdAsync(int specialtyId);
    }
}
