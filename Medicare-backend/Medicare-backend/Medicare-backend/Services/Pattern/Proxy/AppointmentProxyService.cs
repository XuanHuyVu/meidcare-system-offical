using Medicare_backend.DTOs;
using Medicare_backend.Services.Interfaces;
using Medicare_backend.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Medicare_backend.Services.Pattern.Template;

namespace Medicare_backend.Services.Pattern.Proxy
{
    public class AppointmentProxyService : IAppointmentProxyService
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly ILogger<AppointmentProxyService> _logger;

        public AppointmentProxyService(
            IAppointmentService appointmentService, 
            IAppointmentRepository appointmentRepository,
            ILogger<AppointmentProxyService> logger)
        {
            _appointmentService = appointmentService;
            _appointmentRepository = appointmentRepository;
            _logger = logger;
        }

        private async Task ValidateAppointmentTime(AppointmentDto appointment, int? excludeAppointmentId = null)
        {
            try
            {
                _logger.LogInformation($"Validating appointment time for doctor {appointment.DoctorId} on {appointment.AppointmentDate} at {appointment.AppointmentTime}");

                // Lấy tất cả lịch hẹn của bác sĩ
                var existingAppointments = await _appointmentRepository.GetByDoctorIdAsync(appointment.DoctorId);
                
                _logger.LogInformation($"Found {existingAppointments.Count()} existing appointments for doctor {appointment.DoctorId}");

                // Kiểm tra xem có lịch hẹn nào trùng thời gian không
                var isOverlapping = existingAppointments.Any(a => 
                {
                    // So sánh ngày
                    var isSameDate = a.AppointmentDate.Date == appointment.AppointmentDate.Date;
                    
                    // So sánh thời gian (chính xác đến phút)
                    var appointmentTimeMinutes = appointment.AppointmentTime.Hours * 60 + appointment.AppointmentTime.Minutes;
                    var existingTimeMinutes = a.AppointmentTime.Hours * 60 + a.AppointmentTime.Minutes;
                    var isSameTime = appointmentTimeMinutes == existingTimeMinutes;
                    
                    // Bỏ qua lịch hiện tại khi cập nhật
                    var isNotCurrentAppointment = excludeAppointmentId == null || a.AppointmentId != excludeAppointmentId;

                    _logger.LogInformation($"Checking appointment {a.AppointmentId}: SameDate={isSameDate}, SameTime={isSameTime}, NotCurrent={isNotCurrentAppointment}");

                    return isNotCurrentAppointment && isSameDate && isSameTime;
                });

                if (isOverlapping)
                {
                    _logger.LogWarning($"Found overlapping appointment for doctor {appointment.DoctorId}");
                    throw new InvalidOperationException("Thời gian đặt lịch đã bị trùng với lịch hẹn khác của bác sĩ.");
                }

                _logger.LogInformation("No overlapping appointments found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating appointment time");
                throw;
            }
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAsync()
        {
            return await _appointmentService.GetAllAsync();
        }

        public async Task<AppointmentDto?> GetByIdAsync(int id)
        {
            return await _appointmentService.GetByIdAsync(id);
        }

        public async Task<IEnumerable<AppointmentDto>> GetByPatientIdAsync(int patientId)
        {
            return await _appointmentService.GetByPatientIdAsync(patientId);
        }

        public async Task<IEnumerable<AppointmentDto>> GetByDoctorIdAsync(int doctorId)
        {
            return await _appointmentService.GetByDoctorIdAsync(doctorId);
        }

        public async Task<IEnumerable<AppointmentDto>> GetByClinicIdAsync(int clinicId)
        {
            return await _appointmentService.GetByClinicIdAsync(clinicId);
        }

        public async Task<AppointmentDto> CreateAsync(AppointmentDto dto)
        {
            try
            {
                _logger.LogInformation($"Creating new appointment for doctor {dto.DoctorId}");
                
                // Kiểm tra trùng lịch trước khi tạo
                await ValidateAppointmentTime(dto);
                
                var result = await _appointmentService.CreateAsync(dto);
                _logger.LogInformation($"Successfully created appointment {result.AppointmentId}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment");
                throw new InvalidOperationException($"Không thể tạo lịch hẹn: {ex.Message}");
            }
        }

        public async Task<bool> UpdateAsync(int id, AppointmentDto dto)
        {
            try
            {
                _logger.LogInformation($"Updating appointment {id} for doctor {dto.DoctorId}");
                
                // Kiểm tra trùng lịch trước khi cập nhật
                await ValidateAppointmentTime(dto, id);
                
                var result = await _appointmentService.UpdateAsync(id, dto);
                _logger.LogInformation($"Successfully updated appointment {id}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment");
                throw new InvalidOperationException($"Không thể cập nhật lịch hẹn: {ex.Message}");
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _appointmentService.DeleteAsync(id);
        }
    }
} 