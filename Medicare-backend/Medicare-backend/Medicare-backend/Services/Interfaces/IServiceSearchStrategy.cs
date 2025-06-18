using Medicare_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Interfaces
{
    public interface IServiceSearchStrategy
    {
        Task<IEnumerable<ServiceDto>> SearchAsync(IEnumerable<ServiceDto> services);
    }
} 