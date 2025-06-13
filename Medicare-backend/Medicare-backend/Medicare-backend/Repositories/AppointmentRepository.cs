using Medicare_backend.Data;
using Medicare_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Medicare_backend.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Service).ThenInclude(s => s.Specialty)
                .Include(a => a.Clinic)
                .ToListAsync();
        }
        public async Task<Appointment?> GetByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Service).ThenInclude(s => s.Specialty)
                .Include(a => a.Clinic)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);
        }
        public async Task<IEnumerable<Appointment>> GetByPatientIdAsync(int patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .Include(a => a.Doctor)
                .Include(a => a.Service).ThenInclude(s => s.Specialty)
                .Include(a => a.Clinic)
                .ToListAsync();
        }
        public async Task<IEnumerable<Appointment>> GetByDoctorIdAsync(int doctorId)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .Include(a => a.Patient)
                .Include(a => a.Service).ThenInclude(s => s.Specialty)
                .Include(a => a.Clinic)
                .ToListAsync();
        }
        public async Task<IEnumerable<Appointment>> GetByClinicIdAsync(int clinicId)
        {
            return await _context.Appointments
                .Where(a => a.ClinicId == clinicId)
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Service).ThenInclude(s => s.Specialty)
                .ToListAsync();
        }
        
        public async Task<Appointment> AddAsync(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }
        public async Task UpdateAsync(Appointment appointment)
        {
            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment != null)
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Appointments.AnyAsync(a => a.AppointmentId == id);
        }
    }
}
