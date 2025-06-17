using Medicare_backend.DTOs;

namespace Medicare_backend.Services.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientDto>> GetAllAsync();
        Task<PatientDto?> GetByIdAsync(int id);
        Task<PatientDto> CreateAsync(PatientDto patientDto);
        Task<bool> UpdateAsync(int id, PatientDto patientDto);
        Task<bool> DeleteAsync(int id);
    }
}
