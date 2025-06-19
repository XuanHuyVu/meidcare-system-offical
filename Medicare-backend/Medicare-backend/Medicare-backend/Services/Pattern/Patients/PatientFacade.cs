using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

using Medicare_backend.DTOs;
using Medicare_backend.Services.Pattern.Patients.Interfaces;
using Medicare_backend.Services.Interfaces;
using AutoMapper;

namespace Medicare_backend.Services.Pattern.Patients
{
    public class PatientFacade : IPatientFacade, IPatientSubject
    {
        private readonly List<IPatientObserver> _observers = new List<IPatientObserver>();
        private readonly IPatientService _patientService;
        private readonly IMedicalRecordService _medicalRecordService;
        private readonly IAppointmentService _appointmentService;
        private readonly IMapper _mapper;

        public PatientFacade(
            IPatientService patientService,
            IMedicalRecordService medicalRecordService,
            IAppointmentService appointmentService,
            IMapper mapper)
        {
            _patientService = patientService;
            _medicalRecordService = medicalRecordService;
            _appointmentService = appointmentService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
        {
            var patientDtos = await _patientService.GetAllAsync();
            NotifyObservers($"All patients were retrieved");
            return patientDtos;
        }

        public async Task<PatientDto> GetPatientByIdAsync(int id)
        {
            var patientDto = await _patientService.GetByIdAsync(id);
            if (patientDto != null)
            {
                NotifyObservers($"Patient {id} was retrieved");
            }
            return patientDto;
        }

        public async Task<bool> UpdatePatientAsync(PatientDto patientDto)
        {
            var result = await _patientService.UpdateAsync(patientDto.PatientId, patientDto);
            if (result)
            {
                NotifyObservers($"Patient {patientDto.PatientId} was updated");
            }
            return result;
        }

        public async Task<bool> AddPatientAsync(PatientDto patientDto)
        {
            var created = await _patientService.CreateAsync(patientDto);
            var result = created != null;
            if (result)
            {
                NotifyObservers($"New patient {created.PatientId} was added");
            }
            return result;
        }

        public async Task<bool> DeletePatientAsync(int id)
        {
            var result = await _patientService.DeleteAsync(id);
            if (result)
            {
                NotifyObservers($"Patient {id} was deleted");
            }
            return result;
        }

        public void RegisterObserver(IPatientObserver observer)
        {
            if (!_observers.Contains(observer))
            {
                _observers.Add(observer);
            }
        }

        public void RemoveObserver(IPatientObserver observer)
        {
            _observers.Remove(observer);
        }

        public void NotifyObservers(string message)
        {
            foreach (var observer in _observers)
            {
                observer.Update(message);
            }
        }

        public interface IPatientFacade
        {
            Task<PatientDto> GetPatientByIdAsync(int id);
            Task<bool> UpdatePatientAsync(PatientDto patientDto);
            Task<bool> AddPatientAsync(PatientDto patientDto);
            Task<bool> DeletePatientAsync(int id);
            void RegisterObserver(IPatientObserver observer);
            void RemoveObserver(IPatientObserver observer);
        }
    }
} 