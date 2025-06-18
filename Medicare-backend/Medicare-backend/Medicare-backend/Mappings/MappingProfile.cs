using AutoMapper;
using Medicare_backend.DTOs;
using Medicare_backend.Models;

namespace Medicare_backend.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Specialty, SpecialtyDto>().ReverseMap();

            CreateMap<Clinic, ClinicDto>().ReverseMap();

            CreateMap<Doctor, DoctorDto>()
                .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.Specialty.SpecialtyName))
                .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.SpecialtyId));
            CreateMap<DoctorDto, Doctor>();

            CreateMap<Service, ServiceDto>().ReverseMap();

            CreateMap<Patient, PatientDto>().ReverseMap();

            CreateMap<WorkSchedule, WorkScheduleDto>()
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor.FullName))
                .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.Specialty.SpecialtyName))
                .ForMember(dest => dest.ClinicName, opt => opt.MapFrom(src => src.Clinic.ClinicName))
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.ServiceName));

            CreateMap<CreateWorkScheduleDto, WorkSchedule>()
                .ForMember(dest => dest.ClinicId, opt => opt.MapFrom(src => src.ClinicId))
                .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.DoctorId))
                .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
                .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.SpecialtyId));

            CreateMap<UpdateWorkScheduleDto, WorkSchedule>()
                .ForMember(dest => dest.ClinicId, opt => opt.MapFrom(src => src.ClinicId))
                .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.DoctorId))
                .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
                .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.SpecialtyId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.FullName))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.Patient.DateOfBirth))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor.FullName))
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.ServiceName))
                .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.Service.Specialty.SpecialtyName))
                .ForMember(dest => dest.ClinicName, opt => opt.MapFrom(src => src.Clinic.ClinicName))
                .ReverseMap();
        }
    }
}
