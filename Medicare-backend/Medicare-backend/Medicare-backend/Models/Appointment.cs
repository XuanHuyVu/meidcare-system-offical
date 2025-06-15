using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
    [Table("Appointments")]
    public class Appointment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("appointment_id")]
        public int AppointmentId { get; set; }

        [Required]
        [Column("patient_id")]
        public int PatientId { get; set; }

        [ForeignKey("PatientId")]
        public virtual Patient Patient { get; set; } = null!;

        [Required]
        [Column("doctor_id")]
        public int DoctorId { get; set; }

        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; } = null!;

        [Required]
        [Column("service_id")]
        public int ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; } = null!;

        [Required]
        [Column("clinic_id")]
        public int ClinicId { get; set; }

        [ForeignKey("ClinicId")]
        public virtual Clinic Clinic { get; set; } = null!;

        [Required]
        [Column("appointment_date", TypeName = "date")]
        public DateTime AppointmentDate { get; set; }

        [Required]
        [Column("appointment_time", TypeName = "time")]
        public TimeSpan AppointmentTime { get; set; }
    }
}
