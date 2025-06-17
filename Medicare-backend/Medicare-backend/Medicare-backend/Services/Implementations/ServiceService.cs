using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using Medicare_backend.Services.Interfaces;
using Medicare_backend.Services.Pattern;
using Medicare_backend.Services.Pattern.Services.Strategies;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Implementations
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IMapper _mapper;

        public ServiceService(IServiceRepository serviceRepository, IMapper mapper)
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

        public async Task<ServiceDto> CreateAsync(ServiceDto dto)
        {
            var service = _mapper.Map<Service>(dto);
            var created = await _serviceRepository.AddAsync(service);
            return _mapper.Map<ServiceDto>(created);
        }

        public async Task<bool> UpdateAsync(int id, ServiceDto dto)
        {
            if (!await _serviceRepository.ExistsAsync(id)) return false;
            var service = _mapper.Map<Service>(dto);
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

        public async Task<IEnumerable<Service>> GetAllServicesAsync()
        {
            return await _serviceRepository.GetAllAsync();
        }

        public async Task<Service> GetServiceByIdAsync(int id)
        {
            return await _serviceRepository.GetByIdAsync(id);
        }

        public async Task<Service> CreateServiceAsync(Service service)
        {
            return await _serviceRepository.AddAsync(service);
        }

        public async Task<Service> UpdateServiceAsync(Service service)
        {
            await _serviceRepository.UpdateAsync(service);
            return service;
        }

        public async Task DeleteServiceAsync(int id)
        {
            await _serviceRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Service>> SearchServicesAsync(string searchTerm, int? specialtyId)
        {
            if (!string.IsNullOrEmpty(searchTerm))
            {
                _serviceRepository.SetSearchStrategy(new ServiceNameSearchStrategy(searchTerm));
            }
            else if (specialtyId.HasValue)
            {
                _serviceRepository.SetSearchStrategy(new ServiceSpecialtySearchStrategy(specialtyId.Value));
            }

            return await _serviceRepository.SearchAsync();
        }
    }
}
