using System.Threading.Tasks;
using Medicare_backend.DTOs;

namespace Medicare_backend.Services.Pattern.Patients.Interfaces
{
    public interface IPatientFacade
    {
        Task<IEnumerable<PatientDto>> GetAllPatientsAsync();
        Task<PatientDto> GetPatientByIdAsync(int id);
        Task<bool> UpdatePatientAsync(PatientDto patientDto);
        Task<bool> AddPatientAsync(PatientDto patientDto);
        Task<bool> DeletePatientAsync(int id);
        void RegisterObserver(IPatientObserver observer);
        void RemoveObserver(IPatientObserver observer);
    }
} 