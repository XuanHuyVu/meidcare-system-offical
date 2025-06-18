using Medicare_backend.DTOs;
using Medicare_backend.Services.Interfaces;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Pattern.Template
{
    public class AppointmentUpdateTemplate : AppointmentTemplate<AppointmentDto>
    {
        private readonly IAppointmentProxyService _proxyService;
        private readonly int _id;

        public AppointmentUpdateTemplate(IAppointmentProxyService proxyService, int id)
        {
            _proxyService = proxyService;
            _id = id;
        }

        protected override async Task ValidateAsync(AppointmentDto dto)
        {
            // Có thể thêm các bước kiểm tra khác ở đây nếu muốn
        }

        protected override async Task<AppointmentDto> SaveAsync(AppointmentDto dto)
        {
            await _proxyService.UpdateAsync(_id, dto);
            return dto;
        }
    }
} 