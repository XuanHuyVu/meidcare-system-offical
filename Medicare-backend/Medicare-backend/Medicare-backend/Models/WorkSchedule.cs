using Medicare_backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
    public class WorkSchedule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("schedule_id")]
        public int ScheduleId { get; set; }

        [Required]
        [Column("doctor_id")]
        public int DoctorId { get; set; }

        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }

        [Required]
        [Column("specialty_id")]
        public int SpecialtyId { get; set; }

        [ForeignKey("SpecialtyId")]
        public virtual Specialty? Specialty { get; set; }

        [Required]
        [Column("work_date")]
        public DateTime WorkDate { get; set; }

        [Required]
        [Column("work_time")]
        public String? WorkTime { get; set; }

        [Required]
        [Column("clinic_id")]
        public int ClinicId { get; set; }

        [ForeignKey("ClinicId")]
        public virtual Clinic? Clinic { get; set; }

        [Required]
        [Column("service_id")]
        public int ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public virtual Service? Service { get; set; }

        [Required]
        [Column("status")]
        public string? Status { get; set; }

    }
}