using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medicare_backend.Services.Interfaces;

namespace Medicare_backend.Services.Implementations
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;

        private readonly IMapper _mapper;

        public AppointmentService(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAsync()
        {
            var appointments = await _appointmentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }
        public async Task<AppointmentDto?> GetByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null) return null;
            return _mapper.Map<AppointmentDto>(appointment);
        }
        public async Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId)
        {
            var appointments = await _appointmentRepository.GetByPatientIdAsync(patientId);
            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }
        
        public async Task<IEnumerable<AppointmentDto>> GetByDoctorIdAsync(int doctorId)
        {
            var appointments = await _appointmentRepository.GetByDoctorIdAsync(doctorId);
            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }
        public async Task<IEnumerable<AppointmentDto>> GetByClinicIdAsync(int clinicId)
        {
            var appointments = await _appointmentRepository.GetByClinicIdAsync(clinicId);
            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }
        public async Task<AppointmentDto> CreateAsync(AppointmentDto dto)
        {
            var appointment = _mapper.Map<Appointment>(dto);
            var created = await _appointmentRepository.AddAsync(appointment);
            return _mapper.Map<AppointmentDto>(created);
        }
        public async Task<bool> UpdateAsync(int id, AppointmentDto dto)
        {
            if (!await _appointmentRepository.ExistsAsync(id)) return false;
            var appointment = _mapper.Map<Appointment>(dto);
            appointment.AppointmentId = id;
            await _appointmentRepository.UpdateAsync(appointment);
            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _appointmentRepository.ExistsAsync(id)) return false;
            await _appointmentRepository.DeleteAsync(id);
            return true;
        }
    }
}
