using Medicare_backend.Models;
using Medicare_backend.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Pattern.Services.Strategies
{
    public class ServiceSpecialtySearchStrategy : IServiceSearchStrategy
    {
        private readonly int _specialtyId;

        public ServiceSpecialtySearchStrategy(int specialtyId)
        {
            _specialtyId = specialtyId;
        }

        public async Task<IEnumerable<Service>> SearchAsync(IQueryable<Service> query)
        {
            return await Task.FromResult(query
                .Where(s => s.SpecialtyId == _specialtyId)
                .ToList());
        }
    }
} 