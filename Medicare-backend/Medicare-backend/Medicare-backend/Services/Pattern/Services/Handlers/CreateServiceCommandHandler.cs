using Medicare_backend.Repositories;
using System.Threading.Tasks;
using Medicare_backend.Application.Services.Commands;
using Medicare_backend.DTOs;
using AutoMapper;

namespace Medicare_backend.Application.Services.Handlers
{
    // Handler for creating a new service
    // This class handles the creation of a new service
    public class CreateServiceCommandHandler
    {
        private readonly IServiceRepository _repo;
        private readonly IMapper _mapper;
        public CreateServiceCommandHandler(IServiceRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<ServiceDto> Handle(CreateServiceCommand command)
        {
            // Chuyển command sang DTO
            var dto = new ServiceDto
            {
                ServiceName = command.ServiceName,
                Cost = command.Cost,
                Duration = command.Duration,
                Description = command.Description,
                Image = command.Image,
                DoctorId = command.DoctorId,
                SpecialtyId = command.SpecialtyId,
            };
            // Map DTO sang entity để lưu
            var created = await _repo.AddAsync(_mapper.Map<Models.Service>(dto));
            return _mapper.Map<ServiceDto>(created);
        }
    }
} 