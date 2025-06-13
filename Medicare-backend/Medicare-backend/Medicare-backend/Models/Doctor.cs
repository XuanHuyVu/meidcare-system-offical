using Medicare_backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
    public class Doctor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("doctor_id")]
        public int DoctorId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("full_name")]
        public string? FullName { get; set; }

        [Required]
        [Column("date_of_birth")]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("gender")]
        public string? Gender { get; set; }

        [MaxLength(12)]
        [Column("phone_number")]
        public string? PhoneNumber { get; set; }

        [MaxLength(50)]
        [EmailAddress]
        [Column("email")]
        public string? Email { get; set; }

        [Required]
        [Column("specialty_id")]
        public int SpecialtyId { get; set; }

        [ForeignKey("SpecialtyId")]
        public virtual Specialty? Specialty { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("qualification")]
        public string? Qualification { get; set; }

        [Required]
        [Column("years_of_experience")]
        public int YearsOfExperience { get; set; }

        [MaxLength(255)]
        [Column("avatar")]
        public string? Avatar { get; set; }

        [MaxLength(500)]
        [Column("bio")]
        public string? Bio { get; set; }
    }
}
