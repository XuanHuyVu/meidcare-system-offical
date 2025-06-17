using Medicare_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Interfaces
{
    public interface IWorkScheduleService
    {
        Task<IEnumerable<WorkScheduleDto>> GetAllAsync();
        Task<WorkScheduleDto?> GetByIdAsync(int id);
        Task<WorkScheduleDto> CreateAsync(CreateWorkScheduleDto workScheduleDto);
        Task<bool> UpdateAsync(int id, UpdateWorkScheduleDto workScheduleDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<WorkScheduleDto>> GetByDoctorIdAsync(int doctorId);
        Task<IEnumerable<WorkScheduleDto>> GetBySpecialtyIdAsync(int specialtyId);
    }
}
