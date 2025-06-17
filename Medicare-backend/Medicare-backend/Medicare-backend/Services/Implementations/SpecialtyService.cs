using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medicare_backend.Services.Interfaces;

namespace Medicare_backend.Services.Implementations
{
    public class SpecialtyService : ISpecialtyService
    {
        private readonly ISpecialtyRepository _specialtyRepository;
        private readonly IMapper _mapper;

        public SpecialtyService(ISpecialtyRepository specialtyRepository, IMapper mapper)
        {
            _specialtyRepository = specialtyRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SpecialtyDto>> GetAllAsync()
        {
            var specialties = await _specialtyRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SpecialtyDto>>(specialties);
        }

        public async Task<SpecialtyDto?> GetByIdAsync(int id)
        {
            var specialty = await _specialtyRepository.GetByIdAsync(id);
            if (specialty == null) return null;

            return _mapper.Map<SpecialtyDto>(specialty);
        }

        public async Task<SpecialtyDto> CreateAsync(SpecialtyDto specialtyDto)
        {
            var specialty = _mapper.Map<Specialty>(specialtyDto);
            var created = await _specialtyRepository.AddAsync(specialty);

            return _mapper.Map<SpecialtyDto>(created);
        }

        public async Task<bool> UpdateAsync(int id, SpecialtyDto specialtyDto)
        {
            if (!await _specialtyRepository.ExistsAsync(id)) return false;

            var specialty = _mapper.Map<Specialty>(specialtyDto);
            specialty.SpecialtyId = id;

            await _specialtyRepository.UpdateAsync(specialty);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _specialtyRepository.ExistsAsync(id)) return false;

            await _specialtyRepository.DeleteAsync(id);
            return true;
        }
    }
}
