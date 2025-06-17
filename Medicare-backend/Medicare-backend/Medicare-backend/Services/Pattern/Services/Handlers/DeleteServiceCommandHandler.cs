using Medicare_backend.Repositories;
using System.Threading.Tasks;
using Medicare_backend.Application.Services.Commands; // Assuming DeleteServiceCommand is in this namespace
using Medicare_backend.Services.Interfaces;
namespace Medicare_backend.Application.Services.Handlers
{
    public class DeleteServiceCommandHandler
    {
        private readonly IServiceRepository _repo;
        public DeleteServiceCommandHandler(IServiceRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(DeleteServiceCommand command)
        {
            var service = await _repo.GetByIdAsync(command.ServiceId);
            if (service == null) return false;
            await _repo.DeleteAsync(service.ServiceId); 
            return true;
        }
    }
}
