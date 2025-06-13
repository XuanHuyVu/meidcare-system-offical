using Medicare_backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicare_backend.Models
{
    public class Patient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("patient_id")]
        public int PatientId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("full_name")]
        public string? FullName { get; set; }

        [Required]
        [MaxLength(12)]
        [Column("phone_number")]
        public string? PhoneNumber { get; set; }

        [Required]
        [Column("date_of_birth")]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("gender")]
        public string? Gender { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("address")]
        public string? Address { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("email")]
        public string? Email { get; set; }

        [Required]
        [Column("avatar")]
        [MaxLength(255)]
        public String? Avatar { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("emergency_contact_name")]
        public String? EmergencyContactName { get; set; }

        [Required]
        [MaxLength(12)]
        [Column("emergency_contact_phone")]
        public String? EmergencyContactPhone { get; set; }
    }
}