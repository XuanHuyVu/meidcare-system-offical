using Medicare_backend.DTOs;
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

        public Task<IEnumerable<ServiceDto>> SearchAsync(IEnumerable<ServiceDto> services)
        {
            var result = services.Where(s => s.SpecialtyId == _specialtyId);
            return Task.FromResult(result);
        }
    }
} 