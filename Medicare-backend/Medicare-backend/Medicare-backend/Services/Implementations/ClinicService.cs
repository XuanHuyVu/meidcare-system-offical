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
    public class ClinicService : IClinicService
    {
        private readonly IClinicRepository _clinicRepository;
        private readonly IMapper _mapper;

        public ClinicService(IClinicRepository clinicRepository, IMapper mapper)
        {
            _clinicRepository = clinicRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ClinicDto>> GetAllAsync()
        {
            var clinics = await _clinicRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ClinicDto>>(clinics);
        }

        public async Task<ClinicDto?> GetByIdAsync(int id)
        {
            var clinic = await _clinicRepository.GetByIdAsync(id);
            if (clinic == null) return null;

            return _mapper.Map<ClinicDto>(clinic);
        }

        public async Task<ClinicDto> CreateAsync(ClinicDto clinicDto)
        {
            var clinic = _mapper.Map<Clinic>(clinicDto);
            var createdClinic = await _clinicRepository.AddAsync(clinic);

            return _mapper.Map<ClinicDto>(createdClinic);
        }

        public async Task<bool> UpdateAsync(int id, ClinicDto clinicDto)
        {
            if (!await _clinicRepository.ExistsAsync(id)) return false;

            var clinic = _mapper.Map<Clinic>(clinicDto);
            clinic.ClinicId = id; // Ensure the ID is set for the update

            await _clinicRepository.UpdateAsync(clinic);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _clinicRepository.ExistsAsync(id)) return false;

            await _clinicRepository.DeleteAsync(id);
            return true;
        }
    }
}