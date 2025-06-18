using Medicare_backend.DTOs;
using System.Threading.Tasks;

namespace Medicare_backend.Services.Pattern.Template
{
    public abstract class AppointmentTemplate<T>
    {
        public async Task<T> ProcessAsync(T dto)
        {
            await PreProcessAsync(dto);
            await ValidateAsync(dto);
            var result = await SaveAsync(dto);
            await PostProcessAsync(result);
            return result;
        }

        protected virtual Task PreProcessAsync(T dto) => Task.CompletedTask;
        protected abstract Task ValidateAsync(T dto);
        protected abstract Task<T> SaveAsync(T dto);
        protected virtual Task PostProcessAsync(T dto) => Task.CompletedTask;
    }
} 