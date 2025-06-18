using Medicare_backend.DTOs;

namespace Medicare_backend.Services.Interfaces
{
    public interface IAppointmentProxyService
    {
        Task<IEnumerable<AppointmentDto>> GetAllAsync();
        Task<AppointmentDto?> GetByIdAsync(int id);
        Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<AppointmentDto>> GetByDoctorIdAsync(int doctorId);
        Task<IEnumerable<AppointmentDto>> GetByClinicIdAsync(int clinicId);
        Task<AppointmentDto> CreateAsync(AppointmentDto dto);
        Task<bool> UpdateAsync(int id, AppointmentDto dto);
        Task<bool> DeleteAsync(int id);
    }
}