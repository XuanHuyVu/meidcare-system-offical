using Medicare_backend.DTOs;
using Medicare_backend.Services.Interfaces;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Pattern.Template
{
    public class AppointmentDeleteTemplate : AppointmentTemplate<int>
    {
        private readonly IAppointmentProxyService _proxyService;

        public AppointmentDeleteTemplate(IAppointmentProxyService proxyService)
        {
            _proxyService = proxyService;
        }

        protected override Task ValidateAsync(int id)
        {
            // Có thể kiểm tra quyền hoặc điều kiện xóa ở đây nếu muốn
            return Task.CompletedTask;
        }

        protected override async Task<int> SaveAsync(int id)
        {
            await _proxyService.DeleteAsync(id);
            return id;
        }
    }
} 