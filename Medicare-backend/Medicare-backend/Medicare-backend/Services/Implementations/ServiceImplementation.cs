using Medicare_backend.Models;
using Medicare_backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Medicare_backend.Services
{
    public class ServiceImplementation : IService
    {
        private readonly ApplicationDbContext _context;

        public ServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services
                .Include(s => s.Specialty)
                .Include(s => s.Doctor)
                .OrderByDescending(s => s.ServiceId)
                .ToListAsync();
        }

        public async Task<Service> GetByIdAsync(int id)
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

        public async Task<Service> UpdateAsync(int id, Service service)
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
    }
} 