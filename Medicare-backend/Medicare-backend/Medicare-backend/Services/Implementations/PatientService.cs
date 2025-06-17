using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medicare_backend.Services.Interfaces;

namespace Medicare_backend.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;
        public PatientService(IPatientRepository patientRepository, IMapper mapper)
        {
            _mapper = mapper;
            _patientRepository = patientRepository;
        }

        public async Task<IEnumerable<PatientDto>> GetAllAsync()
        {
            var patients = await _patientRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PatientDto>>(patients);
        }

        public async Task<PatientDto?> GetByIdAsync(int id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null) return null;

            return _mapper.Map<PatientDto>(patient);
        }

        public async Task<PatientDto> CreateAsync(PatientDto patientDto)
        {
            var patient = _mapper.Map<Patient>(patientDto);
            var createdPatient = await _patientRepository.AddAsync(patient);

            return _mapper.Map<PatientDto>(createdPatient);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _patientRepository.ExistsAsync(id)) return false;

            await _patientRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> UpdateAsync(int id, PatientDto patientDto)
        {
            if (!await _patientRepository.ExistsAsync(id)) return false;

            var patient = _mapper.Map<Patient>(patientDto);
            patient.PatientId = id; // Ensure the ID is set for the update

            await _patientRepository.UpdateAsync(patient);
            return true;
        }
    }
}
