namespace Medicare_backend.DTOs
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public string? PatientName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? DoctorName { get; set; }
        public string? ServiceName { get; set; }
        public string? SpecialtyName { get; set; }
        public string? ClinicName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
    }
}
