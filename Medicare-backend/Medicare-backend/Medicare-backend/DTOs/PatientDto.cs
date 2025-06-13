namespace Medicare_backend.DTOs
{
    public class PatientDto
    {
        public int PatientId { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public String? Avatar { get; set; }
        public String? EmergencyContactName { get; set; }
        public String? EmergencyContactPhone { get; set; }
    }
}
