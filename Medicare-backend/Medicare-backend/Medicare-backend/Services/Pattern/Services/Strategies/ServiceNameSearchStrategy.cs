using Medicare_backend.DTOs;
using Medicare_backend.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Pattern.Services.Strategies
{
    public class ServiceNameSearchStrategy : IServiceSearchStrategy
    {
        private readonly string _searchTerm;

        public ServiceNameSearchStrategy(string searchTerm)
        {
            _searchTerm = searchTerm;
        }

        public Task<IEnumerable<ServiceDto>> SearchAsync(IEnumerable<ServiceDto> services)
        {
            var result = services.Where(s => s.ServiceName != null && s.ServiceName.Contains(_searchTerm, System.StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(result);
        }
    }
} 