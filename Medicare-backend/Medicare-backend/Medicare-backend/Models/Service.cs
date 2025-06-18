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
        public required string ServiceName { get; set; }

        [MaxLength(500)]
        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("cost")]
        public decimal Cost { get; set; }

        [Required]
        [Column("duration")]
        public int Duration { get; set; }

        [Column("image")]
        public string? Image { get; set; }

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

        // Constructor để khởi tạo object với required properties
        public Service()
        {
        }

        public Service(string serviceName, decimal cost, int duration, int doctorId, int specialtyId, string? description = null, string? image = null)
        {
            ServiceName = serviceName;
            Cost = cost;
            Duration = duration;
            DoctorId = doctorId;
            SpecialtyId = specialtyId;
            Description = description;
            Image = image;
        }
    }
} 