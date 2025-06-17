namespace Medicare_backend.Application.Services.Commands
{
    public class CreateServiceCommand
    {
        public string ServiceName { get; set; }
        public decimal Cost { get; set; }
        public int Duration { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int DoctorId { get; set; }
        public int SpecialtyId { get; set; }
        public bool IsActive { get; set; }
    }
} 