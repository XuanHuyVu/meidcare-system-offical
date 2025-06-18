using Medicare_backend.Repositories;
using System.Threading.Tasks;
using Medicare_backend.Application.Services.Commands;
using Medicare_backend.DTOs;
using AutoMapper;

namespace Medicare_backend.Application.Services.Handlers
{
    public class UpdateServiceCommandHandler
    {
        private readonly IServiceRepository _repo;
        private readonly IMapper _mapper;
        public UpdateServiceCommandHandler(IServiceRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<ServiceDto?> Handle(UpdateServiceCommand command)
        {
            var service = await _repo.GetByIdAsync(command.ServiceId);
            if (service == null) return null;

            // Chuyển command sang DTO
            var dto = new ServiceDto
            {
                ServiceId = command.ServiceId,
                ServiceName = command.ServiceName,
                Cost = command.Cost,
                Duration = command.Duration,
                Description = command.Description,
                Image = command.Image,
                DoctorId = command.DoctorId,
                SpecialtyId = command.SpecialtyId,
            };

            // Map DTO sang entity để lưu
            var entity = _mapper.Map<Models.Service>(dto);
            await _repo.UpdateAsync(entity);
            return _mapper.Map<ServiceDto>(entity);
        }
    }
} 