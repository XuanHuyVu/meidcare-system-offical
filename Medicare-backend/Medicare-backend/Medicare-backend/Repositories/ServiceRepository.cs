using Medicare_backend.Data;
using Medicare_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;
        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services.Include(s => s.Specialty).Include(s => s.Doctor).ToListAsync();
        }
        public async Task<Service?> GetByIdAsync(int id)
        {
            return await _context.Services.Include(s => s.Specialty)
                                        .Include(s => s.Doctor)
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
