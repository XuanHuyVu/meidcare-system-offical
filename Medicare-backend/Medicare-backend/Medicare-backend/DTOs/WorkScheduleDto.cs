namespace Medicare_backend.DTOs
{
    public class WorkScheduleDto
    {
        public int ScheduleId { get; set; }
        public string? DoctorName { get; set; }
        public string? SpecialtyName { get; set; }
        public DateTime WorkDate { get; set; }
        public string? WorkTime { get; set; }
        public string? ClinicName { get; set; }
        public string? ServiceName { get; set; }
        public string? Status { get; set; }
    }

    public class CreateWorkScheduleDto
    {
        public int DoctorId { get; set; }
        public int SpecialtyId { get; set; }
        public int ClinicId { get; set; }
        public int ServiceId { get; set; }
        public DateTime WorkDate { get; set; }
        public string? WorkTime { get; set; }
    }

    public class UpdateWorkScheduleDto
    {
        public DateTime WorkDate { get; set; }
        public string WorkTime { get; set; } = null!;
        public int DoctorId { get; set; }
        public int SpecialtyId { get; set; }
        public int ClinicId { get; set; }
        public int ServiceId { get; set; }
        public string? Status { get; set; }
    }

}
