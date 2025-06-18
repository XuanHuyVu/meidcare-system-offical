using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using Medicare_backend.Factories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IDoctorFactory _doctorFactory;
        private readonly IMapper _mapper;

        public DoctorService(IDoctorRepository doctorRepository, IDoctorFactory doctorFactory, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _doctorFactory = doctorFactory;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DoctorDto>> GetAllAsync()
        {
            var doctors = await _doctorRepository.GetAllAsync();
            return doctors.Select(d => _doctorFactory.CreateDoctorDto(d));
        }

        public async Task<DoctorDto?> GetByIdAsync(int id)
        {
            var doctor = await _doctorRepository.GetByIdAsync(id);
            if (doctor == null) return null;
            return _doctorFactory.CreateDoctorDto(doctor);
        }

        public async Task<DoctorDto> CreateAsync(DoctorDto dto)
        {
            var doctor = _doctorFactory.CreateDoctor(dto);
            var created = await _doctorRepository.AddAsync(doctor);
            return _doctorFactory.CreateDoctorDto(created);
        }

        public async Task<bool> UpdateAsync(int id, DoctorDto dto)
        {
            if (!await _doctorRepository.ExistsAsync(id)) return false;
            var doctor = _doctorFactory.CreateDoctor(dto);
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
