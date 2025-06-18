using Medicare_backend.Models;
using Medicare_backend.Data;
using Medicare_backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;
        private IServiceSearchStrategy? _searchStrategy;

        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void SetSearchStrategy(IServiceSearchStrategy strategy)
        {
            _searchStrategy = strategy;
        }

        public async Task<IEnumerable<Service>> SearchAsync()
        {
            if (_searchStrategy == null)
            {
                return await GetAllAsync();
            }

            var services = await _context.Services
                .Include(s => s.Doctor)
                .Include(s => s.Specialty)
                .ToListAsync();
            
            return services;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services
                .Include(s => s.Doctor)
                .Include(s => s.Specialty)
                .ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(int id)
        {
            return await _context.Services
                .Include(s => s.Doctor)
                .Include(s => s.Specialty)
                .FirstOrDefaultAsync(s => s.ServiceId == id);
        }

        public async Task<Service> AddAsync(Service service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task UpdateAsync(Service service)
        {
            _context.Entry(service).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service != null)
            {
                _context.Services.Remove(service);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Services.AnyAsync(s => s.ServiceId == id);
        }
    }
}
