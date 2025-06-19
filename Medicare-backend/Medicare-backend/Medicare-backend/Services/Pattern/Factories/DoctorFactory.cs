using Medicare_backend.Models;
using Medicare_backend.DTOs;
using AutoMapper;

namespace Medicare_backend.Services.Pattern.Factories
{
    public class DoctorFactory : IDoctorFactory
    {
        private readonly IMapper _mapper;

        public DoctorFactory(IMapper mapper)
        {
            _mapper = mapper;
        }

        public Doctor CreateDoctor(DoctorDto doctorDto)
        {
            return _mapper.Map<Doctor>(doctorDto);
        }

        public DoctorDto CreateDoctorDto(Doctor doctor)
        {
            return _mapper.Map<DoctorDto>(doctor);
        }
    }
} 