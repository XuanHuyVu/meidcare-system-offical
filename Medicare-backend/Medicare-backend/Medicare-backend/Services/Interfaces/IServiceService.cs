using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Interfaces
{
    public interface IServiceService
    {
        Task<IEnumerable<Service>> GetAllServicesAsync();
        Task<Service> GetServiceByIdAsync(int id);
        Task<Service> CreateServiceAsync(Service service);
        Task<Service> UpdateServiceAsync(Service service);
        Task DeleteServiceAsync(int id);
        Task<IEnumerable<Service>> SearchServicesAsync(string searchTerm, int? specialtyId);
    }
}
