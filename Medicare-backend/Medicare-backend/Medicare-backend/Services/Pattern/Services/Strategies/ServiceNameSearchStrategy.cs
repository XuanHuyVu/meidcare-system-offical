using Medicare_backend.Models;
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
            _searchTerm = searchTerm?.ToLower() ?? string.Empty;
        }

        public async Task<IEnumerable<Service>> SearchAsync(IQueryable<Service> query)
        {
            return await Task.FromResult(query
                .Where(s => s.ServiceName.ToLower().Contains(_searchTerm))
                .ToList());
        }
    }
} 