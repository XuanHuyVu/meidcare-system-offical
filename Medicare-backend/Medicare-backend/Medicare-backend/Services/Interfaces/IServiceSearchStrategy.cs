using Medicare_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Interfaces
{
    public interface IServiceSearchStrategy
    {
        Task<IEnumerable<Service>> SearchAsync(IQueryable<Service> query);
    }
} 