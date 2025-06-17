using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;
using Medicare_backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medicare_backend.Services.Interfaces;


namespace Medicare_backend.Services.Implementations
{
    public class WorkScheduleService : IWorkScheduleService
    {
        private readonly IWorkScheduleRepository _workScheduleRepository;
        private readonly IMapper _mapper;
        public WorkScheduleService(IWorkScheduleRepository workScheduleRepository, IMapper mapper)
        {
            _workScheduleRepository = workScheduleRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<WorkScheduleDto>> GetAllAsync()
        {
            var schedules = await _workScheduleRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<WorkScheduleDto>>(schedules);
        }
        public async Task<WorkScheduleDto?> GetByIdAsync(int id)
        {
            var schedule = await _workScheduleRepository.GetByIdAsync(id);
            if (schedule == null) return null;
            return _mapper.Map<WorkScheduleDto>(schedule);
        }
        public async Task<WorkScheduleDto> CreateAsync(CreateWorkScheduleDto dto)
        {
            var workSchedule = new WorkSchedule
            {
                WorkDate = dto.WorkDate,
                WorkTime = dto.WorkTime,
                DoctorId = dto.DoctorId,
                SpecialtyId = dto.SpecialtyId,
                ClinicId = dto.ClinicId,
                ServiceId = dto.ServiceId,
                Status = "Chưa có lịch"
            };

            // Lưu vào DB
            var created = await _workScheduleRepository.AddAsync(workSchedule);

            // Trả về kết quả sau khi thêm
            return _mapper.Map<WorkScheduleDto>(created);
        }


        public async Task<bool> UpdateAsync(int id, UpdateWorkScheduleDto dto)
        {
            if (!await _workScheduleRepository.ExistsAsync(id))
                return false;

            var schedule = new WorkSchedule
            {
                ScheduleId = id,
                WorkDate = dto.WorkDate,
                WorkTime = dto.WorkTime,
                DoctorId = dto.DoctorId,
                SpecialtyId = dto.SpecialtyId,
                ClinicId = dto.ClinicId,
                ServiceId = dto.ServiceId,
                Status = dto.Status,

                // Tránh EF cố tạo entity mới
                Doctor = null,
                Specialty = null,
                Clinic = null,
                Service = null
            };

            await _workScheduleRepository.UpdateAsync(schedule);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _workScheduleRepository.ExistsAsync(id)) return false;
            await _workScheduleRepository.DeleteAsync(id);
            return true;
        }
        public async Task<IEnumerable<WorkScheduleDto>> GetByDoctorIdAsync(int doctorId)
        {
            var schedules = await _workScheduleRepository.GetByDoctorIdAsync(doctorId);
            return _mapper.Map<IEnumerable<WorkScheduleDto>>(schedules);
        }
        public async Task<IEnumerable<WorkScheduleDto>> GetBySpecialtyIdAsync(int specialtyId)
        {
            var schedules = await _workScheduleRepository.GetBySpecialtyIdAsync(specialtyId);
            return _mapper.Map<IEnumerable<WorkScheduleDto>>(schedules);
        }
    }
}
