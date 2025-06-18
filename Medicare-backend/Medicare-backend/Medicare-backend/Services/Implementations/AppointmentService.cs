using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medicare_backend.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace Medicare_backend.Services.Implementations
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<AppointmentService> _logger;

        public AppointmentService(
            IAppointmentRepository appointmentRepository, 
            IMapper mapper,
            ILogger<AppointmentService> logger)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
            _logger = logger;
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
            try
            {
                _logger.LogInformation($"Creating appointment for doctor {dto.DoctorId}");
                
                var appointment = _mapper.Map<Appointment>(dto);
                var created = await _appointmentRepository.AddAsync(appointment);
                
                _logger.LogInformation($"Successfully created appointment {created.AppointmentId}");
                return _mapper.Map<AppointmentDto>(created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(int id, AppointmentDto dto)
        {
            try
            {
                _logger.LogInformation($"Updating appointment {id}");
                
                if (!await _appointmentRepository.ExistsAsync(id))
                {
                    _logger.LogWarning($"Appointment {id} not found");
                    return false;
                }

                var appointment = _mapper.Map<Appointment>(dto);
                appointment.AppointmentId = id;
                await _appointmentRepository.UpdateAsync(appointment);
                
                _logger.LogInformation($"Successfully updated appointment {id}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting appointment {id}");
                
                if (!await _appointmentRepository.ExistsAsync(id))
                {
                    _logger.LogWarning($"Appointment {id} not found");
                    return false;
                }

                await _appointmentRepository.DeleteAsync(id);
                _logger.LogInformation($"Successfully deleted appointment {id}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment");
                throw;
            }
        }
    }
}
