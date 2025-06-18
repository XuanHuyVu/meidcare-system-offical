using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using Medicare_backend.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Implementations
{
    public class ServiceImplementation : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IMapper _mapper;

        public ServiceImplementation(IServiceRepository serviceRepository, IMapper mapper)
        {
            _serviceRepository = serviceRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ServiceDto>> GetAllAsync()
        {
            var services = await _serviceRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }

        public async Task<ServiceDto?> GetByIdAsync(int id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null) return null;

            return _mapper.Map<ServiceDto>(service);
        }

        public async Task<ServiceDto> CreateAsync(ServiceDto serviceDto)
        {
            var service = _mapper.Map<Service>(serviceDto);
            var created = await _serviceRepository.AddAsync(service);

            return _mapper.Map<ServiceDto>(created);
        }

        public async Task<bool> UpdateAsync(int id, ServiceDto serviceDto)
        {
            if (!await _serviceRepository.ExistsAsync(id)) return false;

            var service = _mapper.Map<Service>(serviceDto);
            service.ServiceId = id;

            await _serviceRepository.UpdateAsync(service);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _serviceRepository.ExistsAsync(id)) return false;

            await _serviceRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<ServiceDto>> SearchAsync(string searchTerm, int? specialtyId)
        {
            var services = await _serviceRepository.GetAllAsync();
            var filteredServices = services.Where(s => 
                (string.IsNullOrEmpty(searchTerm) || s.ServiceName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)) &&
                (!specialtyId.HasValue || s.SpecialtyId == specialtyId.Value)
            );
            
            return _mapper.Map<IEnumerable<ServiceDto>>(filteredServices);
        }
    }
}
