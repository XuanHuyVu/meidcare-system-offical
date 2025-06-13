using Medicare_backend.DTOs;

namespace Medicare_backend.Services
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDto>> GetAllAsync();
        Task<AppointmentDto?> GetByIdAsync(int id);
        Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<AppointmentDto>> GetByDoctorIdAsync(int doctorId);
        Task<IEnumerable<AppointmentDto>> GetByClinicIdAsync(int clinicId);
        Task<AppointmentDto> CreateAsync(AppointmentDto appointmentDto);
        Task<bool> UpdateAsync(int id, AppointmentDto appointmentDto);
        Task<bool> DeleteAsync(int id);
    }
}
