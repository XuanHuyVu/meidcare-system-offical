using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System.Threading.Tasks;
using Medicare_backend.Application.Services.Commands; // Assuming UpdateServiceCommand is in this namespace
namespace Medicare_backend.Application.Services.Handlers
{
    public class UpdateServiceCommandHandler
    {
        private readonly IServiceRepository _repo;
        public UpdateServiceCommandHandler(IServiceRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(UpdateServiceCommand command)
        {
            var service = await _repo.GetByIdAsync(command.ServiceId);
            if (service == null) return false;

            service.ServiceName = command.ServiceName;
            service.Cost = command.Cost;
            service.Duration = command.Duration;
            service.Description = command.Description;
            service.Image = command.Image;
            service.DoctorId = command.DoctorId;
            service.SpecialtyId = command.SpecialtyId;
            //service.IsActive = command.IsActive;

            await _repo.UpdateAsync(service);
            return true;
        }
    }
} 