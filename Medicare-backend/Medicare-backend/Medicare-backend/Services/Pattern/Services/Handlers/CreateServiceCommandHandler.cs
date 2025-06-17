using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System;
using System.Threading.Tasks;
using Medicare_backend.Application.Services.Commands;
namespace Medicare_backend.Application.Services.Handlers
{
    // Handler for creating a new service
    // This class handles the creation of a new service
    public class CreateServiceCommandHandler
    {
        private readonly IServiceRepository _repo;
        public CreateServiceCommandHandler(IServiceRepository repo)
        {
            _repo = repo;
        }

        public async Task<Service> Handle(CreateServiceCommand command)
        {
            var service = new Service
            {
                ServiceName = command.ServiceName,
                Cost = command.Cost,
                Duration = command.Duration,
                Description = command.Description,
                Image = command.Image,
                DoctorId = command.DoctorId,
                SpecialtyId = command.SpecialtyId,
                //IsActive = command.IsActive,
                //CreatedAt = DateTime.UtcNow
            };
            return await _repo.AddAsync(service);
        }
    }
} 