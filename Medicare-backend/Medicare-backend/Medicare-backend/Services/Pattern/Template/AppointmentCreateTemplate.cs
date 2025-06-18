using Medicare_backend.DTOs;
using Medicare_backend.Services.Interfaces;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Pattern.Template
{
    public class AppointmentCreateTemplate : AppointmentTemplate<AppointmentDto>
    {
        private readonly IAppointmentProxyService _proxyService;

        public AppointmentCreateTemplate(IAppointmentProxyService proxyService)
        {
            _proxyService = proxyService;
        }

        protected override Task ValidateAsync(AppointmentDto dto)
        {
            // Có thể thêm các bước kiểm tra khác ở đây nếu muốn
            return Task.CompletedTask;
        }

        protected override async Task<AppointmentDto> SaveAsync(AppointmentDto dto)
        {
            return await _proxyService.CreateAsync(dto);
        }
    }
} 