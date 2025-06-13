namespace Medicare_backend.DTOs
{
    public class DoctorDto
    {
        public int DoctorId { get; set; }
        public string? FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? SpecialtyName { get; set; }
        public string? Qualification { get; set; }
        public int YearsOfExperience { get; set; }
        public string? Avatar { get; set; }
        public string? Bio { get; set; }
    }
}
