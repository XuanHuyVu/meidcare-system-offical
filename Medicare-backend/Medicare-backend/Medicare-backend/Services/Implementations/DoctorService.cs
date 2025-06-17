using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medicare_backend.Services.Interfaces;

namespace Medicare_backend.Services.Implementations
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public DoctorService(IDoctorRepository doctorRepository, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DoctorDto>> GetAllAsync()
        {
            var doctors = await _doctorRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<DoctorDto>>(doctors);
        }

        public async Task<DoctorDto?> GetByIdAsync(int id)
        {
            var doctor = await _doctorRepository.GetByIdAsync(id);
            if (doctor == null) return null;
            return _mapper.Map<DoctorDto>(doctor);
        }

        public async Task<DoctorDto> CreateAsync(DoctorDto dto)
        {
            var doctor = _mapper.Map<Doctor>(dto);
            var created = await _doctorRepository.AddAsync(doctor);

            return _mapper.Map<DoctorDto>(created);
        }

        public async Task<bool> UpdateAsync(int id, DoctorDto dto)
        {
            if (!await _doctorRepository.ExistsAsync(id)) return false;

            var doctor = _mapper.Map<Doctor>(dto);
            doctor.DoctorId = id;

            await _doctorRepository.UpdateAsync(doctor);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _doctorRepository.ExistsAsync(id)) return false;

            await _doctorRepository.DeleteAsync(id);
            return true;
        }
    }
}
