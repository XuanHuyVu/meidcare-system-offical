﻿namespace Medicare_backend.DTOs
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int DoctorId { get; set; }
        public int ServiceId { get; set; }
        public int SpecialtyId { get; set; }
        public int ClinicId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
    }
}