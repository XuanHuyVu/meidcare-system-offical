using Medicare_backend.Data;
using Medicare_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public class WorkScheduleRepository : IWorkScheduleRepository
    {
        private readonly ApplicationDbContext _context;

        public WorkScheduleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkSchedule>> GetAllAsync()
        {
            return await _context.WorkSchedules
                .Include(ws => ws.Doctor)
                .Include(ws => ws.Specialty)
                .Include(ws => ws.Clinic)
                .Include(ws => ws.Service)
                .ToListAsync();
        }

        public async Task<WorkSchedule?> GetByIdAsync(int id)
        {
            return await _context.WorkSchedules
                .Include(ws => ws.Doctor)
                .Include(ws => ws.Specialty)
                .Include(ws => ws.Clinic)
                .Include(ws => ws.Service)
                .FirstOrDefaultAsync(ws => ws.ScheduleId == id);
        }

        public async Task<WorkSchedule> AddAsync(WorkSchedule workSchedule)
        {
            _context.WorkSchedules.Add(workSchedule);
            await _context.SaveChangesAsync();
            return workSchedule;
        }

        public async Task UpdateAsync(WorkSchedule workSchedule)
        {
            _context.Entry(workSchedule).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var workSchedule = await _context.WorkSchedules.FindAsync(id);
            if (workSchedule != null)
            {
                _context.WorkSchedules.Remove(workSchedule);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.WorkSchedules.AnyAsync(ws => ws.ScheduleId == id);
        }

        public async Task<IEnumerable<WorkSchedule>> GetByDoctorIdAsync(int doctorId)
        {
            return await _context.WorkSchedules
                .Where(ws => ws.DoctorId == doctorId)
                .Include(ws => ws.Doctor)
                .Include(ws => ws.Specialty)
                .Include(ws => ws.Clinic)
                .Include(ws => ws.Service)
                .ToListAsync();
        }

        public async Task<IEnumerable<WorkSchedule>> GetBySpecialtyIdAsync(int specialtyId)
        {
            return await _context.WorkSchedules
                .Where(ws => ws.SpecialtyId == specialtyId)
                .Include(ws => ws.Doctor)
                .Include(ws => ws.Specialty)
                .Include(ws => ws.Clinic)
                .Include(ws => ws.Service)
                .ToListAsync();
        }
    }
}
