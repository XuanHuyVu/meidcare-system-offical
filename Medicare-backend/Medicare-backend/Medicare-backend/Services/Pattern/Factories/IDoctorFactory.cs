using Medicare_backend.Models;
using Medicare_backend.DTOs;

namespace Medicare_backend.Services.Pattern.Factories
{
    public interface IDoctorFactory
    {
        Doctor CreateDoctor(DoctorDto doctorDto);
        DoctorDto CreateDoctorDto(Doctor doctor);
    }
} 