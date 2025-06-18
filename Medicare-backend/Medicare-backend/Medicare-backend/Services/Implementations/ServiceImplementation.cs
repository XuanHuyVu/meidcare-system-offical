using Medicare_backend.Models;
using Medicare_backend.Data;
using Medicare_backend.Services.Interfaces;
using Medicare_backend.Services.Pattern.Services.Strategies;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Medicare_backend.Services.Implementations
{
    public class ServiceImplementation : IService
    {
        private readonly ApplicationDbContext _context;
        private IServiceSearchStrategy? _searchStrategy;

        public ServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public void SetSearchStrategy(IServiceSearchStrategy strategy)
        {
            _searchStrategy = strategy;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services
                .Include(s => s.Specialty)
                .Include(s => s.Doctor)
                .OrderByDescending(s => s.ServiceId)
                .ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(int id)
        {
            return await _context.Services
                .Include(s => s.Specialty)
                .Include(s => s.Doctor)
                .FirstOrDefaultAsync(s => s.ServiceId == id);
        }

        public async Task<Service> CreateAsync(Service service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<Service?> UpdateAsync(int id, Service service)
        {
            if (id != service.ServiceId)
                return null;

            _context.Entry(service).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return false;

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Services.AnyAsync(s => s.ServiceId == id);
        }

        public async Task<IEnumerable<Service>> SearchAsync(string searchTerm, int? specialtyId)
        {
            if (!string.IsNullOrEmpty(searchTerm))
            {
                SetSearchStrategy(new ServiceNameSearchStrategy(searchTerm));
            }
            else if (specialtyId.HasValue)
            {
                SetSearchStrategy(new ServiceSpecialtySearchStrategy(specialtyId.Value));
            }

            if (_searchStrategy == null)
            {
                return await GetAllAsync();
            }

            var query = _context.Services
                .Include(s => s.Doctor)
                .Include(s => s.Specialty);
            
            return await _searchStrategy.SearchAsync(query);
        }
    }
} 