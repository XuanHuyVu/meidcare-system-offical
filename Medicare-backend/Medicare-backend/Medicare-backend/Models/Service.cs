using Medicare_backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("service_id")]
        public int ServiceId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("service_name")]
        public string? ServiceName { get; set; }

        [MaxLength(500)]
        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("cost")]
        public decimal Cost { get; set; }

        [Required]
        [Column("duration")]
        public int Duration { get; set; }

        [Required]
        [Column("image")]
        [MaxLength(255)]
        public string? Image { get; set; }

        [Required]
        [Column("doctor_id")]
        public int DoctorId { get; set; }

        // Tham chiếu đúng đến entity Doctor
        [ForeignKey("DoctorId")]
        public virtual Doctor? Doctor { get; set; }

        // Tham chiếu đến entity Specialty
        [Required]
        [Column("specialty_id")]
        public int SpecialtyId { get; set; }

        [ForeignKey("SpecialtyId")]
        public virtual Specialty? Specialty { get; set; }
    }
}