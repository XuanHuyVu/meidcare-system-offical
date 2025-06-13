using Medicare_backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
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
        public virtual Patient? Patient { get; set; }

        [Required]
        [Column("doctor_id")]
        public int DoctorId { get; set; }

        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }

        [Required]
        [Column("service_id")]
        public int ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public virtual Service? Service { get; set; }

        [Required]
        [Column("clinic_id")]
        public int ClinicId { get; set; }

        [ForeignKey("ClinicId")]
        public virtual Clinic? Clinic { get; set; }

        [Required]
        [Column("appointment_date")]
        public DateTime AppointmentDate { get; set; }

        [Required]
        [Column("appointment_time")]
        public TimeSpan AppointmentTime { get; set; }
    }
}