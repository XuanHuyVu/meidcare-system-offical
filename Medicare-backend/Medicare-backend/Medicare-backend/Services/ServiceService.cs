using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services
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
    }
}
